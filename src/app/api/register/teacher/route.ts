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

export const dynamic = 'force-dynamic';

// POST /api/register/teacher - Register a new teacher
export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const qualification = formData.get('qualification') as string;
    const experience = formData.get('experience') as string;
    const specialization = formData.get('specialization') as string;
    const languagesKnown = JSON.parse(formData.get('languagesKnown') as string || '[]');
    const cvFile = formData.get('cvFile') as File | null;
    const certificationFile = formData.get('certificationFile') as File | null;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message || 'Failed to create user account' }, { status: 400 });
    }

    const userId = authData.user.id;

    // Handle file uploads (store as URLs - in production, use proper storage)
    let cvUrl: string | null = null;
    let certificationUrl: string | null = null;

    if (cvFile) {
      // In production, upload to Supabase Storage
      // For now, just store the filename
      cvUrl = `pending-upload/${userId}/${cvFile.name}`;
    }

    if (certificationFile) {
      certificationUrl = `pending-upload/${userId}/${certificationFile.name}`;
    }

    // Create teacher record
    const { data: teacher, error: teacherError } = await supabaseAdmin
      .from('teachers')
      .insert({
        user_id: userId,
        full_name: fullName,
        email,
        phone: phone || null,
        country: country || null,
        qualification: qualification || null,
        experience_years: experience ? parseInt(experience.split('-')[0]) : 0,
        specialization: specialization || null,
        languages_known: languagesKnown,
        cv_url: cvUrl,
        certification_url: certificationUrl,
        status: 'pending', // Teachers need admin approval
      })
      .select()
      .single();

    if (teacherError) {
      // Rollback: delete the auth user if teacher creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: teacherError.message || 'Failed to create teacher record' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Teacher registration submitted successfully. Please wait for admin approval.',
      teacher: {
        id: teacher.id,
        fullName: teacher.full_name,
        email: teacher.email,
        status: teacher.status
      }
    });

  } catch (error: any) {
    console.error('Teacher registration error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}