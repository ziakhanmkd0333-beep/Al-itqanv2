import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/profile - Get student profile
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

    const { data: student, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: student });

  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/student/profile - Update student profile
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
    const { full_name, phone, country, age, language, avatar_url } = body;

    const { data: updatedStudent, error } = await supabaseAdmin
      .from('students')
      .update({
        full_name,
        phone,
        country,
        age,
        language,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
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
      profile: updatedStudent,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

