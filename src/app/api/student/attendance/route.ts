import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/attendance - Get student attendance history
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

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    let query = supabaseAdmin
      .from('attendance')
      .select('*, courses(title), teachers(full_name)')
      .eq('student_id', user.id)
      .order('date', { ascending: false });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data: attendance, error } = await query;

    if (error) throw error;

    return NextResponse.json({ 
      attendance: attendance || [],
      count: attendance?.length || 0
    });

  } catch (error: unknown) {
    console.error('Attendance fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch attendance';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
