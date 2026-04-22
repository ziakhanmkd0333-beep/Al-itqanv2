import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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
    const cvFileUrl = formData.get('cvFileUrl') as string | null;
    const certificationFileUrl = formData.get('certificationFileUrl') as string | null;

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

    // Hash password for users table (fallback login)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user record in users table for fallback login
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role: 'teacher',
        password_hash: passwordHash,
        is_active: true,
        created_at: new Date().toISOString(),
      });

    if (userError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: userError.message || 'Failed to create user record' }, { status: 500 });
    }

    // Use the provided Supabase URLs
    const cvUrl = cvFileUrl;
    const certificationUrl = certificationFileUrl;

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
      // Rollback: delete the auth user and users record if teacher creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin.from('users').delete().eq('id', userId);
      return NextResponse.json({ error: teacherError.message || 'Failed to create teacher record' }, { status: 500 });
    }

    // Store certification URL in certificates table
    if (certificationUrl) {
      await supabaseAdmin.from('certificates').insert({
        user_id: userId,
        file_url: certificationUrl,
        uploaded_at: new Date().toISOString(),
      });
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

  } catch (error: unknown) {
    console.error('Teacher registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}