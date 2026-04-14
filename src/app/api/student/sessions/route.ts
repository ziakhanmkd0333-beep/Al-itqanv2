import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/sessions - Get live classes for enrolled courses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get student's ID from users table
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const studentId = student.id;

    // Get student's enrolled course IDs first
    const { data: enrollments } = await supabaseAdmin
      .from('enrollments')
      .select('course_id')
      .eq('student_id', studentId)
      .eq('status', 'active');

    const courseIds = enrollments?.map(e => e.course_id) || [];
    
    if (courseIds.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Get upcoming live sessions for enrolled courses
    const now = new Date().toISOString();
    
    const { data: sessions, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        courses!inner(title),
        teachers!inner(full_name, photo_url)
      `)
      .gte('scheduled_at', now)
      .in('course_id', courseIds)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('Error fetching student sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Transform data - only return safe fields (hide meeting_password)
    const formattedSessions = sessions?.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      course_id: s.course_id,
      course_title: (s.courses as any)?.title || 'Unknown',
      teacher_name: (s.teachers as any)?.full_name || 'Unknown',
      teacher_photo: (s.teachers as any)?.photo_url,
      scheduled_at: s.scheduled_at,
      duration: s.duration,
      meeting_url: s.meeting_url,
      meeting_platform: s.meeting_platform,
      status: s.status,
      is_recorded: s.is_recorded,
      max_participants: s.max_participants,
      created_at: s.created_at
    })) || [];

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error: unknown) {
    console.error('Error fetching student sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
