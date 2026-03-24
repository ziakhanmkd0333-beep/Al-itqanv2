import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/materials - Get materials for a course
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const { data: materials, error } = await supabaseAdmin
      .from('course_materials')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ materials: materials || [] });

  } catch (error: any) {
    console.error('Materials fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/materials - Add new material
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { course_id, title, description, file_url, file_type } = body;

    const { data: material, error } = await supabaseAdmin
      .from('course_materials')
      .insert([{
        course_id,
        title,
        description,
        file_url,
        file_type
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, material });

  } catch (error: any) {
    console.error('Material upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add material' },
      { status: 500 }
    );
  }
}
