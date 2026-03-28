import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/materials - Get materials for a course
export async function GET(request: Request) {
  try {
    // Get auth from cookie or header
    let userId: string | null = null;
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
          const cookieUser = JSON.parse(cookieValue);
          if (cookieUser?.id) userId = cookieUser.id;
        } catch { /* invalid cookie */ }
      }
    }
    
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const userData = JSON.parse(token);
          if (userData?.id) userId = userData.id;
        } catch {
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          if (!authError && user) userId = user.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher profile
    const { data: teacher } = await supabaseAdmin
      .from('teachers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    // If no course_id, get all materials for teacher's courses
    let query = supabaseAdmin.from('course_materials').select('*');
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    } else {
      // Get teacher's courses first
      const { data: courses } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('teacher_id', teacher.id);
      
      if (courses && courses.length > 0) {
        query = query.in('course_id', courses.map(c => c.id));
      } else {
        return NextResponse.json({ materials: [] });
      }
    }

    const { data: materials, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ materials: materials || [] });

  } catch (error: any) {
    console.error('Materials fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/materials - Add new material
export async function POST(request: Request) {
  try {
    // Get auth from cookie or header
    let userId: string | null = null;
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const userCookie = cookieHeader.split(';').find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
          const cookieUser = JSON.parse(cookieValue);
          if (cookieUser?.id) userId = cookieUser.id;
        } catch { /* invalid cookie */ }
      }
    }
    
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const userData = JSON.parse(token);
          if (userData?.id) userId = userData.id;
        } catch {
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          if (!authError && user) userId = user.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { course_id, title, description, file_url, file_type } = body;

    const { data: material, error } = await supabaseAdmin
      .from('course_materials')
      .insert([{
        course_id,
        title,
        description,
        file_url,
        file_type
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, material });

  } catch (error: any) {
    console.error('Material upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add material' },
      { status: 500 }
    );
  }
}
