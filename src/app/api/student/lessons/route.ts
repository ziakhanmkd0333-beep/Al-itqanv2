import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { type LessonProgressRef, type TeacherRef, type CourseRef, getJoinValue } from '@/types/supabase';

export const dynamic = 'force-dynamic';

// GET /api/student/lessons - Get recorded lessons for enrolled courses
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

    // Get student's enrolled course IDs
    const { data: enrollments } = await supabaseAdmin
      .from('enrollments')
      .select('course_id')
      .eq('student_id', studentId)
      .eq('status', 'active');

    const courseIds = enrollments?.map(e => e.course_id) || [];

    // Get published lessons for enrolled courses + free preview lessons
    const { data: lessons, error } = await supabaseAdmin
      .from('recorded_lessons')
      .select(`
        *,
        courses!inner(title),
        teachers!inner(full_name, photo_url),
        lesson_progress!left(progress_percent, last_position, is_completed)
      `)
      .eq('is_published', true)
      .or(`is_free_preview.eq.true,course_id.in.(${courseIds.join(',')})`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student lessons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      );
    }

    // Transform data
    const formattedLessons = lessons?.map(l => {
      const progress = getJoinValue<LessonProgressRef>(l.lesson_progress as unknown as LessonProgressRef);
      return {
        id: l.id,
        title: l.title,
        description: l.description,
        course_id: l.course_id,
        course_title: getJoinValue<CourseRef>(l.courses as unknown as CourseRef)?.title || 'Unknown',
        teacher_name: getJoinValue<TeacherRef>(l.teachers as unknown as TeacherRef)?.full_name || 'Unknown',
        teacher_photo: getJoinValue<TeacherRef>(l.teachers as unknown as TeacherRef)?.photo_url,
        video_url: l.video_url,
        thumbnail_url: l.thumbnail_url,
        duration: l.duration,
        file_size: l.file_size,
        file_format: l.file_format,
        is_free_preview: l.is_free_preview,
        views_count: l.views_count,
        likes_count: l.likes_count,
        progress: progress ? {
          percent: progress.progress_percent,
          last_position: progress.last_position,
          is_completed: progress.is_completed
        } : null,
        created_at: l.created_at
      };
    }) || [];

    return NextResponse.json({ lessons: formattedLessons });
  } catch (error: unknown) {
    console.error('Error fetching student lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
