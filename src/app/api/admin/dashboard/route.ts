import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/dashboard - Get dashboard stats (admin only)
export async function GET(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Get auth header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    let userRole: string | null = null;

    // Try to verify user from auth header (Bearer token or stored user data)
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        // Try to parse as stored user JSON (legacy format)
        const storedUser = JSON.parse(token);
        if (storedUser?.id && storedUser?.role) {
          userId = storedUser.id;
          userRole = storedUser.role;
        }
      } catch {
        // Not JSON, could be JWT - skip verification for now
        // In production, verify JWT properly
      }
    }

    // Also check cookies for session
    if (!userId) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
        if (userCookie) {
          try {
            const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
            const cookieUser = JSON.parse(cookieValue);
            if (cookieUser?.id && cookieUser?.role) {
              userId = cookieUser.id;
              userRole = cookieUser.role;
            }
          } catch {
            // Invalid cookie
          }
        }
      }
    }

    // Verify admin role
    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get counts from all tables with individual error handling using admin client to bypass RLS
    const studentsResult = await supabaseAdmin.from('students').select('*', { count: 'exact', head: true });
    const activeStudentsResult = await supabaseAdmin.from('students').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const teachersResult = await supabaseAdmin.from('teachers').select('*', { count: 'exact', head: true });
    const coursesResult = await supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const admissionsResult = await supabaseAdmin.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const enrollmentsResult = await supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const recentAdmissionsResult = await supabaseAdmin.from('admissions')
      .select('*')
      .eq('status', 'pending')
      .order('applied_at', { ascending: false })
      .limit(5);
    const recentPaymentsResult = await supabaseAdmin.from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    const upcomingSessionsResult = await supabaseAdmin.from('sessions')
      .select('*')
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalStudents: studentsResult.count || 0,
        activeStudents: activeStudentsResult.count || 0,
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
