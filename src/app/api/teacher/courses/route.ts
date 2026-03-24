import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/courses - Get courses assigned to the teacher
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

    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('teacher_id', teacher.id);

    if (error) throw error;

    return NextResponse.json({ 
      courses: courses || [],
      count: courses?.length || 0
    });

  } catch (error: any) {
    console.error('Teacher courses fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
