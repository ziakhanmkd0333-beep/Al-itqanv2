import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/courses - Get courses enrolled by the student
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

    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        *,
        courses:course_id (
          *,
          teachers:teacher_id (
            full_name,
            avatar_url,
            specialization
          )
        )
      `)
      .eq('student_id', user.id)
      .eq('status', 'active');

    if (error) throw error;

    return NextResponse.json({ 
      enrollments: enrollments || [],
      count: enrollments?.length || 0
    });

  } catch (error: any) {
    console.error('Enrolled courses fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrolled courses' },
      { status: 500 }
    );
  }
}
