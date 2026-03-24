import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/teachers - Get all teachers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    let query = supabaseAdmin
      .from('teachers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      teachers: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error: any) {
    console.error('Admin teachers fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/teachers - Create a new teacher
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, specialization, qualifications, status } = body;

    // Create teacher record
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .insert([{
        email,
        full_name,
        specialization,
        qualifications,
        status: status || 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, teacher });

  } catch (error: any) {
    console.error('Teacher creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
