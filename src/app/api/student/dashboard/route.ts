import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/dashboard - Get student dashboard stats and recent data
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrolled courses count
    const { count: coursesCount } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('status', 'active');

    // Get attendance stats
    const { data: attendance } = await supabaseAdmin
      .from('attendance')
      .select('status')
      .eq('student_id', user.id);

    const totalAttendance = attendance?.length || 0;
    const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Get upcoming sessions
    const { data: sessions } = await supabaseAdmin
      .from('sessions')
      .select('*, courses(title), teachers(full_name)')
      .eq('student_id', user.id)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .limit(5);

    // Get recent attendance
    const { data: recentAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*, courses(title)')
      .eq('student_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        enrolledCourses: coursesCount || 0,
        attendanceRate: attendanceRate,
        totalSessions: totalAttendance
      },
      upcomingSessions: sessions || [],
      recentAttendance: recentAttendance || []
    });

  } catch (error: any) {
    console.error('Student dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
