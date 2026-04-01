import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert([
        { 
          name, 
          email, 
          subject: subject || 'No Subject', 
          message,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Contact submission error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data 
    });

  } catch (error: unknown) {
    console.error('Contact submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
