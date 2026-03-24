"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Play,
  User,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard } from "@/hooks/use-realtime-data";
import { supabaseBrowser, getCurrentUser } from "@/lib/supabase-browser";

export default function StudentDashboard() {
  return (
    <StudentRoute>
      <StudentDashboardContent />
    </StudentRoute>
  );
}

function StudentDashboardContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Get student ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'student' || !user.role) {
          const { getStudentProfile } = await import("@/lib/supabase-browser");
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

  // Use real-time hook for student dashboard
  const { enrollments, upcomingSessions, certificates, attendanceRate, loading, refetch } = useStudentDashboard(studentId);

  // Monitor real-time connection
  useEffect(() => {
    const channel = supabaseBrowser.channel('student-connection');
    
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="student" />
      
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
                {t("dashboard.welcomeStudent") || "Student Dashboard"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {enrollments.length > 0 
                  ? `${t("dashboard.studentSubtitle") || `You are enrolled in ${enrollments.length} course(s).`}`
                  : t("dashboard.noEnrollments") || "Start your learning journey by enrolling in a course."
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
              <Link
                href="/dashboard/student/profile"
                className={`flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <User className="w-5 h-5 text-[var(--primary)]" />
                <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.myProfile") || "My Profile"}</span>
              </Link>
              <button className={`flex items-center gap-2 bg-[var(--gold)] text-[var(--primary-dark)] px-4 py-2 rounded-xl font-semibold hover:bg-[var(--gold-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                <MessageCircle className="w-5 h-5" />
                <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.contactTeacher") || "Contact Teacher"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { labelKey: "dashboard.courses", label: "Courses", value: enrollments.length, icon: BookOpen, color: "#3B82F6" },
            { labelKey: "dashboard.hoursLearned", label: "Hours Learned", value: "48", icon: Clock, color: "#10B981" },
            { labelKey: "dashboard.certificates", label: "Certificates", value: certificates.length, icon: Award, color: "#F59E0B" },
            { labelKey: "dashboard.progress", label: "Progress", value: `${attendanceRate}%`, icon: TrendingUp, color: "#8B5CF6" }
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
          {/* My Courses */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    {t("dashboard.myCourses") || "My Courses"}
                  </h2>
                  <Link href="/courses" className={`text-[var(--primary)] text-sm hover:underline ${isRTL ? "arabic-text" : ""}`}>
                    {t("dashboard.browseMore") || "Browse More"}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : enrollments.length > 0 ? (
                  enrollments.map((course: any) => (
                    <div key={course.id} className="p-6 hover:bg-[var(--background-green)] transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-[var(--text-primary)] font-bold text-lg mb-1">{course.course_title || course.title || 'Course'}</h3>
                          <p className={`text-[var(--text-muted)] text-sm mb-3 ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.teacher") || "Teacher"}: {course.teacher_name || course.teacher || 'Assigned Teacher'}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className={`flex items-center justify-between text-sm mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <span className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.progress") || "Progress"}</span>
                              <span className="text-[var(--primary)] font-semibold">{course.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-[var(--background-green)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                                style={{ width: `${course.progress || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <p className={`text-[var(--text-muted)] text-xs ${isRTL ? "arabic-text" : ""}`}>
                            {course.completed_lessons || 0} {t("dashboard.of") || "of"} {course.total_lessons || 0} {t("dashboard.lessonsCompleted") || "lessons completed"}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Calendar className="w-4 h-4" />
                            <span>{course.next_class || 'Schedule TBD'}</span>
                          </div>
                          <button className={`flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Play className="w-4 h-4" />
                            <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.continueLearning") || "Continue Learning"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No courses enrolled yet. <Link href="/courses" className="text-[var(--primary)] hover:underline">Browse courses</Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Certificates Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Award className="w-5 h-5 text-[var(--primary)]" />
                  {t("dashboard.myCertificates") || "My Certificates"}
                </h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : certificates.length > 0 ? (
                  certificates.map((cert: any) => (
                    <div key={cert.id} className={`p-4 flex items-center justify-between hover:bg-[var(--background-green)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{cert.title || cert.course_title || 'Certificate'}</p>
                        <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.earnedOn") || "Earned on"} {new Date(cert.issued_at || cert.date).toLocaleDateString()}</p>
                      </div>
                      <button className={`text-[var(--primary)] hover:underline text-sm font-medium ${isRTL ? "arabic-text" : ""}`}>
                        {t("dashboard.downloadPDF") || "Download PDF"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No certificates earned yet. Keep learning!
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  {t("dashboard.upcomingClasses") || "Upcoming Classes"}
                </h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session: any) => (
                    <div key={session.id} className="p-4 hover:bg-[var(--background-green)] transition-colors">
                      <p className="text-[var(--text-primary)] font-medium">{session.course_title || session.course || 'Class'}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-muted)]">
                        <span>{session.date || 'Today'}</span>
                        <span>{session.time || 'TBD'}</span>
                        <span>({session.duration || '30 min'})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No upcoming classes scheduled
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[var(--border)]">
                <Link href="/dashboard/student/schedule" className={`flex items-center justify-center gap-2 text-[var(--primary)] font-medium hover:underline ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.viewFullSchedule") || "View Full Schedule"}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-lg font-bold ${isRTL ? "arabic-text" : ""}`}>
                  {t("dashboard.recentActivity") || "Recent Activity"}
                </h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  </div>
                ) : enrollments.length > 0 ? (
                  enrollments.slice(0, 3).map((enrollment: any, index: number) => (
                    <div key={enrollment.id || index} className="p-4 hover:bg-[var(--background-green)] transition-colors">
                      <p className="text-[var(--text-secondary)] text-sm">
                        {t("dashboard.enrolledIn") || "Enrolled in"} {enrollment.course_title || enrollment.title || 'Course'}
                      </p>
                      <p className="text-[var(--text-muted)] text-xs mt-1">
                        {new Date(enrollment.enrolled_at || enrollment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No recent activity
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card rounded-2xl border border-[var(--border)] shadow-sm p-6"
            >
              <h2 className={`text-[var(--text-primary)] text-lg font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.quickLinks") || "Quick Links"}
              </h2>
              <div className="space-y-2">
                {[
                  { labelKey: "dashboard.myProgress", label: "My Progress", href: "/dashboard/student/progress" },
                  { labelKey: "dashboard.attendanceHistory", label: "Attendance History", href: "/dashboard/student/attendance" },
                  { labelKey: "dashboard.courseMaterials", label: "Course Materials", href: "/dashboard/student/materials" },
                  { labelKey: "dashboard.helpSupport", label: "Help & Support", href: "/contact" }
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center justify-between p-3 rounded-xl hover:bg-[var(--background-green)] transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-[var(--text-secondary)] group-hover:text-[var(--primary)] ${isRTL ? "arabic-text" : ""}`}>{t(link.labelKey) || link.label}</span>
                    <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
