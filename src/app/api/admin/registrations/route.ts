import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/registrations - Get all registration applications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    let query = supabaseAdmin
      .from('registrations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      registrations: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error: unknown) {
    console.error('Admin registrations fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch registrations';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/admin/registrations - Create a new registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, registration: data });
  } catch (error: unknown) {
    console.error('Registration creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create registration';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/admin/registrations - Update a registration
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, registration: data });
  } catch (error: unknown) {
    console.error('Registration update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update registration';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/registrations - Delete a registration
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Registration deleted' });
  } catch (error: unknown) {
    console.error('Registration deletion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete registration';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
