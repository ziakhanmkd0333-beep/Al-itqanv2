import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// POST /api/student/lessons/[id]/progress - Update lesson progress
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id;
    const body = await request.json();
    const { userId, progress_percent, last_position, is_completed, total_watch_time } = body;

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
    const now = new Date().toISOString();

    // Check if progress record exists
    const { data: existingProgress } = await supabaseAdmin
      .from('lesson_progress')
      .select('id, watch_count, completed_at')
      .eq('lesson_id', lessonId)
      .eq('student_id', studentId)
      .single();

    let result;

    if (existingProgress) {
      // Update existing progress
      result = await supabaseAdmin
        .from('lesson_progress')
        .update({
          progress_percent,
          last_position,
          is_completed,
          completed_at: is_completed ? now : existingProgress.completed_at,
          watch_count: existingProgress.watch_count + 1,
          total_watch_time: total_watch_time || 0,
          last_watched_at: now,
          updated_at: now
        })
        .eq('id', existingProgress.id)
        .select()
        .single();
    } else {
      // Create new progress record
      result = await supabaseAdmin
        .from('lesson_progress')
        .insert({
          lesson_id: lessonId,
          student_id: studentId,
          progress_percent,
          last_position,
          is_completed,
          completed_at: is_completed ? now : null,
          watch_count: 1,
          total_watch_time: total_watch_time || 0,
          last_watched_at: now
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating progress:', result.error);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Increment views count on the lesson
    await supabaseAdmin
      .from('recorded_lessons')
      .update({
        views_count: supabaseAdmin.rpc('increment', { x: 1 })
      })
      .eq('id', lessonId);

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      progress: result.data
    });
  } catch (error: unknown) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
