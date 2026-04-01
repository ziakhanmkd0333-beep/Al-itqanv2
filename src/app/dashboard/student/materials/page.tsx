"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { FileText, Download, BookOpen, Video, RefreshCw, Folder, ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentMaterialsPage() {
  return (
    <StudentRoute>
      <StudentMaterialsContent />
    </StudentRoute>
  );
}

function StudentMaterialsContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);

  // Get student ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'student' || !user.role) {
          const profile = await getStudentProfile(user.id);
          if (profile?.id) {
            setStudentId(profile.id);
          }
        } else {
          setStudentId(user.id);
        }
      }
    }
    loadProfile();
  }, []);

  // Use real-time hook for student dashboard data
  const { enrollments, loading } = useStudentDashboard(studentId);

  // Extract materials from enrolled courses
  const courseMaterials = enrollments.flatMap((enrollment: any) => {
    const course = enrollment.course;
    if (!course?.materials) return [];
    return course.materials.map((m: any) => ({
      ...m,
      courseTitle: course.title,
      courseId: course.id
    }));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="student" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="student" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
            {t("sidebar.materials") || "Course Materials"}
          </h1>
          <p className="text-[var(--text-muted)]">
            Access your course books, notes, and resources
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-lg border border-[var(--border)]"
        >
          {courseMaterials.length > 0 ? (
            <div className="space-y-6">
              {/* Materials by Course */}
              {enrollments.map((enrollment: any) => {
                const course = enrollment.course;
                if (!course?.materials?.length) return null;
                
                return (
                  <div key={course.id} className="border-b border-[var(--border)] last:border-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <Folder className="w-5 h-5 text-[var(--primary)]" />
                      {course.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {course.materials.map((material: any) => (
                        <motion.div
                          key={material.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                              {material.type === 'video' ? (
                                <Video className="w-6 h-6 text-[var(--primary)]" />
                              ) : (
                                <FileText className="w-6 h-6 text-[var(--primary)]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[var(--text-primary)] truncate">{material.title}</h4>
                              <p className="text-xs text-[var(--text-muted)] mt-1">{material.type} • {material.size || 'Unknown size'}</p>
                              <button className="mt-2 text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No Materials Available
                </h3>
                <p className="text-[var(--text-muted)] max-w-md">
                  Your course materials will appear here once your teacher uploads them.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No Courses Enrolled
                </h3>
                <p className="text-[var(--text-muted)] max-w-md">
                  Enroll in a course to access learning materials.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
