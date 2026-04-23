// Supabase Database Types - Minimal interfaces for joined queries

export interface StudentRef {
  full_name?: string;
}

export interface TeacherRef {
  full_name?: string;
  photo_url?: string;
}

export interface CourseRef {
  title?: string;
}

export interface LessonProgressRef {
  completed?: boolean;
  watched_seconds?: number;
  last_watched_at?: string;
}

// Generic type for Supabase joined relation that may be an array or object
export type SupabaseJoin<T> = T | T[] | null | undefined;

// Helper to safely extract nested relation data
export function getJoinValue<T>(
  value: SupabaseJoin<T>
): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}
