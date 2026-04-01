import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/teacher/courses/[id]/students - Get students enrolled in a course
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify teacher owns this course
    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single();

    if (!course || course.teacher_id !== teacher.id) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 403 });
    }

    // Get enrolled students with their details
    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          email,
          phone,
          age,
          country,
          language,
          status
        )
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    // Get attendance summary for each student
    const studentsWithStats = await Promise.all(
      (enrollments || []).map(async (enrollment) => {
        const { data: attendance } = await supabaseAdmin
          .from('attendance')
          .select('status')
          .eq('student_id', enrollment.student_id)
          .eq('course_id', courseId);

        const totalClasses = attendance?.length || 0;
        const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
        const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

        return {
          ...enrollment,
          student: enrollment.students,
          attendance_rate: attendanceRate,
          total_classes: totalClasses
        };
      })
    );

    return NextResponse.json({ 
      students: studentsWithStats,
      count: studentsWithStats.length 
    });

  } catch (error: unknown) {
    console.error('Course students fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
