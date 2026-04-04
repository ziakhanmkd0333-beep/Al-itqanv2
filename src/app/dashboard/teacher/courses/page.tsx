"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Loader2,
  GraduationCap,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherCoursesPage() {
  return (
    <TeacherRoute>
      <TeacherCoursesContent />
    </TeacherRoute>
  );
}

function TeacherCoursesContent() {
  const { t, isRTL } = useTranslation();
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Record<string, unknown> | null>(null);
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/courses', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
      setLoading(false);
    } catch (error: unknown) {
      console.error('Error fetching courses:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load courses');
      setLoading(false);
    }
  };

  const fetchStudents = async (courseId: string) => {
    setLoadingStudents(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/courses/${courseId}/students`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Students fetch error:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCourseSelect = (course: Record<string, unknown>) => {
    setSelectedCourse(course);
    fetchStudents(course.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="teacher" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="teacher" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
            {t("teacher.courses.title") || "My Courses"}
          </h1>
          <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
            {t("teacher.courses.subtitle") || "View your assigned courses and enrolled students"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Courses List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={`text-lg font-bold text-[var(--text-primary)] mb-4 ${isRTL ? "arabic-text" : ""}`}>
              {t("teacher.courses.assigned") || "Assigned Courses"}
            </h2>
            
            <div className="space-y-4">
              {courses.length === 0 ? (
                <div className="bg-card rounded-2xl border border-[var(--border)] p-8 text-center">
                  <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--text-muted)]">
                    {t("teacher.courses.none") || "No courses assigned yet"}
                  </p>
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className={`bg-card rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCourse?.id === course.id
                        ? "border-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-[var(--primary)]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)]">{course.title}</h3>
                          <p className="text-sm text-[var(--text-muted)]">
                            {course.category} • {course.level}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] ${isRTL ? "rotate-180" : ""}`} />
                    </div>
                    
                    <div className={`flex items-center gap-6 mt-4 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Users className="w-4 h-4 text-[var(--primary)]" />
                        <span className="text-sm text-[var(--text-muted)]">
                          {course.students_count || 0} {t("teacher.courses.students") || "students"}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Clock className="w-4 h-4 text-[var(--primary)]" />
                        <span className="text-sm text-[var(--text-muted)]">{course.duration}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Calendar className="w-4 h-4 text-[var(--primary)]" />
                        <span className="text-sm text-[var(--text-muted)]">{course.schedule}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Students List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={`text-lg font-bold text-[var(--text-primary)] mb-4 ${isRTL ? "arabic-text" : ""}`}>
              {selectedCourse
                ? `${t("teacher.courses.enrolledIn") || "Enrolled in"} ${selectedCourse.title}`
                : t("teacher.courses.selectCourse") || "Select a course to view students"
              }
            </h2>

            {!selectedCourse ? (
              <div className="bg-card rounded-2xl border border-[var(--border)] p-8 text-center">
                <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-muted)]">
                  {t("teacher.courses.selectToView") || "Click on a course to view enrolled students"}
                </p>
              </div>
            ) : loadingStudents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : students.length === 0 ? (
              <div className="bg-card rounded-2xl border border-[var(--border)] p-8 text-center">
                <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-muted)]">
                  {t("teacher.courses.noStudents") || "No students enrolled in this course"}
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="divide-y divide-[var(--border)]">
                  {students.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 hover:bg-[var(--background-green)] transition-colors">
                      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                            <span className="text-[var(--primary)] font-semibold">
                              {(enrollment.student?.full_name || 'S').charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">
                              {enrollment.student?.full_name || 'Unknown'}
                            </p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {enrollment.student?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--text-muted)]">
                            {t("teacher.students.attendance") || "Attendance"}
                          </p>
                          <p className="font-medium text-[var(--primary)]">
                            {enrollment.attendance_rate || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
