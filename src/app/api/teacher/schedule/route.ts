import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/schedule - Get teacher's upcoming sessions
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

    const { data: sessions, error } = await supabaseAdmin
      .from('sessions')
      .select('*, courses(title), students(full_name)')
      .eq('teacher_id', teacher.id)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ 
      sessions: sessions || [],
      count: sessions?.length || 0
    });

  } catch (error: any) {
    console.error('Teacher schedule fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
