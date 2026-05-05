'use client';

import { useCallback } from 'react';
import { usePaginatedData, useAdminMutation } from './use-admin-data';

export interface Course {
  id: string;
  title: string;
  title_ar?: string;
  title_ur?: string;
  slug: string;
  level: string;
  category: string;
  description?: string;
  duration?: string;
  schedule?: string;
  fee_min?: number;
  fee_max?: number;
  prerequisites?: string;
  core_books?: string;
  next_course?: string;
  teacher_id?: string;
  teacher?: {
    full_name: string;
    specialization?: string;
  };
  image_url?: string;
  status: 'published' | 'draft' | 'archived';
  display_order: number;
  students_count?: number;
  created_at: string;
  updated_at: string;
}

export function useCourses(initialPage = 1, initialLimit = 10) {
  const fetchCourses = useCallback(async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const res = await fetch(`/api/admin/courses?${params}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch courses');
    
    const data = await res.json();
    return { data: data.courses || [], total: data.total || 0 };
  }, []);

  return usePaginatedData<Course>('courses', fetchCourses, {
    initialPage,
    initialLimit
  });
}

export function useCourseMutations() {
  const createMutation = useAdminMutation<Course>('courses');
  const updateMutation = useAdminMutation<Course>('courses');
  const deleteMutation = useAdminMutation<void>('courses');

  const createCourse = async (courseData: Partial<Course>) => {
    return createMutation.mutate(
      async () => {
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
        if (!res.ok) throw new Error('Failed to create course');
        return res.json();
      },
      { successMessage: 'Course created successfully' }
    );
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    return updateMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/courses/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
        if (!res.ok) throw new Error('Failed to update course');
        return res.json();
      },
      { successMessage: 'Course updated successfully' }
    );
  };

  const deleteCourse = async (id: string) => {
    return deleteMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/courses/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete course');
      },
      { successMessage: 'Course deleted successfully' }
    );
  };

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    isCreating: createMutation.loading,
    isUpdating: updateMutation.loading,
    isDeleting: deleteMutation.loading
  };
}
