import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/sessions - Get all live class sessions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    
    let query = supabaseAdmin
      .from('sessions')
      .select(`
        *,
        courses:course_id(title),
        teachers:teacher_id(full_name)
      `)
      .order('scheduled_at', { ascending: true });
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Transform data
    const formattedSessions = sessions?.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      course_id: s.course_id,
      course_title: (s.courses as any)?.title || 'Unknown',
      teacher_id: s.teacher_id,
      teacher_name: (s.teachers as any)?.full_name || 'Unknown',
      scheduled_at: s.scheduled_at,
      duration: s.duration,
      meeting_url: s.meeting_url,
      meeting_platform: s.meeting_platform,
      meeting_id: s.meeting_id,
      meeting_password: s.meeting_password,
      max_participants: s.max_participants,
      status: s.status,
      is_recorded: s.is_recorded,
      recording_url: s.recording_url,
      created_at: s.created_at
    })) || [];

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error: unknown) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/sessions - Create a new live class session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      course_id,
      teacher_id,
      scheduled_at,
      duration,
      meeting_platform = 'jitsi',
      meeting_url,
      meeting_id,
      meeting_password,
      max_participants = 100,
      waiting_room_enabled = false
    } = body;

    if (!title || !course_id || !teacher_id || !scheduled_at) {
      return NextResponse.json(
        { error: 'Title, course_id, teacher_id, and scheduled_at are required' },
        { status: 400 }
      );
    }

    // Generate Jitsi meeting URL if not provided
    let finalMeetingUrl = meeting_url;
    let finalMeetingId = meeting_id;
    
    if (!finalMeetingUrl && meeting_platform === 'jitsi') {
      // Generate a unique Jitsi room name
      finalMeetingId = `alnoor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      finalMeetingUrl = `https://meet.jit.si/${finalMeetingId}`;
    }

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert({
        title,
        description,
        course_id,
        teacher_id,
        scheduled_at,
        duration,
        meeting_platform,
        meeting_url: finalMeetingUrl,
        meeting_id: finalMeetingId,
        meeting_password,
        max_participants,
        waiting_room_enabled,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Live class scheduled successfully',
      session: data 
    });
  } catch (error: unknown) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
