import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/student/certificates - Get student certificates
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

    const { data: certificates, error } = await supabaseAdmin
      .from('certificates')
      .select('*, courses(title)')
      .eq('student_id', user.id)
      .order('issued_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ 
      certificates: certificates || [],
      count: certificates?.length || 0
    });

  } catch (error: any) {
    console.error('Certificates fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
