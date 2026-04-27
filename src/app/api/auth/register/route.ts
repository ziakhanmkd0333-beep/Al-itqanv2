import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, role, ...metadata } = body;

    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert into users table
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        { 
          email, 
          password_hash, 
          full_name, 
          role,
          is_active: true 
        }
      ])
      .select()
      .single();

    if (userError || !newUser) {
      throw new Error(userError?.message || 'Failed to create user');
    }

    // Create profile in the respective table
    if (role === 'student') {
      const { error: studentError } = await supabaseAdmin
        .from('students')
        .insert([
          {
            id: newUser.id,
            full_name,
            email,
            phone: metadata.phone || '',
            country: metadata.country || '',
            age: metadata.age || 0,
            language: metadata.language || 'en'
          }
        ]);
      if (studentError) console.error('Student profile creation error:', studentError);
    } else if (role === 'teacher') {
      const { error: teacherError } = await supabaseAdmin
        .from('teachers')
        .insert([
          {
            id: newUser.id,
            full_name,
            email,
            phone: metadata.phone || '',
            specialization: metadata.specialization || 'General',
            status: 'active'
          }
        ]);
      if (teacherError) console.error('Teacher profile creation error:', teacherError);
    }

    // Prepare response (omit sensitive data)
    const { password_hash: _password_hash, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
