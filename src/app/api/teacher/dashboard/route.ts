import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/teacher/dashboard - Get teacher dashboard data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID required' },
        { status: 400 }
      );
    }

    // Get assigned courses
    const { data: courses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('status', 'published');

    if (coursesError) throw coursesError;

    // Get total students enrolled in teacher's courses
    const { data: enrollments, error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .select('*, students(full_name, email), courses(title)')
      .in('course_id', (courses || []).map(c => c.id))
      .eq('status', 'active');

    if (enrollmentsError) throw enrollmentsError;

    // Get upcoming sessions
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select('*, students(full_name), courses(title)')
      .eq('teacher_id', teacherId)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .limit(10);

    if (sessionsError) throw sessionsError;

    // Get attendance stats
    const { data: attendance, error: attendanceError } = await supabaseAdmin
      .from('attendance')
      .select('status')
      .eq('teacher_id', teacherId);

    if (attendanceError) throw attendanceError;

    const totalSessions = attendance?.length || 0;
    const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
    const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return NextResponse.json({
      courses: courses || [],
      totalStudents: enrollments?.length || 0,
      students: enrollments || [],
      upcomingSessions: sessions || [],
      attendanceRate,
      totalSessions
    });

  } catch (error) {
    console.error('Teacher dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

