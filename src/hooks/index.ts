// Hooks - Barrel export
export { useAdminData, usePaginatedData, useAdminMutation } from './use-admin-data';
export { useStudents, useStudentMutations, type Student } from './use-students';
export { useTeachers, useTeacherMutations, type Teacher } from './use-teachers';
export { useCourses, useCourseMutations, type Course } from './use-courses';
export { ToastProvider, useToast, useToastHelpers } from './use-toast';
export { useTranslation } from './use-translation';
export {
  useRealtimeData,
  useAdminDashboard,
  useAdminRegistrations,
} from './use-realtime-data';
