import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/students - Get all students
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    // Build base query
    let query = supabaseAdmin
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Get total count separately
    const { count, error: countError } = await supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
    }

    return NextResponse.json({
      students: data || [],
      total: count || data?.length || 0,
      page,
      limit,
      totalPages: Math.ceil((count || data?.length || 0) / limit)
    });

  } catch (error: any) {
    console.error('Admin students fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch students', details: error },
      { status: 500 }
    );
  }
}

// POST /api/admin/students - Create a new student
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, age, phone, country, status } = body;

    // Create student record
    const { data: student, error } = await supabaseAdmin
      .from('students')
      .insert([{
        email,
        full_name,
        age,
        phone,
        country,
        status: status || 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, student });

  } catch (error: any) {
    console.error('Student creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}
