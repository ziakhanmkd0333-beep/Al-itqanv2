import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/courses - Get all courses with filtering
export async function GET(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error', courses: [] },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status') || 'published';

    let query = supabaseAdmin
      .from('courses')
      .select(`
        *,
        teachers:teacher_id (
          full_name,
          photo_url,
          specialization
        )
      `)
      .order('display_order', { ascending: true });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (level && level !== 'All') {
      query = query.eq('level', level);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: courses, error } = await query;

    if (error) throw error;

    return NextResponse.json({ 
      courses: courses || [],
      count: courses?.length || 0
    });

  } catch (error: any) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses', courses: [] },
      { status: 500 }
    );
  }
}
