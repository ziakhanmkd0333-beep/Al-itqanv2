import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/teacher/submissions - Returns empty list (submissions not in schema)
export async function GET() {
  return NextResponse.json({ 
    submissions: [],
    message: "Submissions feature not available yet."
  });
}

// PUT /api/teacher/submissions - Placeholder for grading
export async function PUT() {
  return NextResponse.json({ 
    error: "Submissions feature not available yet."
  }, { status: 501 });
}
