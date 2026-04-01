import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// DELETE /api/admin/students/[id] - Delete a student
export async function DELETE(request: Request) {
  try {
    // Extract ID from URL pathname
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

    console.log('DELETE student - Extracted ID:', id, 'from path:', url.pathname);

    if (!id || id === 'students') {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // First, get the student to find linked user_id
    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('user_id, email')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching student:', fetchError);
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete the student record
    const { error: deleteError } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting student:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete student: ' + deleteError.message },
        { status: 500 }
      );
    }

    // Also delete the linked user record if exists
    if (student?.user_id) {
      const { error: userDeleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', student.user_id);

      if (userDeleteError) {
        console.error('Error deleting user:', userDeleteError);
        // Don't fail the request if user deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete student error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/admin/students/[id] - Update a student
export async function PUT(request: Request) {
  try {
    // Extract ID from URL pathname
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    const body = await request.json();

    console.log('PUT student - Extracted ID:', id, 'from path:', url.pathname);

    if (!id || id === 'students') {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.country !== undefined) updates.country = body.country;
    if (body.age !== undefined) updates.age = body.age;
    if (body.status !== undefined) updates.status = body.status;
    if (body.language !== undefined) updates.language = body.language;
    if (body.guardian_name !== undefined) updates.guardian_name = body.guardian_name;
    if (body.guardian_phone !== undefined) updates.guardian_phone = body.guardian_phone;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      return NextResponse.json(
        { error: 'Failed to update student: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      student: data,
      message: 'Student updated successfully'
    });

  } catch (error: unknown) {
    console.error('Update student error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
