import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// POST /api/admin/registrations/approve - Approve or reject a registration
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    let adminUserId: string | null = null;
    let adminRole: string | null = null;

    // Try to get user from Authorization header first
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const userData = JSON.parse(token);
        if (userData && userData.id && userData.role) {
          adminUserId = userData.id;
          adminRole = userData.role;
        }
      } catch {
        // Not valid JSON, try as Supabase JWT
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (!authError && user) {
          adminUserId = user.id;
          const { data: adminUser } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          adminRole = adminUser?.role || '';
        }
      }
    }

    // If no user from auth header, try cookie
    if (!adminUserId || !adminRole) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
        if (userCookie) {
          try {
            const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
            const cookieUser = JSON.parse(cookieValue);
            if (cookieUser?.id && cookieUser?.role) {
              adminUserId = cookieUser.id;
              adminRole = cookieUser.role;
            }
          } catch {
            // Invalid cookie
          }
        }
      }
    }

    // Verify user is admin
    if (!adminUserId || adminRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, adminId, adminNotes } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Registration ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
    }

    // Get the registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (regError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update the registration
    const { data: updatedRegistration, error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        status: newStatus,
        reviewed_by: adminId || adminUserId,
        reviewed_at: now,
        admin_notes: adminNotes || null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Registration update error:', updateError);
      return NextResponse.json({ error: updateError.message || 'Failed to update registration' }, { status: 500 });
    }

    // If approved, create the appropriate user record
    if (action === 'approve') {
      if (registration.user_type === 'student') {
        // Check if student record already exists
        const { data: existingStudent } = await supabaseAdmin
          .from('students')
          .select('id')
          .eq('email', registration.email)
          .maybeSingle();

        if (!existingStudent) {
          // Create student record
          const { error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
              user_id: adminUserId,
              full_name: registration.full_name,
              email: registration.email,
              phone: registration.phone,
              country: registration.country,
              age: registration.age,
              language: registration.language || 'English',
              guardian_name: registration.guardian_name,
              guardian_phone: registration.guardian_phone,
              specialization: registration.specialization,
              status: 'active',
              approved_by: adminId || adminUserId,
              approved_at: now
            });

          if (studentError) {
            console.error('Student creation error:', studentError);
          }
        }
      } else if (registration.user_type === 'teacher') {
        // Check if teacher record already exists
        const { data: existingTeacher } = await supabaseAdmin
          .from('teachers')
          .select('id')
          .eq('email', registration.email)
          .maybeSingle();

        if (!existingTeacher) {
          // Create teacher record
          const { error: teacherError } = await supabaseAdmin
            .from('teachers')
            .insert({
              user_id: adminUserId,
              full_name: registration.full_name,
              email: registration.email,
              phone: registration.phone,
              country: registration.country,
              qualification: registration.qualification,
              qualifications: registration.qualifications,
              experience_years: registration.experience_years,
              bio: registration.bio,
              specialization: registration.specialization,
              cv_url: registration.cv_url,
              certification_url: registration.certification_url,
              languages_known: registration.languages_known,
              status: 'approved',
              approved_by: adminId || adminUserId,
              approved_at: now
            });

          if (teacherError) {
            console.error('Teacher creation error:', teacherError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      registration: updatedRegistration
    });

  } catch (error: any) {
    console.error('Registration approval error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
