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
    const search = searchParams.get('search') || '';

    let query = supabaseAdmin
      .from('students')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      students: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error: unknown) {
    console.error('Admin students fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch students';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/admin/students - Create a new student
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, age, phone, country, city, full_address, academic_details, status } = body;

    const { data: student, error } = await supabaseAdmin
      .from('students')
      .insert([{
        email,
        full_name,
        age,
        phone,
        country,
        city,
        full_address,
        academic_details,
        status: status || 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, student });

  } catch (error: unknown) {
    console.error('Student creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
