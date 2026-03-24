"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Upload,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useTeacherDashboard } from "@/hooks/use-realtime-data";
import { supabaseBrowser, getCurrentUser } from "@/lib/supabase-browser";

function getStatusIcon(status: string) {
  switch (status) {
    case "present":
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "absent":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  }
}

export default function TeacherDashboard() {
  return (
    <TeacherRoute>
      <TeacherDashboardContent />
    </TeacherRoute>
  );
}

function TeacherDashboardContent() {
  const { t, isRTL } = useTranslation();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  
  // Get teacher ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'teacher') {
          const { getTeacherProfile } = await import("@/lib/supabase-browser");
          const profile = await getTeacherProfile(user.id);
          if (profile?.id) {
            setTeacherId(profile.id);
          }
        } else {
          // If admin, maybe allow them to see a default teacher? 
          // For now, just set as user.id if it's admin (they might be testing)
          setTeacherId(user.id);
        }
      }
    }
    loadProfile();
  }, []);

  // Use real-time hook for teacher dashboard
  const { stats, todaySchedule, students, loading, refetch } = useTeacherDashboard(teacherId);

  // Monitor real-time connection
  useEffect(() => {
    const channel = supabaseBrowser.channel('teacher-connection');
    
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="teacher" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.welcomeTeacher") || "Teacher Dashboard"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {stats.todaysClasses > 0 
                  ? `${t("dashboard.teacherSubtitle") || `You have ${stats.todaysClasses} classes scheduled for today.`}`
                  : t("dashboard.noClassesToday") || "No classes scheduled for today"
                }
              </p>
              <div className={`flex items-center gap-2 mt-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <Wifi className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>Real-time connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <WifiOff className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>Disconnected</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={loading}
                className={`flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors disabled:opacity-50 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{loading ? "Loading..." : "Refresh"}</span>
              </button>
              <button className={`flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
                <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.messages") || "Messages"}</span>
              </button>
              <button className={`flex items-center gap-2 bg-[var(--gold)] text-[var(--primary-dark)] px-4 py-2 rounded-xl font-semibold hover:bg-[var(--gold-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                <Upload className="w-5 h-5" />
                <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.uploadMaterial") || "Upload Material"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { labelKey: "dashboard.totalStudents", label: "Total Students", value: stats.totalStudents, icon: Users, color: "#3B82F6" },
            { labelKey: "dashboard.todaysClasses", label: "Today's Classes", value: stats.todaysClasses, icon: Calendar, color: "#10B981" },
            { labelKey: "dashboard.courses", label: "Courses", value: stats.totalCourses, icon: BookOpen, color: "#F59E0B" },
            { labelKey: "dashboard.hoursThisWeek", label: "Hours This Week", value: stats.hoursThisWeek, icon: Clock, color: "#8B5CF6" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-4 rounded-2xl border border-[var(--border)] text-center"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-[var(--text-primary)] text-2xl font-bold">{stat.value}</p>
              <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{t(stat.labelKey) || stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Calendar className="w-5 h-5 text-[var(--primary)]" />
                    {t("dashboard.todaysSchedule") || "Today's Schedule"}
                  </h2>
                  <Link href="/dashboard/teacher/schedule" className={`text-[var(--primary)] text-sm hover:underline ${isRTL ? "arabic-text" : ""}`}>
                    {t("dashboard.fullSchedule") || "Full Schedule"}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : todaySchedule.length > 0 ? (
                  todaySchedule.map((session: any) => (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-green)] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.status === "completed" ? "bg-green-100" : "bg-[var(--primary)]/10"
                        }`}>
                          {session.status === "completed" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-[var(--primary)]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] font-medium">{session.student_name || session.student || 'Student'}</p>
                          <p className="text-[var(--text-muted)] text-sm">{session.course_title || session.course || 'Course'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[var(--text-primary)] font-semibold">{session.time || 'TBD'}</p>
                        <p className="text-[var(--text-muted)] text-sm">{session.duration || '30 min'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No classes scheduled for today
                  </div>
                )}
              </div>
            </motion.div>

            {/* Assigned Students */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Users className="w-5 h-5 text-[var(--primary)]" />
                    {t("dashboard.myStudents") || "My Students"}
                  </h2>
                  <Link href="/dashboard/teacher/students" className={`text-[var(--primary)] text-sm hover:underline ${isRTL ? "arabic-text" : ""}`}>
                    {t("dashboard.viewAll") || "View All"}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : students.length > 0 ? (
                  students.map((student: any) => (
                    <div key={student.id} className="p-4 hover:bg-[var(--background-green)] transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                            <span className="text-[var(--primary)] font-semibold">{(student.full_name || student.name || 'S').charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-[var(--text-primary)] font-medium">{student.full_name || student.name}</p>
                            <p className="text-[var(--text-muted)] text-sm">{student.course_title || student.course || 'Course'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className={`text-[var(--text-muted)] text-xs ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.progress") || "Progress"}</p>
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <div className="w-20 h-2 bg-[var(--background-green)] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[var(--primary)] rounded-full"
                                  style={{ width: `${student.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-[var(--text-primary)] text-sm font-medium">{student.progress || 0}%</span>
                            </div>
                          </div>
                          <div className={`text-right ${isRTL ? "text-left" : ""}`}>
                            <p className={`text-[var(--text-muted)] text-xs ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.lastSession") || "Last Session"}</p>
                            <p className="text-[var(--text-primary)] text-sm">{student.last_session || 'N/A'}</p>
                          </div>
                          <button className="text-[var(--primary)] hover:bg-[var(--primary)]/10 p-2 rounded-lg transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No students assigned yet
                  </div>
                )}
              </div>
            </motion.div>

            {/* Course Statistics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                  {t("dashboard.courseStatistics") || "Course Statistics"}
                </h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : stats.totalCourses > 0 ? (
                  <div className="p-4">
                    <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.totalCourses") || "Total Courses"}</span>
                      <span className="text-[var(--primary)] font-semibold">{stats.totalCourses}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No course statistics available
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Attendance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-lg font-bold ${isRTL ? "arabic-text" : ""}`}>
                  {t("dashboard.recentAttendance") || "Recent Attendance"}
                </h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : students.length > 0 ? (
                  students.slice(0, 5).map((student: any) => (
                    <div key={student.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-green)] transition-colors">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(student.attendance_status || 'present')}
                        <div>
                          <p className="text-[var(--text-primary)] font-medium">{student.full_name || student.name}</p>
                          <p className="text-[var(--text-muted)] text-sm">{student.last_session || 'Today'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No recent attendance records
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[var(--border)]">
                <Link href="/dashboard/teacher/attendance" className={`flex items-center justify-center gap-2 text-[var(--primary)] font-medium hover:underline ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.markAttendance") || "Mark Attendance"}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm p-6"
            >
              <h2 className={`text-[var(--text-primary)] text-lg font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.quickActions") || "Quick Actions"}
              </h2>
              <div className="space-y-3">
                {[
                  { labelKey: "dashboard.markAttendance", label: "Mark Attendance", href: "/dashboard/teacher/attendance" },
                  { labelKey: "dashboard.uploadMaterials", label: "Upload Materials", href: "/dashboard/teacher/materials" },
                  { labelKey: "dashboard.sessionNotes", label: "Session Notes", href: "/dashboard/teacher/notes" },
                  { labelKey: "dashboard.studentMessages", label: "Student Messages", href: "/dashboard/teacher/messages" }
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center justify-between p-3 rounded-xl hover:bg-[var(--background-green)] transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-[var(--text-secondary)] group-hover:text-[var(--primary)] ${isRTL ? "arabic-text" : ""}`}>{t(action.labelKey) || action.label}</span>
                    <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[var(--primary)] rounded-2xl p-6 text-white"
            >
              <h2 className={`text-lg font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.thisMonth") || "This Month"}</h2>
              <div className="space-y-4">
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-white/80 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.classesConducted") || "Classes Conducted"}</span>
                  <span className="font-bold">96</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-white/80 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.studentsTaught") || "Students Taught"}</span>
                  <span className="font-bold">25</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-white/80 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.avgAttendance") || "Avg. Attendance"}</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-white/80 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.studentProgress") || "Student Progress"}</span>
                  <span className="font-bold text-[#C9A84C]">+15%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
