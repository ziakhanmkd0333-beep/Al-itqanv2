import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/students - Get students enrolled in teacher's courses
export async function GET(request: Request) {
  try {
    // Get auth from cookie or header
    let userId: string | null = null;
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
          const cookieUser = JSON.parse(cookieValue);
          if (cookieUser?.id) userId = cookieUser.id;
        } catch { /* invalid cookie */ }
      }
    }
    
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const userData = JSON.parse(token);
          if (userData?.id) userId = userData.id;
        } catch {
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          if (!authError && user) userId = user.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher profile
    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    // Query enrollments to get students
    let query = supabaseAdmin
      .from('enrollments')
      .select(`
        id,
        course_id,
        students:student_id (
          id,
          full_name,
          email,
          avatar_url
        ),
        courses:course_id (
          id,
          title
        )
      `)
      .eq('teacher_id', teacher.id)
      .eq('status', 'active');

    if (courseId && courseId !== 'all') {
      query = query.eq('course_id', courseId);
    }

    const { data: enrollments, error } = await query;

    if (error) throw error;

    // Transform data to match what the frontend expects
    const students = (enrollments || []).map(e => {
      const student = Array.isArray(e.students) ? e.students[0] : e.students;
      const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
      
      return {
        id: student?.id,
        name: student?.full_name,
        email: student?.email,
        avatar: student?.full_name ? student.full_name.charAt(0) : '?',
        course: course?.title,
        course_id: e.course_id
      };
    });

    return NextResponse.json({ 
      students,
      count: students.length 
    });

  } catch (error: any) {
    console.error('Students fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/students - Save attendance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attendance: attendanceData } = body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return NextResponse.json({ error: 'Attendance data is required' }, { status: 400 });
    }

    // Use upsert to handle duplicates based on the unique constraint (teacher_id, student_id, course_id, date)
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .upsert(attendanceData, { 
        onConflict: 'teacher_id,student_id,course_id,date' 
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Attendance saved successfully'
    });

  } catch (error: any) {
    console.error('Save attendance error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save attendance' },
      { status: 500 }
    );
  }
}


