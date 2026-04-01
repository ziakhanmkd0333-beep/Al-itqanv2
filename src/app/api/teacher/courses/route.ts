import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/courses - Get courses assigned to the teacher
export async function GET(request: Request) {
  try {
    // Get auth from cookie or header
    let userId: string | null = null;
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
          const cookieUser = JSON.parse(cookieValue);
          if (cookieUser?.id) userId = cookieUser.id;
        } catch { /* invalid cookie */ }
      }
    }
    
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const userData = JSON.parse(token);
          if (userData?.id) userId = userData.id;
        } catch {
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          if (!authError && user) userId = user.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('teacher_id', teacher.id);

    if (error) throw error;

    return NextResponse.json({ 
      courses: courses || [],
      count: courses?.length || 0
    });

  } catch (error: unknown) {
    console.error('Teacher courses fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
