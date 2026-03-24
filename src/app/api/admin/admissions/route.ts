import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';


// Mark as dynamic since this API route requires server-side operations


// GET /api/admin/admissions - Get all admissions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    let query = supabase
      .from('admissions')
      .select('*, courses(title), users(email)', { count: 'exact' })
      .order('applied_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      admissions: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Admissions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admissions' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/admissions - Update admission status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, reviewed_by } = body;

    const updateData: any = {
      status,
      reviewed_by,
      reviewed_at: new Date().toISOString()
    };
    if (notes) updateData.notes = notes;

    const { data, error } = await supabase
      .from('admissions')
      .update(updateData)
      .eq('id', id)
      .select('*, courses(title)')
      .single();

    if (error) throw error;

    // If approved, create enrollment
    if (status === 'approved') {
      await supabase.from('enrollments').insert([{
        student_id: data.student_id,
        course_id: data.course_id,
        status: 'active',
        progress: 0
      }]);
    }

    return NextResponse.json({ success: true, admission: data });

  } catch (error: any) {
    console.error('Admission update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update admission' },
      { status: 500 }
    );
  }
}
