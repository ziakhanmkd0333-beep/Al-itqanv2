import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/enrollments - Get all enrollments with student and course details
export async function GET() {
  try {
    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        id,
        student_id,
        course_id,
        status,
        enrolled_at,
        students!inner(full_name),
        courses!inner(title)
      `)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      );
    }

    // Transform data to flatten nested objects
    const formattedEnrollments = enrollments?.map(e => ({
      id: e.id,
      student_id: e.student_id,
      course_id: e.course_id,
      status: e.status,
      enrolled_at: e.enrolled_at,
      student_name: (e.students as any)?.full_name || 'Unknown',
      course_title: (e.courses as any)?.title || 'Unknown'
    })) || [];

    return NextResponse.json({ enrollments: formattedEnrollments });
  } catch (error: unknown) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/enrollments - Create new enrollments for a student
export async function POST(request: Request) {
  try {
    const { student_id, course_ids } = await request.json();

    if (!student_id || !course_ids || !Array.isArray(course_ids) || course_ids.length === 0) {
      return NextResponse.json(
        { error: 'Student ID and at least one course ID are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Create enrollment records for each course
    const enrollmentData = course_ids.map(course_id => ({
      student_id,
      course_id,
      status: 'active',
      enrolled_at: now,
      progress: 0
    }));

    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert(enrollmentData)
      .select();

    if (error) {
      console.error('Error creating enrollments:', error);
      return NextResponse.json(
        { error: 'Failed to create enrollments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully enrolled student in ${course_ids.length} course(s)`,
      enrollments: data 
    });
  } catch (error: unknown) {
    console.error('Error creating enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollments' },
      { status: 500 }
    );
  }
}
