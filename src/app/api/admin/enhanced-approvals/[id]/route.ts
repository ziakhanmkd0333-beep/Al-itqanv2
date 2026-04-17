import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

// Verify admin access
type VerifyAdminResult = 
  | { user: { id: string; role: string }; error?: never }
  | { user?: never; error: string };

const verifyAdmin = async (supabase: ReturnType<typeof getSupabaseAdmin>, authHeader: string | null): Promise<VerifyAdminResult> => {
  if (!authHeader) return { error: 'Unauthorized' };
  
  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return { error: 'Unauthorized' };
    
    // Check if user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, id')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData || userData.role !== 'admin') {
      return { error: 'Forbidden - Admin access required' };
    }
    
    return { user: userData };
  } catch {
    return { error: 'Unauthorized' };
  }
};

export const dynamic = 'force-dynamic';

// POST /api/admin/enhanced-approvals/[id] - Approve or reject application
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const applicationId = params.id;
    
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const { error: authError, user: adminUser } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (authError || !adminUser) {
      return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { action, notes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Try to find in students table first
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('*, users!inner(*)')
      .eq('id', applicationId)
      .single();

    let isTeacher = false;
    let application: typeof student = student;

    // If not found in students, try teachers
    if (studentError || !student) {
      const { data: teacher, error: teacherError } = await supabaseAdmin
        .from('teachers')
        .select('*, users!inner(*)')
        .eq('id', applicationId)
        .single();

      if (teacherError || !teacher) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      isTeacher = true;
      application = teacher;
    }

    const now = new Date().toISOString();
    const tableName = isTeacher ? 'teachers' : 'students';

    // Update application status
    const updateData: Record<string, string | boolean | null> = {
      status: action === 'approve' ? 'approved' : 'rejected',
      is_approved: action === 'approve',
      reviewed_at: now,
      reviewed_by: adminUser.id,
      review_notes: notes || null,
    };

    // If approving, clear flag
    if (action === 'approve') {
      updateData.is_flagged = false;
      updateData.flag_reason = null;
    }

    const { error: updateError } = await supabaseAdmin
      .from(tableName)
      .update(updateData)
      .eq('id', applicationId);

    if (updateError) {
      console.error(`Error updating ${tableName}:`, updateError);
      return NextResponse.json(
        { error: `Failed to ${action} application` },
        { status: 500 }
      );
    }

    // Update users table
    const { error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({
        is_active: action === 'approve',
        is_approved: action === 'approve',
      })
      .eq('id', application.user_id);

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
    }

    // Send email notification (placeholder - implement with your email service)
    // await sendEmailNotification(application.email, action, application.full_name);

    // Log admin action
    try {
      await supabaseAdmin.from('admin_activity_logs').insert({
        admin_id: adminUser.id,
        action: action === 'approve' ? 'application_approved' : 'application_rejected',
        target_type: isTeacher ? 'teacher' : 'student',
        target_id: applicationId,
        details: { notes: notes || null },
        created_at: now,
      });
    } catch (err: unknown) {
      console.error('Error logging admin action:', err);
    }

    return NextResponse.json({
      success: true,
      message: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      data: {
        applicationId,
        action,
        reviewedAt: now,
        reviewedBy: adminUser.id,
      },
    });

  } catch (error: unknown) {
    console.error('Enhanced approval POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/admin/enhanced-approvals/[id] - Get single application details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const applicationId = params.id;
    
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const { error: authError } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Try students table first
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select(`
        *,
        islamic_education_qualifications(*),
        previous_education(*),
        role_specific_info(*)
      `)
      .eq('id', applicationId)
      .single();

    if (student && !studentError) {
      return NextResponse.json({
        success: true,
        application: {
          ...student,
          type: 'student',
        },
      });
    }

    // Try teachers table
    const { data: teacher, error: teacherError } = await supabaseAdmin
      .from('teachers')
      .select(`
        *,
        previous_education(*),
        role_specific_info(*)
      `)
      .eq('id', applicationId)
      .single();

    if (teacher && !teacherError) {
      return NextResponse.json({
        success: true,
        application: {
          ...teacher,
          type: 'teacher',
        },
      });
    }

    return NextResponse.json(
      { error: 'Application not found' },
      { status: 404 }
    );

  } catch (error: unknown) {
    console.error('Enhanced approval GET single error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
