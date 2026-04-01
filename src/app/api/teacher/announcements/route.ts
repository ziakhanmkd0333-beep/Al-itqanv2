import { NextResponse } from 'next/server';


























































import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/teacher/submissions - Get submissions for teacher's assignments
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

    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignment_id');

    let query = supabaseAdmin
      .from('submissions')
      .select(`
        *,
        assignments:assignment_id (
          title,
          max_marks,
          teacher_id,
          courses:course_id (title)
        ),
        students:student_id (
          id,
          full_name,
          email
        )
      `)
      .eq('assignments.teacher_id', teacher.id)
      .order('submitted_at', { ascending: false });

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }

    const { data: submissions, error } = await query;

    if (error) throw error;

    return NextResponse.json({ 
      submissions: submissions || [],
      count: submissions?.length || 0
    });

  } catch (error: unknown) {
    console.error('Submissions fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch submissions';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/teacher/submissions - Grade a submission
export async function PUT(request: Request) {
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

    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const body = await request.json();
    const { submission_id, marks, feedback, status } = body;

    // Verify teacher owns this submission's assignment
    const { data: submission } = await supabaseAdmin
      .from('submissions')
      .select(`
        id,
        assignments:assignment_id (teacher_id, max_marks)
      `)
      .eq('id', submission_id)
      .single();

    if (!submission || !submission.assignments?.[0] || submission.assignments[0].teacher_id !== teacher.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate marks don't exceed max
    if (typeof marks !== 'number' || marks < 0 || !submission?.assignments?.[0] || marks > submission.assignments[0].max_marks) {
      return NextResponse.json({ 
        error: `Marks cannot exceed maximum ${submission.assignments[0].max_marks}` 
      }, { status: 400 });
    }

    const { data: updatedSubmission, error } = await supabaseAdmin
      .from('submissions')
      .update({
        marks,
        feedback,
        status: status || 'graded',
        graded_at: new Date().toISOString(),
        graded_by: teacher.id
      })
      .eq('id', submission_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      submission: updatedSubmission,
      message: 'Submission graded successfully'
    });

  } catch (error: unknown) {
    console.error('Submission grading error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to grade submission';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



