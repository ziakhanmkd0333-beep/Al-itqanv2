import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-side Supabase client with real-time support
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper to get current user from localStorage (for demo purposes)
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  // Check both 'user' key (used by AuthContext) and 'currentUser' for backwards compatibility
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user') || localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Helper to set current user
export const setCurrentUser = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Helper to clear current user
export const clearCurrentUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
};

// Real-time subscription helpers
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabaseBrowser
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...(filter && { filter })
      },
      callback
    )
    .subscribe();

  return () => {
    supabaseBrowser.removeChannel(channel);
  };
};

// Subscribe to specific user's data
export const subscribeToUserData = (
  table: string,
  userId: string,
  callback: (payload: any) => void
) => {
  return subscribeToTable(table, callback, `user_id=eq.${userId}`);
};

// Subscribe to teacher's students
export const subscribeToTeacherStudents = (
  teacherId: string,
  callback: (payload: any) => void
) => {
  return subscribeToTable('enrollments', callback, `teacher_id=eq.${teacherId}`);
};

// Subscribe to student's enrollments
export const subscribeToStudentEnrollments = (
  studentId: string,
  callback: (payload: any) => void
) => {
  return subscribeToTable('enrollments', callback, `student_id=eq.${studentId}`);
};

// Helper to get student profile from user ID
export const getStudentProfile = async (userId: string) => {
  const { data, error } = await supabaseBrowser
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) return null;
  return data;
};

// Helper to get teacher profile from user ID
export const getTeacherProfile = async (userId: string) => {
  const { data, error } = await supabaseBrowser
    .from('teachers')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) return null;
  return data;
};
