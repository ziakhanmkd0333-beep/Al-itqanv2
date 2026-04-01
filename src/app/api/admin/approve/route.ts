import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// POST /api/admin/approve - Approve or reject a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userType, action, adminId } = body;

    // Validate input
    if (!userId || !userType || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userType, action' },
        { status: 400 }
      );
    }

    if (!['student', 'teacher'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid userType. Must be "student" or "teacher"' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const now = new Date().toISOString();

    if (userType === 'student') {
      // Update student status
      const { data: student, error: studentError } = await supabaseAdmin
        .from('students')
        .update({
          status: newStatus,
          approved_by: adminId || null,
          approved_at: now,
          updated_at: now
        })
        .eq('id', userId)
        .select()
        .single();

      if (studentError) {
        console.error('Student approval error:', studentError);
        return NextResponse.json(
          { error: 'Failed to update student status' },
          { status: 500 }
        );
      }

      // If approving, create user record in users table
      if (action === 'approve') {
        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', student.email)
          .single();

        let userId = existingUser?.id;
        if (!existingUser) {
          // Create new user record
          const { data: newUser, error: createUserError } = await supabaseAdmin
            .from('users')
            .insert({
              email: student.email,
              password_hash: student.password_hash,
              full_name: student.full_name,
              role: 'student',
              is_active: true
            })
            .select()
            .single();

          if (!createUserError) {
            userId = newUser.id;
          }
        }

        if (userId) {
          await supabaseAdmin
            .from('students')
            .update({ user_id: userId })
            .eq('id', student.id);
        }

        // Also update any related admissions and create enrollment
        const { data: admission } = await supabaseAdmin
          .from('admissions')
          .update({
            status: 'approved',
            reviewed_by: adminId || null,
            reviewed_at: now,
            updated_at: now
          })
          .eq('student_id', student.id)
          .select()
          .single();

        if (admission?.course_id) {
          // Get course teacher
          const { data: course } = await supabaseAdmin
            .from('courses')
            .select('teacher_id')
            .eq('id', admission.course_id)
            .single();

          await supabaseAdmin
            .from('enrollments')
            .upsert({
              student_id: student.id,
              course_id: admission.course_id,
              teacher_id: course?.teacher_id || null,
              status: 'active',
              enrolled_at: now,
              updated_at: now
            }, { onConflict: 'student_id,course_id' });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Student ${action}d successfully`,
        user: student
      });
    }

    if (userType === 'teacher') {
      // Update teacher status
      const { data: teacher, error: teacherError } = await supabaseAdmin
        .from('teachers')
        .update({
          status: newStatus,
          approved_by: adminId || null,
          approved_at: now,
          updated_at: now
        })
        .eq('id', userId)
        .select()
        .single();

      if (teacherError) {
        console.error('Teacher approval error:', teacherError);
        return NextResponse.json(
          { error: 'Failed to update teacher status' },
          { status: 500 }
        );
      }

      // Also update the linked user's is_active status
      if (teacher?.user_id) {
        await supabaseAdmin
          .from('users')
          .update({
            is_active: action === 'approve',
            updated_at: now
          })
          .eq('id', teacher.user_id);
      }

      return NextResponse.json({
        success: true,
        message: `Teacher ${action}d successfully`,
        user: teacher
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/approve - Get pending approvals
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || 'all';

    const result: Record<string, unknown> = {};

    // Get pending students
    if (userType === 'all' || userType === 'student') {
      const { data: pendingStudents, error: studentsError } = await supabaseAdmin
        .from('students')
        .select('id, full_name, email, phone, country, age, created_at, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (!studentsError) {
        result.pendingStudents = pendingStudents || [];
      }
    }

    // Get pending teachers
    if (userType === 'all' || userType === 'teacher') {
      const { data: pendingTeachers, error: teachersError } = await supabaseAdmin
        .from('teachers')
        .select('id, user_id, full_name, email, specialization, qualifications, created_at, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (!teachersError) {
        result.pendingTeachers = pendingTeachers || [];
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Pending approvals fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending approvals' },
      { status: 500 }
    );
  }
}
