"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { TrendingUp, BarChart3, Award, BookOpen, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard, useStudentAttendance } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentProgressPage() {
  return (
    <StudentRoute>
      <StudentProgressContent />
    </StudentRoute>
  );
}

function StudentProgressContent() {
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

  // Use real-time hooks for dashboard and attendance data
  const { enrollments, attendanceRate, loading: dashboardLoading } = useStudentDashboard(studentId);
  const { records: attendanceRecords, loading: attendanceLoading } = useStudentAttendance(studentId);

  const loading = dashboardLoading || attendanceLoading;

  // Calculate stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e: any) => e.progress === 100).length;
  const averageProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / totalCourses)
    : 0;
  const totalHours = enrollments.reduce((sum: number, e: any) => sum + (e.hours_learned || 0), 0);

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
            {t("sidebar.progress") || "My Progress"}
          </h1>
          <p className="text-[var(--text-muted)]">
            Track your learning journey and achievements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-lg border border-[var(--border)]"
        >
          {enrollments.length > 0 ? (
            <div className="space-y-8">
              {/* Progress Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{totalCourses}</p>
                      <p className="text-xs text-[var(--text-muted)]">Courses</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{completedCourses}</p>
                      <p className="text-xs text-[var(--text-muted)]">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{averageProgress}%</p>
                      <p className="text-xs text-[var(--text-muted)]">Avg Progress</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{totalHours}</p>
                      <p className="text-xs text-[var(--text-muted)]">Hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Progress List */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                  Course Progress
                </h3>
                <div className="space-y-4">
                  {enrollments.map((enrollment: any, index: number) => (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">{enrollment.course_title || enrollment.course?.title}</h4>
                            <p className="text-xs text-[var(--text-muted)]">
                              {enrollment.completed_lessons || 0} of {enrollment.total_lessons || 0} lessons completed
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-[var(--primary)]">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--gold)] rounded-full transition-all"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Attendance Summary */}
              {attendanceRecords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    Attendance Overview
                  </h3>
                  <div className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--text-muted)]">Attendance Rate</p>
                        <p className="text-3xl font-bold text-[var(--text-primary)]">{attendanceRate}%</p>
                      </div>
                      <div className="w-24 h-24 rounded-full border-4 border-[var(--primary)] flex items-center justify-center">
                        <span className="text-2xl font-bold text-[var(--primary)]">{attendanceRate}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-2 bg-green-500/10 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                          {attendanceRecords.filter((r: any) => r.status === 'present').length}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">Present</p>
                      </div>
                      <div className="text-center p-2 bg-red-500/10 rounded-lg">
                        <p className="text-lg font-bold text-red-600">
                          {attendanceRecords.filter((r: any) => r.status === 'absent').length}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">Absent</p>
                      </div>
                      <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">
                          {attendanceRecords.filter((r: any) => r.status === 'late').length}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">Late</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No Progress Data Yet
                </h3>
                <p className="text-[var(--text-muted)] max-w-md">
                  Your progress will be tracked once you enroll in courses and start learning.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
