import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Prepare user object for the client (omit password_hash)
    const { password_hash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Login successful'
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred during login' },
      { status: 500 }
    );
  }
}
