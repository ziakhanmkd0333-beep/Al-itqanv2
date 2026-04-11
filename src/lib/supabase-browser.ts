import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton browser client to prevent multiple GoTrueClient instances
let _supabaseBrowser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side - return a dummy client
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
    });
  }

  if (!_supabaseBrowser) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('[supabase-browser] Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
    }

    _supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return _supabaseBrowser;
}

// Export singleton instance directly (not a proxy)
export const supabaseBrowser = getSupabaseBrowser();

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
export const setCurrentUser = (user: Record<string, unknown>) => {
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
  callback: (payload: Record<string, unknown>) => void,
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
  callback: (payload: Record<string, unknown>) => void
) => {
  return subscribeToTable(table, callback, `user_id=eq.${userId}`);
};

// Subscribe to teacher's students
export const subscribeToTeacherStudents = (
  teacherId: string,
  callback: (payload: Record<string, unknown>) => void
) => {
  return subscribeToTable('enrollments', callback, `teacher_id=eq.${teacherId}`);
};

// Subscribe to student's enrollments
export const subscribeToStudentEnrollments = (
  studentId: string,
  callback: (payload: Record<string, unknown>) => void
) => {
  return subscribeToTable('enrollments', callback, `student_id=eq.${studentId}`);
};

// Helper to get student profile from user ID
export const getStudentProfile = async (userId: string) => {
  try {
    const { data, error } = await supabaseBrowser
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('[getStudentProfile] Error:', error.message, error.code);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[getStudentProfile] Exception:', err);
    return null;
  }
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
