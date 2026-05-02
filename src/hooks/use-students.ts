'use client';

import { useCallback } from 'react';
import { usePaginatedData, useAdminMutation } from './use-admin-data';

export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  full_address?: string;
  age: number;
  language?: string;
  guardian_name?: string;
  guardian_phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  is_approved: boolean;
  enrolled_courses?: string[];
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
  academic_details?: string;
}

export function useStudents(initialPage = 1, initialLimit = 10) {
  const fetchStudents = useCallback(async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const res = await fetch(`/api/admin/students?${params}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch students');
    
    const data = await res.json();
    return { data: data.students || [], total: data.total || 0 };
  }, []);

  return usePaginatedData<Student>('students', fetchStudents, {
    initialPage,
    initialLimit
  });
}

export function useStudentMutations() {
  const createMutation = useAdminMutation<Student>('students');
  const updateMutation = useAdminMutation<Student>('students');
  const deleteMutation = useAdminMutation<void>('students');

  const createStudent = async (studentData: Partial<Student>) => {
    return createMutation.mutate(
      async () => {
        const res = await fetch('/api/admin/students', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (!res.ok) throw new Error('Failed to create student');
        return res.json();
      },
      { successMessage: 'Student created successfully' }
    );
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    return updateMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/students/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (!res.ok) throw new Error('Failed to update student');
        return res.json();
      },
      { successMessage: 'Student updated successfully' }
    );
  };

  const deleteStudent = async (id: string) => {
    return deleteMutation.mutate(
      async () => {
        const res = await fetch(`/api/admin/students/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete student');
      },
      { successMessage: 'Student deleted successfully' }
    );
  };

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating: createMutation.loading,
    isUpdating: updateMutation.loading,
    isDeleting: deleteMutation.loading
  };
}
