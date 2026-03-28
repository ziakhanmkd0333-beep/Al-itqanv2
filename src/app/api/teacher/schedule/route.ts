import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/schedule - Get teacher's upcoming sessions
export async function GET(request: Request) {
  try {
    // Get auth from cookie or header
    let userId: string | null = null;
    
    // Try cookie first
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
          const cookieUser = JSON.parse(cookieValue);
          if (cookieUser?.id) {
            userId = cookieUser.id;
          }
        } catch { /* invalid cookie */ }
      }
    }
    
    // Fallback to auth header
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

    const { data: sessions, error } = await supabaseAdmin
      .from('sessions')
      .select('id, course_id, student_id, scheduled_date, scheduled_time, duration, status, session_type, meeting_link, location, notes, created_at, updated_at')
      .eq('teacher_id', teacher.id)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    if (error) throw error;

    // Fetch related data separately
    const sessionsWithDetails = await Promise.all((sessions || []).map(async (session) => {
      const [{ data: course }, { data: student }] = await Promise.all([
        supabaseAdmin.from('courses').select('title').eq('id', session.course_id).single(),
        supabaseAdmin.from('students').select('full_name').eq('id', session.student_id).single()
      ]);
      return {
        ...session,
        course_title: course?.title || 'Unknown Course',
        student_name: student?.full_name || 'Unknown Student'
      };
    }));

    return NextResponse.json({ 
      sessions: sessionsWithDetails || [],
      count: sessionsWithDetails?.length || 0
    });

  } catch (error: any) {
    console.error('Teacher schedule fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
