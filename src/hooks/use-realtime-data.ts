"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser, getCurrentUser } from '@/lib/supabase-browser';
import { adminDataService, studentDataService, teacherDataService } from '@/lib/client-services';

// Generic hook for fetching and subscribing to data
export function useRealtimeData<T>(
  tableName: string,
  queryFn: () => Promise<{ data: T[] | null; error: Error | null }>,
  filter?: string
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error: fetchError } = await queryFn();
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setData(result || []);
        setError(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const channel = supabaseBrowser
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          ...(filter && { filter })
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                (item as T & { id: string }).id === payload.new.id ? (payload.new as T) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item) => (item as T & { id: string }).id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [tableName, filter, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Admin Dashboard Hook with deferred real-time connection
export function useAdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    pendingAdmissions: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use admin dashboard API with credentials
      const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard');
      
      setStats(data.stats || {});
      setRecentAdmissions(data.recentAdmissions || []);
      setRecentPayments(data.recentPayments || []);
      setUpcomingSessions(data.upcomingSessions || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Defer real-time subscriptions by 2 seconds to allow initial render
    const timeoutId = setTimeout(() => {
      // Set up real-time subscriptions
      const channels = [
        { name: 'admissions', table: 'admissions' },
        { name: 'payments', table: 'payments' },
        { name: 'students', table: 'students' },
        { name: 'teachers', table: 'teachers' },
        { name: 'courses', table: 'courses' },
        { name: 'sessions', table: 'sessions' }
      ].map(config => {
        return supabaseBrowser
          .channel(`admin-${config.name}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: config.table }, () => {
            fetchDashboardData();
          })
          .subscribe();
      });

      return () => {
        channels.forEach(channel => supabaseBrowser.removeChannel(channel));
      };
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [fetchDashboardData]);

  return { stats, recentAdmissions, recentPayments, upcomingSessions, loading, refetch: fetchDashboardData };
}

// Admin Students Hook
export function useAdminStudents(page = 1, limit = 10, search = '', status = '') {
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status })
      });
      
      const res = await fetch(`/api/admin/students?${params}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setStudents(data.students || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchStudents();

    const channel = supabaseBrowser
      .channel('admin-students')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchStudents();
      })
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [fetchStudents]);

  const createStudent = async (studentData: any) => {
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchStudents();
    return data;
  };

  const updateStudent = async (id: string, studentData: any) => {
    const res = await fetch(`/api/admin/students/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchStudents();
    return data;
  };

  const deleteStudent = async (id: string) => {
    const res = await fetch(`/api/admin/students/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchStudents();
    return data;
  };

  return {
    students,
    total,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  };
}

// Teacher Dashboard Hook with deferred real-time
export function useTeacherDashboard(teacherId: string | null) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todaysClasses: 0,
    totalCourses: 0,
    hoursThisWeek: 0
  });
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      // Use API with credentials for proper auth
      const res = await fetch(`/api/teacher/dashboard?teacherId=${teacherId}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard');
      
      setStats(data.stats || {});
      setTodaySchedule(data.todaySchedule || []);
      setStudents(data.students || []);
    } catch (error) {
      console.error('Teacher dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchData();

    if (!teacherId) return;

    // Defer real-time subscriptions
    const timeoutId = setTimeout(() => {
      const enrollmentsChannel = supabaseBrowser
        .channel('teacher-enrollments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'enrollments', filter: `teacher_id=eq.${teacherId}` },
          () => fetchData()
        )
        .subscribe();

      const sessionsChannel = supabaseBrowser
        .channel('teacher-sessions')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessions', filter: `teacher_id=eq.${teacherId}` },
          () => fetchData()
        )
        .subscribe();

      return () => {
        supabaseBrowser.removeChannel(enrollmentsChannel);
        supabaseBrowser.removeChannel(sessionsChannel);
      };
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [teacherId, fetchData]);

  return { stats, todaySchedule, students, loading, refetch: fetchData };
}

// Teacher Students Hook
export function useTeacherStudents(teacherId: string | null, courseId?: string) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({ teacherId });
      if (courseId) params.append('courseId', courseId);
      
      const res = await fetch(`/api/teacher/students?${params}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setStudents(data.students || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [teacherId, courseId]);

  useEffect(() => {
    fetchStudents();

    if (!teacherId) return;

    const channel = supabaseBrowser
      .channel('teacher-students-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments', filter: `teacher_id=eq.${teacherId}` },
        () => fetchStudents()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [teacherId, fetchStudents]);

  const markAttendance = async (attendanceData: any) => {
    const res = await fetch('/api/teacher/students', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  };

  return { students, loading, error, refetch: fetchStudents, markAttendance };
}

// Student Dashboard Hook with deferred real-time
export function useStudentDashboard(studentId: string | null) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      // Use client-side service instead of API
      const data = await studentDataService.getDashboardData(studentId);
      
      setEnrollments(data.enrollments);
      setUpcomingSessions(data.upcomingSessions);
      setCertificates(data.certificates);
      setAttendanceRate(data.attendanceRate);
    } catch (error) {
      console.error('Student dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();

    if (!studentId) return;

    // Defer real-time subscriptions
    const timeoutId = setTimeout(() => {
      const enrollmentsChannel = supabaseBrowser
        .channel('student-enrollments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'enrollments', filter: `student_id=eq.${studentId}` },
          () => fetchData()
        )
        .subscribe();

      const sessionsChannel = supabaseBrowser
        .channel('student-sessions')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessions', filter: `student_id=eq.${studentId}` },
          () => fetchData()
        )
        .subscribe();

      const certificatesChannel = supabaseBrowser
        .channel('student-certificates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'certificates', filter: `student_id=eq.${studentId}` },
          () => fetchData()
        )
        .subscribe();

      return () => {
        supabaseBrowser.removeChannel(enrollmentsChannel);
        supabaseBrowser.removeChannel(sessionsChannel);
        supabaseBrowser.removeChannel(certificatesChannel);
      };
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [studentId, fetchData]);

  return { enrollments, upcomingSessions, certificates, attendanceRate, loading, refetch: fetchData };
}

// Student Attendance Hook
export function useStudentAttendance(studentId: string | null) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/student/attendance?studentId=${studentId}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setRecords(data.records || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchAttendance();

    if (!studentId) return;

    const channel = supabaseBrowser
      .channel('student-attendance-records')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${studentId}` },
        () => fetchAttendance()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [studentId, fetchAttendance]);

  return { records, loading, error, refetch: fetchAttendance };
}

// Student Certificates Hook
export function useStudentCertificates(studentId: string | null) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/student/certificates?studentId=${studentId}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setCertificates(data.certificates || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchCertificates();

    if (!studentId) return;

    const channel = supabaseBrowser
      .channel('student-certs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates', filter: `student_id=eq.${studentId}` },
        () => fetchCertificates()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [studentId, fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
}

// Admin Registrations Hook with real-time updates
interface RegistrationFilters {
  status?: string;
  userType?: string;
  search?: string;
}

export function useAdminRegistrations(page = 1, limit = 20, filters: RegistrationFilters = {}) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, userType, search } = filters;

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(userType && { userType }),
        ...(search && { search })
      });

      // Get user from storage for authorization
      const storedUser = typeof window !== 'undefined' 
        ? localStorage.getItem('user') || sessionStorage.getItem('user') 
        : null;
      const user = storedUser ? JSON.parse(storedUser) : null;

      const res = await fetch(`/api/admin/registrations?${params}`, {
        credentials: 'include',
        headers: {
          ...(user && { 'Authorization': `Bearer ${storedUser}` })
        }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setRegistrations(data.registrations || []);
      setTotal(data.pagination?.total || 0);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, userType, search]);

  useEffect(() => {
    fetchRegistrations();

    // Subscribe to real-time changes
    const channel = supabaseBrowser
      .channel('admin-registrations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
        fetchRegistrations();
      })
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  const createRegistration = async (registrationData: any) => {
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') || sessionStorage.getItem('user') 
      : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const res = await fetch('/api/admin/registrations', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(user && { 'Authorization': `Bearer ${JSON.stringify(user)}` })
      },
      body: JSON.stringify(registrationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchRegistrations();
    return data;
  };

  const updateRegistration = async (id: string, registrationData: any) => {
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') || sessionStorage.getItem('user') 
      : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const res = await fetch('/api/admin/registrations', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(user && { 'Authorization': `Bearer ${JSON.stringify(user)}` })
      },
      body: JSON.stringify({ id, ...registrationData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchRegistrations();
    return data;
  };

  const deleteRegistration = async (id: string) => {
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') || sessionStorage.getItem('user') 
      : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const res = await fetch(`/api/admin/registrations?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...(user && { 'Authorization': `Bearer ${JSON.stringify(user)}` })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchRegistrations();
    return data;
  };

  const approveRegistration = async (id: string, adminId: string, notes?: string) => {
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') || sessionStorage.getItem('user') 
      : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const res = await fetch('/api/admin/registrations/approve', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(user && { 'Authorization': `Bearer ${JSON.stringify(user)}` })
      },
      body: JSON.stringify({ id, action: 'approve', adminId, adminNotes: notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchRegistrations();
    return data;
  };

  const rejectRegistration = async (id: string, adminId: string, notes?: string) => {
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') || sessionStorage.getItem('user') 
      : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const res = await fetch('/api/admin/registrations/approve', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(user && { 'Authorization': `Bearer ${JSON.stringify(user)}` })
      },
      body: JSON.stringify({ id, action: 'reject', adminId, adminNotes: notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchRegistrations();
    return data;
  };

  return {
    registrations,
    total,
    loading,
    error,
    refetch: fetchRegistrations,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    approveRegistration,
    rejectRegistration
  };
}
