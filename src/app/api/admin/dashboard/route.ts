import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/admin/dashboard - Get dashboard stats
export async function GET() {
  try {
    // Get counts from all tables with individual error handling using admin client to bypass RLS
    const studentsResult = await supabaseAdmin.from('students').select('*', { count: 'exact', head: true });
    const teachersResult = await supabaseAdmin.from('teachers').select('*', { count: 'exact', head: true });
    const coursesResult = await supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const admissionsResult = await supabaseAdmin.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const enrollmentsResult = await supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const recentAdmissionsResult = await supabaseAdmin.from('admissions')
      .select('*, courses(title)')
      .eq('status', 'pending')
      .order('applied_at', { ascending: false })
      .limit(5);
    const recentPaymentsResult = await supabaseAdmin.from('payments')
      .select('*, students(full_name), courses(title)')
      .order('created_at', { ascending: false })
      .limit(5);
    const upcomingSessionsResult = await supabaseAdmin.from('sessions')
      .select('*, courses(title), students(full_name), teachers(full_name)')
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalStudents: studentsResult.count || 0,
        totalTeachers: teachersResult.count || 0,
        activeCourses: coursesResult.count || 0,
        pendingAdmissions: admissionsResult.count || 0,
        totalEnrollments: enrollmentsResult.count || 0,
        totalRevenue: 0 // Initialize to 0, calculate if needed
      },
      recentAdmissions: recentAdmissionsResult.data || [],
      recentPayments: recentPaymentsResult.data || [],
      upcomingSessions: upcomingSessionsResult.data || []
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
