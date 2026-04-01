import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// GET /api/admin/payments - Get all payments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const studentId = searchParams.get('studentId') || '';

    let query = supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);
    if (studentId) query = query.eq('student_id', studentId);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      payments: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/payments - Create new payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, course_id, amount, method, status, transaction_id } = body;

    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert([{
        student_id,
        course_id,
        amount,
        method,
        status,
        transaction_id,
        paid_at: status === 'paid' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, payment: data }, { status: 201 });

  } catch (error: unknown) {
    console.error('Payment creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
