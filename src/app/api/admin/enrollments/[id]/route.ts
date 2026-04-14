import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// DELETE /api/admin/enrollments/[id] - Delete an enrollment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting enrollment:', error);
      return NextResponse.json(
        { error: 'Failed to delete enrollment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Enrollment deleted successfully' 
    });
  } catch (error: unknown) {
    console.error('Error deleting enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to delete enrollment' },
      { status: 500 }
    );
  }
}
