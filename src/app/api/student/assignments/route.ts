import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/student/assignments - Returns empty list (assignments not in schema)
export async function GET() {
  return NextResponse.json({ 
    assignments: [],
    message: "Assignments feature not available yet."
  });
}
