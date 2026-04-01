import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/teacher/profile - Get teacher profile
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: teacher });

  } catch (error: unknown) {
    console.error('Profile fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/teacher/profile - Update teacher profile
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, phone, specialization, bio, credentials, photo_url, whatsapp } = body;

    const { data: updatedTeacher, error } = await supabaseAdmin
      .from('teachers')
      .update({
        full_name,
        phone,
        specialization,
        bio,
        credentials,
        photo_url,
        whatsapp,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Also update full_name in users table if changed
    if (full_name) {
      await supabaseAdmin
        .from('users')
        .update({ full_name })
        .eq('id', user.id);
    }

    return NextResponse.json({ 
      success: true, 
      profile: updatedTeacher,
      message: 'Profile updated successfully'
    });

  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
