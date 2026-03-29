import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/teacher/dashboard - Get teacher dashboard data
export async function GET(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

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
      .select('id, student_id, course_id, status, enrollment_date')
      .in('course_id', (courses || []).map(c => c.id))
      .eq('status', 'active');

    if (enrollmentsError) throw enrollmentsError;

    // Fetch related student and course data for enrollments
    const enrollmentsWithDetails = await Promise.all((enrollments || []).map(async (enrollment) => {
      const [{ data: student }, { data: course }] = await Promise.all([
        supabaseAdmin.from('students').select('full_name, email').eq('id', enrollment.student_id).single(),
        supabaseAdmin.from('courses').select('title').eq('id', enrollment.course_id).single()
      ]);
      return {
        ...enrollment,
        students: student || { full_name: 'Unknown Student', email: '' },
        courses: course || { title: 'Unknown Course' }
      };
    }));

    // Get upcoming sessions
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select('id, course_id, student_id, scheduled_date, scheduled_time, duration, status, session_type, meeting_link, notes')
      .eq('teacher_id', teacherId)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .limit(10);

    if (sessionsError) throw sessionsError;

    // Fetch related student and course data for sessions
    const sessionsWithDetails = await Promise.all((sessions || []).map(async (session) => {
      const [{ data: student }, { data: course }] = await Promise.all([
        supabaseAdmin.from('students').select('full_name').eq('id', session.student_id).single(),
        supabaseAdmin.from('courses').select('title').eq('id', session.course_id).single()
      ]);
      return {
        ...session,
        students: student || { full_name: 'Unknown Student' },
        courses: course || { title: 'Unknown Course' }
      };
    }));

    // Get attendance stats
    const { data: attendance, error: attendanceError } = await supabaseAdmin
      .from('attendance')
      .select('status')
      .eq('teacher_id', teacherId);

    if (attendanceError) throw attendanceError;

    const totalSessions = attendance?.length || 0;
    const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
    const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    // Get today's schedule
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySessions, error: todayError } = await supabaseAdmin
      .from('sessions')
      .select('id, course_id, student_id, scheduled_date, scheduled_time, duration, status, session_type, meeting_link, notes')
      .eq('teacher_id', teacherId)
      .eq('scheduled_date', today)
      .order('scheduled_time', { ascending: true });

    if (todayError) console.error('Today sessions error:', todayError);

    // Fetch related student and course data for today sessions
    const todaySessionsWithDetails = await Promise.all((todaySessions || []).map(async (session) => {
      const [{ data: student }, { data: course }] = await Promise.all([
        supabaseAdmin.from('students').select('full_name').eq('id', session.student_id).single(),
        supabaseAdmin.from('courses').select('title').eq('id', session.course_id).single()
      ]);
      return {
        ...session,
        students: student || { full_name: 'Unknown Student' },
        courses: course || { title: 'Unknown Course' }
      };
    }));

    // Calculate hours this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const { data: weekSessions } = await supabaseAdmin
      .from('sessions')
      .select('duration')
      .eq('teacher_id', teacherId)
      .gte('scheduled_date', weekStart.toISOString().split('T')[0]);

    const hoursThisWeek = weekSessions?.reduce((acc, s) => acc + (s.duration || 60), 0) || 0;

    return NextResponse.json({
      stats: {
        totalStudents: enrollments?.length || 0,
        todaysClasses: todaySessions?.length || 0,
        totalCourses: courses?.length || 0,
        hoursThisWeek: Math.round(hoursThisWeek / 60)
      },
      todaySchedule: todaySessionsWithDetails || [],
      students: enrollmentsWithDetails || [],
      courses: courses || [],
      upcomingSessions: sessionsWithDetails || [],
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

