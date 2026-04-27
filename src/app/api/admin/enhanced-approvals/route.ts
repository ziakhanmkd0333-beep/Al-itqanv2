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
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) return { error: 'Unauthorized' };
    
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

// GET /api/admin/enhanced-approvals - Get all applications
export async function GET(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const { error: authError } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Build query
    let query = supabaseAdmin
      .from('students')
      .select(`
        id,
        user_id,
        full_name,
        email,
        phone,
        country,
        city,
        full_address,
        profile_picture_url,
        role,
        status,
        is_approved,
        is_flagged,
        flag_reason,
        submitted_from_ip,
        created_at,
        guardian_name,
        guardian_phone,
        academic_details,
        school_name,
        mosque_name,
        madrasa_name
      `);

    // Apply filters
    if (status && status !== 'all') {
      if (status === 'flagged') {
        query = query.eq('is_flagged', true);
      } else {
        query = query.eq('status', status);
      }
    }
    
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Order by created_at desc (newest first)
    query = query.order('created_at', { ascending: false });

    const { data: students, error: studentsError } = await query;

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    // Fetch additional data for each student
    const applications = await Promise.all(
      (students || []).map(async (student: Record<string, unknown>) => {
        // Fetch Islamic qualifications
        const { data: qualifications } = await supabaseAdmin
          .from('islamic_education_qualifications')
          .select('*')
          .eq('student_id', student.id)
          .single();

        // Fetch previous education
        const { data: education } = await supabaseAdmin
          .from('previous_education')
          .select('*')
          .eq('student_id', student.id);

        // Fetch role-specific info
        const { data: roleInfo } = await supabaseAdmin
          .from('role_specific_info')
          .select('*')
          .eq('user_id', student.user_id)
          .eq('role', student.role)
          .single();

        return {
          ...student,
          islamic_qualifications: qualifications || null,
          previous_education: education || [],
          role_info: roleInfo || null,
        };
      })
    );

    // Also fetch teachers with similar structure
    let teachersQuery = supabaseAdmin
      .from('teachers')
      .select(`
        id,
        user_id,
        full_name,
        email,
        phone,
        country,
        city,
        full_address,
        profile_picture_url,
        role,
        status,
        is_approved,
        is_flagged,
        flag_reason,
        submitted_from_ip,
        created_at,
        school_name,
        teaching_subject,
        years_of_experience,
        mosque_name,
        mosque_city,
        mosque_address,
        years_serving,
        madrasa_name,
        madrasa_city,
        madrasa_address,
        subjects_teaching
      `);

    // Apply filters
    if (status && status !== 'all') {
      if (status === 'flagged') {
        teachersQuery = teachersQuery.eq('is_flagged', true);
      } else {
        teachersQuery = teachersQuery.eq('status', status);
      }
    }
    
    if (role && role !== 'all') {
      teachersQuery = teachersQuery.eq('role', role);
    }

    if (search) {
      teachersQuery = teachersQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    teachersQuery = teachersQuery.order('created_at', { ascending: false });

    const { data: teachers, error: teachersError } = await teachersQuery;

    if (teachersError) {
      console.error('Error fetching teachers:', teachersError);
    }

    // Format teacher data to match student structure
    const formattedTeachers = (teachers || []).map((teacher: Record<string, unknown>) => ({
      ...teacher,
      role_info: {
        school_name: teacher.school_name,
        teaching_subject: teacher.teaching_subject,
        years_of_experience: teacher.years_of_experience,
        mosque_name: teacher.mosque_name,
        mosque_city: teacher.mosque_city,
        mosque_address: teacher.mosque_address,
        years_serving: teacher.years_serving,
        madrasa_name: teacher.madrasa_name,
        madrasa_city: teacher.madrasa_city,
        madrasa_address: teacher.madrasa_address,
        subjects_teaching: teacher.subjects_teaching,
      },
      previous_education: [],
    }));

    // Combine and sort all applications
    const allApplications = [...applications, ...formattedTeachers].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      applications: allApplications,
      count: allApplications.length,
    });

  } catch (error: unknown) {
    console.error('Enhanced approvals GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
