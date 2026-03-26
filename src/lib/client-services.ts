import { supabaseBrowser } from './supabase-browser';
import bcrypt from 'bcryptjs';

// Client-side auth service to replace API routes
export const clientAuth = {
  // Login with email/password
  async login(email: string, password: string) {
    try {
      // Get user from Supabase Auth
      const { data: authData, error: authError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid credentials');
      }

      // Get user details from users table
      const { data: userData, error: userError } = await supabaseBrowser
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        throw new Error('User not found in database');
      }

      // Update last login
      await supabaseBrowser
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          full_name: userData.full_name,
          phone: userData.phone,
          avatar_url: userData.avatar_url
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  },

  // Register new user
  async register(email: string, password: string, fullName: string, role: string, phone?: string) {
    try {
      // Check if user exists
      const { data: existingUser } = await supabaseBrowser
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create Supabase Auth user
      const { data: authData, error: authError } = await supabaseBrowser.auth.signUp({
        email,
        password
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Registration failed');
      }

      // Hash password for users table
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user record
      const { data: userData, error: userError } = await supabaseBrowser
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          password_hash: hashedPassword,
          role,
          full_name: fullName,
          phone,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        // Rollback auth user if db insert fails
        await supabaseBrowser.auth.admin.deleteUser(authData.user.id);
        throw new Error(userError.message);
      }

      return {
        success: true,
        user: userData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  },

  // Logout
  async logout() {
    await supabaseBrowser.auth.signOut();
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabaseBrowser.auth.getSession();
    return session;
  }
};

// Admin dashboard data service
export const adminDataService = {
  async getDashboardStats() {
    try {
      // Use service role key for admin data (bypasses RLS)
      // Note: For security, these should be called with proper auth checks
      const results = await Promise.allSettled([
        supabaseBrowser.from('students').select('*', { count: 'exact', head: true }),
        supabaseBrowser.from('teachers').select('*', { count: 'exact', head: true }),
        supabaseBrowser.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabaseBrowser.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabaseBrowser.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      return {
        totalStudents: results[0].status === 'fulfilled' ? results[0].value.count || 0 : 0,
        totalTeachers: results[1].status === 'fulfilled' ? results[1].value.count || 0 : 0,
        activeCourses: results[2].status === 'fulfilled' ? results[2].value.count || 0 : 0,
        pendingAdmissions: results[3].status === 'fulfilled' ? results[3].value.count || 0 : 0,
        totalEnrollments: results[4].status === 'fulfilled' ? results[4].value.count || 0 : 0,
        totalRevenue: 0
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        totalStudents: 0,
        totalTeachers: 0,
        activeCourses: 0,
        pendingAdmissions: 0,
        totalEnrollments: 0,
        totalRevenue: 0
      };
    }
  },

  async getRecentAdmissions(limit = 5) {
    const { data, error } = await supabaseBrowser
      .from('admissions')
      .select('*, courses(title)')
      .eq('status', 'pending')
      .order('applied_at', { ascending: false })
      .limit(limit);

    return error ? [] : data || [];
  },

  async getRecentPayments(limit = 5) {
    const { data, error } = await supabaseBrowser
      .from('payments')
      .select('*, students(full_name), courses(title)')
      .order('created_at', { ascending: false })
      .limit(limit);

    return error ? [] : data || [];
  },

  async getUpcomingSessions(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabaseBrowser
      .from('sessions')
      .select('*, courses(title), students(full_name), teachers(full_name)')
      .gte('scheduled_date', today)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(limit);

    return error ? [] : data || [];
  }
};

// Student dashboard data service
export const studentDataService = {
  async getDashboardData(studentId: string) {
    try {
      const [enrollments, sessions, certificates, attendance] = await Promise.allSettled([
        supabaseBrowser.from('enrollments').select('*').eq('student_id', studentId).eq('status', 'active'),
        supabaseBrowser.from('sessions')
          .select('*')
          .eq('student_id', studentId)
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date'),
        supabaseBrowser.from('certificates').select('*').eq('student_id', studentId),
        supabaseBrowser.from('attendance').select('*').eq('student_id', studentId)
      ]);

      const attendanceRecords = attendance.status === 'fulfilled' ? attendance.value.data || [] : [];
      const presentCount = attendanceRecords.filter((a: any) => a.status === 'present').length;
      const attendanceRate = attendanceRecords.length > 0 
        ? Math.round((presentCount / attendanceRecords.length) * 100) 
        : 0;

      return {
        enrollments: enrollments.status === 'fulfilled' ? enrollments.value.data || [] : [],
        upcomingSessions: sessions.status === 'fulfilled' ? sessions.value.data || [] : [],
        certificates: certificates.status === 'fulfilled' ? certificates.value.data || [] : [],
        attendanceRate
      };
    } catch (error) {
      console.error('Student dashboard error:', error);
      return { enrollments: [], upcomingSessions: [], certificates: [], attendanceRate: 0 };
    }
  }
};

// Teacher dashboard data service
export const teacherDataService = {
  async getDashboardData(teacherId: string) {
    try {
      const [enrollments, sessions, courses] = await Promise.allSettled([
        supabaseBrowser.from('enrollments').select('*').eq('teacher_id', teacherId).eq('status', 'active'),
        supabaseBrowser.from('sessions')
          .select('*')
          .eq('teacher_id', teacherId)
          .eq('scheduled_date', new Date().toISOString().split('T')[0]),
        supabaseBrowser.from('courses').select('*').eq('teacher_id', teacherId)
      ]);

      return {
        totalStudents: enrollments.status === 'fulfilled' ? (enrollments.value.data || []).length : 0,
        todaysClasses: sessions.status === 'fulfilled' ? (sessions.value.data || []).length : 0,
        totalCourses: courses.status === 'fulfilled' ? (courses.value.data || []).length : 0,
        hoursThisWeek: 0
      };
    } catch (error) {
      console.error('Teacher dashboard error:', error);
      return { totalStudents: 0, todaysClasses: 0, totalCourses: 0, hoursThisWeek: 0 };
    }
  }
};
