import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Middleware to verify teacher authentication
 * Use this in teacher API routes to ensure only teachers can access
 */
export async function verifyTeacherAuth(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { error: 'Unauthorized - No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return { error: 'Unauthorized - Invalid token', status: 401 };
    }

    // Check if user is a teacher
    const { data: teacher, error: teacherError } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (teacherError || !teacher) {
      return { error: 'Forbidden - Teacher access required', status: 403 };
    }

    return { user, teacher, status: 200 };
  } catch (error) {
    console.error('Teacher auth verification error:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

/**
 * Helper to check if user is teacher from session
 * For use in server components or middleware
 */
export async function isTeacher(userId: string) {
  try {
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('id, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !teacher) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get teacher ID from user ID
 */
export async function getTeacherId(userId: string) {
  try {
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error || !teacher) {
      return null;
    }

    return teacher.id;
  } catch (error) {
    return null;
  }
}
