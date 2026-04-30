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
      // First, try to find student in students table
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

      // If student not found in students table, approve directly in users table
      if (studentError && studentError.code === 'PGRST116') {
        const { error: userError } = await supabaseAdmin
          .from('users')
          .update({
            is_approved: action === 'approve',
            approved_by: adminId || null,
            approved_at: now,
            updated_at: now
          })
          .eq('id', userId)
          .eq('role', 'student');

        if (userError) {
          console.error('User approval error:', userError);
          return NextResponse.json(
            { error: 'Failed to update user approval status' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Student ${action === 'approve' ? 'approved' : 'rejected'} successfully`
        });
      }

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
          
          // Also update users.is_approved to true
          await supabaseAdmin
            .from('users')
            .update({ 
              is_approved: true,
              approved_by: adminId || null,
              approved_at: now
            })
            .eq('id', userId);
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
      // First, try to find teacher in teachers table
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

      // If teacher not found in teachers table, approve directly in users table
      if (teacherError && teacherError.code === 'PGRST116') {
        const { error: userError } = await supabaseAdmin
          .from('users')
          .update({
            is_approved: action === 'approve',
            approved_by: adminId || null,
            approved_at: now,
            updated_at: now
          })
          .eq('id', userId)
          .eq('role', 'teacher');

        if (userError) {
          console.error('User approval error:', userError);
          return NextResponse.json(
            { error: 'Failed to update user approval status' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Teacher ${action === 'approve' ? 'approved' : 'rejected'} successfully`
        });
      }

      if (teacherError) {
        console.error('Teacher approval error:', teacherError);
        return NextResponse.json(
          { error: 'Failed to update teacher status' },
          { status: 500 }
        );
      }

      // Also update the linked user's is_active and is_approved status
      if (teacher?.user_id) {
        await supabaseAdmin
          .from('users')
          .update({
            is_active: action === 'approve',
            is_approved: action === 'approve',
            approved_by: action === 'approve' ? adminId : null,
            approved_at: action === 'approve' ? now : null,
            updated_at: now
          })
          .eq('id', teacher.user_id);
      }

      return NextResponse.json({
        success: true,
        message: `Teacher ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
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

    // Get pending students from students table
    if (userType === 'all' || userType === 'student') {
      const { data: pendingStudents, error: studentsError } = await supabaseAdmin
        .from('students')
        .select('id, full_name, email, phone, country, city, full_address, age, academic_details, qualifications, created_at, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (!studentsError) {
        result.pendingStudents = pendingStudents || [];
      }
    }

    // Get pending teachers from teachers table
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

    // Get unapproved users directly from users table
    const { data: unapprovedUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, role, is_approved, created_at')
      .eq('is_approved', false)
      .order('created_at', { ascending: true });

    if (!usersError) {
      result.unapprovedUsers = unapprovedUsers || [];
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
