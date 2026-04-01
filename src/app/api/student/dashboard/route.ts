import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/dashboard - Get student dashboard stats and recent data
export async function GET(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // If studentId is provided via query param, use it (for client-side calls)
    // Otherwise try Bearer token auth (for API-to-API calls)
    let targetStudentId = studentId;

    if (!targetStudentId) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Student ID or authorization token required' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      targetStudentId = user.id;
    }

    // Get enrolled courses with details
    const { data: enrollments, error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .select('*, courses(title, id), teachers(full_name)')
      .eq('student_id', targetStudentId)
      .eq('status', 'active');

    if (enrollmentsError) {
      console.error('Enrollments fetch error:', enrollmentsError);
    }

    // Get attendance stats
    const { data: attendance } = await supabaseAdmin
      .from('attendance')
      .select('status')
      .eq('student_id', targetStudentId);

    const totalAttendance = attendance?.length || 0;
    const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Get upcoming sessions
    const { data: sessions } = await supabaseAdmin
      .from('sessions')
      .select('*, courses(title), teachers(full_name)')
      .eq('student_id', targetStudentId)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .limit(5);

    // Get certificates
    const { data: certificates } = await supabaseAdmin
      .from('certificates')
      .select('*')
      .eq('student_id', targetStudentId);

    return NextResponse.json({
      enrollments: enrollments || [],
      upcomingSessions: sessions || [],
      certificates: certificates || [],
      attendanceRate: attendanceRate
    });

  } catch (error: unknown) {
    console.error('Student dashboard error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
