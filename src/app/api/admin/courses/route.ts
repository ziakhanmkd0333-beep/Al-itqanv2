import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/admin/courses - Get all courses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const status = searchParams.get('status') || '';

    let query = supabaseAdmin
      .from('courses')
      .select('*, teachers(full_name, specialization)', { count: 'exact' })
      .order('display_order', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      courses: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses - Create new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      level,
      category,
      description,
      duration,
      schedule,
      fee_min,
      fee_max,
      prerequisites,
      core_books,
      next_course,
      teacher_id,
      status,
      display_order
    } = body;

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([{
        title,
        slug,
        level,
        category,
        description,
        duration,
        schedule,
        fee_min,
        fee_max,
        prerequisites,
        core_books,
        next_course,
        teacher_id,
        status,
        display_order
      }])
      .select('*, teachers(full_name)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, course: data }, { status: 201 });

  } catch (error: any) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/courses - Update course
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      level,
      category,
      description,
      duration,
      schedule,
      fee_min,
      fee_max,
      prerequisites,
      core_books,
      next_course,
      teacher_id,
      status,
      display_order
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update({
        title,
        slug,
        level,
        category,
        description,
        duration,
        schedule,
        fee_min,
        fee_max,
        prerequisites,
        core_books,
        next_course,
        teacher_id,
        status,
        display_order
      })
      .eq('id', id)
      .select('*, teachers(full_name)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, course: data });

  } catch (error: any) {
    console.error('Course update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses - Delete course
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });

  } catch (error: any) {
    console.error('Course deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete course' },
      { status: 500 }
    );
  }
}
