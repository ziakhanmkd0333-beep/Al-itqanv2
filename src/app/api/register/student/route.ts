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

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();

    const { email, password, fullName, phone, country, age, language, courseId, preferredTiming, startDate, guardianName, guardianPhone, message } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message || 'Failed to create user account' }, { status: 400 });
    }

    const userId = authData.user.id;

    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: userId, full_name: fullName, email, phone: phone || null, country: country || null,
        age: age || null, language: language || 'English', course_id: courseId || null,
        preferred_timing: preferredTiming || null, start_date: startDate || null,
        guardian_name: guardianName || null, guardian_phone: guardianPhone || null,
        message: message || null, status: 'active',
      })
      .select()
      .single();

    if (studentError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: studentError.message || 'Failed to create student record' }, { status: 500 });
    }

    if (courseId) {
      await supabaseAdmin.from('admissions').insert({
        student_id: student.id, course_id: courseId, preferred_timing: preferredTiming || null,
        start_date: startDate || null, status: 'pending', applied_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, message: 'Student registered successfully', student: { id: student.id, fullName: student.full_name, email: student.email } });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
