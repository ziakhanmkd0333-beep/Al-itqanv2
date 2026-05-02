'use client';

import { useCallback } from 'react';
import { usePaginatedData, useAdminMutation } from './use-admin-data';

export interface Teacher {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  qualifications?: string;
  experience_years?: number;
  bio?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
}

export function useTeachers(initialPage = 1, initialLimit = 10) {
  const fetchTeachers = useCallback(async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const res = await fetch(`/api/admin/teachers?${params}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch teachers');
    
    const data = await res.json();
    return { data: data.teachers || [], total: data.total || 0 };
  }, []);

  return usePaginatedData<Teacher>('teachers', fetchTeachers, {
    initialPage,
    initialLimit
  });
}

export function useTeacherMutations() {
  const createMutation = useAdminMutation<Teacher>('teachers');
  const updateMutation = useAdminMutation<Teacher>('teachers');
  const deleteMutation = useAdminMutation<void>('teachers');

  const createTeacher = async (teacherData: Partial<Teacher>) => {
    return createMutation.mutate(
      async () => {
        const res = await fetch('/api/admin/teachers', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacherData)
        });
        if (!res.ok) throw new Error('Failed to create teacher');
        return res.json();
      },
      { successMessage: 'Teacher created successfully' }
    );
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>) => {
    return updateMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/teachers/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacherData)
        });
        if (!res.ok) throw new Error('Failed to update teacher');
        return res.json();
      },
      { successMessage: 'Teacher updated successfully' }
    );
  };

  const deleteTeacher = async (id: string) => {
    return deleteMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/teachers/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete teacher');
      },
      { successMessage: 'Teacher deleted successfully' }
    );
  };

  return {
    createTeacher,
    updateTeacher,
    deleteTeacher,
    isCreating: createMutation.loading,
    isUpdating: updateMutation.loading,
    isDeleting: deleteMutation.loading
  };
}
