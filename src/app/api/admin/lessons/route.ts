import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/lessons - Get all recorded lessons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    const isPublished = searchParams.get('isPublished');
    
    let query = supabaseAdmin
      .from('recorded_lessons')
      .select(`
        *,
        courses!inner(title),
        teachers!inner(full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }
    
    if (isPublished !== null) {
      query = query.eq('is_published', isPublished === 'true');
    }

    const { data: lessons, error } = await query;

    if (error) {
      console.error('Error fetching lessons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      );
    }

    // Transform data
    const formattedLessons = lessons?.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      course_id: l.course_id,
      course_title: (l.courses as any)?.title || 'Unknown',
      teacher_id: l.teacher_id,
      teacher_name: (l.teachers as any)?.full_name || 'Unknown',
      video_url: l.video_url,
      thumbnail_url: l.thumbnail_url,
      duration: l.duration,
      file_size: l.file_size,
      file_format: l.file_format,
      is_published: l.is_published,
      published_at: l.published_at,
      is_free_preview: l.is_free_preview,
      requires_enrollment: l.requires_enrollment,
      views_count: l.views_count,
      likes_count: l.likes_count,
      created_at: l.created_at
    })) || [];

    return NextResponse.json({ lessons: formattedLessons });
  } catch (error: unknown) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lessons - Create a new recorded lesson
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      course_id,
      teacher_id,
      video_url,
      thumbnail_url,
      duration,
      file_size,
      file_format,
      is_published = false,
      is_free_preview = false,
      requires_enrollment = true
    } = body;

    if (!title || !course_id || !teacher_id || !video_url) {
      return NextResponse.json(
        { error: 'Title, course_id, teacher_id, and video_url are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('recorded_lessons')
      .insert({
        title,
        description,
        course_id,
        teacher_id,
        video_url,
        thumbnail_url,
        duration,
        file_size,
        file_format,
        is_published,
        published_at: is_published ? now : null,
        is_free_preview,
        requires_enrollment
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      return NextResponse.json(
        { error: 'Failed to create lesson' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Recorded lesson created successfully',
      lesson: data 
    });
  } catch (error: unknown) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
