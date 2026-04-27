"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  AlertCircle,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAdminDashboard } from "@/hooks/use-realtime-data";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Types
interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  pendingAdmissions: number;
  totalEnrollments: number;
  monthlyRevenue: number;
  pendingPayments: number;
  activeStudents: number;
  newStudentsThisMonth: number;
}

interface UpcomingSession {
  id: string;
  student: string;
  teacher: string;
  course: string;
  time: string;
  date: string;
}

interface PaymentAnalytics {
  totalRevenue: number;
  pendingAmount: number;
  paidThisMonth: number;
  failedPayments: number;
  revenueGrowth: number;
}

interface CourseEnrollment {
  category: string;
  count: number;
  percentage: number;
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}

function AdminDashboardContent() {
  const { t, isRTL } = useTranslation();
  const { stats: realtimeStats, recentAdmissions, upcomingSessions: realtimeSessions, loading, refetch } = useAdminDashboard();
  const [isConnected, setIsConnected] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    pendingAdmissions: 0,
    totalEnrollments: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    activeStudents: 0,
    newStudentsThisMonth: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [paymentAnalytics] = useState<PaymentAnalytics>({
    totalRevenue: 0,
    pendingAmount: 0,
    paidThisMonth: 0,
    failedPayments: 0,
    revenueGrowth: 0
  });
  const [courseEnrollments] = useState<CourseEnrollment[]>([]);

  // Update stats when real-time data changes
  useEffect(() => {
    if (realtimeStats) {
      setStats(prev => ({
        ...prev,
        totalStudents: realtimeStats.totalStudents || 0,
        activeStudents: realtimeStats.activeStudents || 0,
        totalTeachers: realtimeStats.totalTeachers || 0,
        activeCourses: realtimeStats.activeCourses || 0,
        pendingAdmissions: realtimeStats.pendingAdmissions || 0,
        totalEnrollments: realtimeStats.totalEnrollments || 0,
        monthlyRevenue: realtimeStats.totalRevenue || 0
      }));
    }
    
    if (realtimeSessions) {
      setUpcomingSessions(realtimeSessions.map((s: Record<string, unknown>) => ({
        id: String(s.id || ''),
        student: String((s.students as Record<string, string>)?.full_name || 'Group'),
        teacher: String((s.teachers as Record<string, string>)?.full_name || s.teacher_id || ''),
        course: String((s.courses as Record<string, string>)?.title || s.course_id || ''),
        time: String(s.scheduled_time || ''),
        date: String(s.scheduled_date || '')
      })));
    }
  }, [realtimeStats, realtimeSessions]);

  // Monitor real-time connection
  useEffect(() => {
    const channel = supabaseBrowser.channel('admin-connection');
    
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "deferred":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      deferred: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Category color helper
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Quran": "#10B981",
      "Arabic Language": "#06B6D4",
      "Fiqh": "#F59E0B",
      "Hadith": "#8B5CF6",
      "Sarf & Nahw": "#EC4899"
    };
    return colors[category] || "#6B7280";
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="admin" />

      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.adminTitle") || "Admin Dashboard"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.welcomeBack") || "Welcome back! Here's what's happening today."}
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
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => refetch()}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-card border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors disabled:opacity-50 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className={isRTL ? "arabic-text" : ""}>{loading ? "Loading..." : "Refresh"}</span>
              </button>
              <Link
                href="/dashboard/admin/admissions/"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("dashboard.reviewAdmissions") || "Review Admissions"}</span>
                {stats.pendingAdmissions > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {stats.pendingAdmissions}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("dashboard.totalStudents") || "Total Students",
              value: stats.totalStudents.toLocaleString(),
              icon: Users,
              color: "#3B82F6",
              change: `+${stats.newStudentsThisMonth}`,
              changeLabel: t("dashboard.thisMonth") || "this month"
            },
            {
              label: t("dashboard.activeTeachers") || "Active Teachers",
              value: stats.totalTeachers.toString(),
              icon: GraduationCap,
              color: "#10B981",
              change: "+5%",
              changeLabel: t("dashboard.fromLastMonth") || "from last month"
            },
            {
              label: t("dashboard.courses") || "Courses",
              value: stats.activeCourses.toString(),
              icon: BookOpen,
              color: "#F59E0B",
              change: "0%",
              changeLabel: t("dashboard.noChange") || "no change"
            },
            {
              label: t("dashboard.monthlyRevenue") || "Monthly Revenue",
              value: `$${stats.monthlyRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "#8B5CF6",
              change: `+${paymentAnalytics.revenueGrowth}%`,
              changeLabel: t("dashboard.growth") || "growth"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-[var(--border)] shadow-sm"
            >
              <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`text-[var(--text-muted)] text-sm mb-1 ${isRTL ? "arabic-text" : ""}`}>{stat.label}</p>
                  <p className="text-[var(--text-primary)] text-2xl font-bold">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {stat.change.startsWith("+") ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : stat.change.startsWith("-") ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                    <span className={`text-sm ${stat.change.startsWith("+") ? "text-green-500" : stat.change.startsWith("-") ? "text-red-500" : "text-[var(--text-muted)]"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{stat.changeLabel}</span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("dashboard.activeStudents") || "Active Students",
              value: stats.activeStudents,
              icon: Users,
              color: "#3B82F6"
            },
            {
              label: t("dashboard.pendingAdmissions") || "Pending Admissions",
              value: stats.pendingAdmissions,
              icon: ClipboardList,
              color: "#F59E0B",
              alert: stats.pendingAdmissions > 0
            },
            {
              label: t("dashboard.pendingPayments") || "Pending Payments",
              value: stats.pendingPayments,
              icon: CreditCard,
              color: "#EF4444",
              alert: stats.pendingPayments > 5
            },
            {
              label: t("dashboard.totalRevenue") || "Total Revenue",
              value: `$${paymentAnalytics.totalRevenue.toLocaleString()}`,
              icon: TrendingUp,
              color: "#10B981"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className={`bg-card p-4 rounded-xl border ${stat.alert ? "border-yellow-300 bg-yellow-50/50" : "border-[var(--border)]"}`}
            >
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{stat.label}</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  {stat.alert && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-[var(--border)] p-6"
          >
            <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                <h2 className={`text-lg font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {t("dashboard.revenueAnalytics") || "Revenue Analytics"}
                </h2>
              </div>
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button className="px-3 py-1 text-sm bg-[var(--primary)] text-white rounded-lg">6 Months</button>
                <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)]">
                  Year
                </button>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-48 flex items-end justify-center gap-2 px-4">
              {loading ? (
                <div className="flex items-center justify-center w-full">
                  <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                </div>
              ) : paymentAnalytics.totalRevenue > 0 ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[var(--primary)]">${paymentAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Total Revenue</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-[var(--text-muted)]">No revenue data available</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className={`flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("dashboard.totalRevenue") || "Total Revenue"}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">${paymentAnalytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className={`flex items-center gap-1 text-green-500 ${isRTL ? "flex-row-reverse" : ""}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+{paymentAnalytics.revenueGrowth}%</span>
              </div>
            </div>
          </motion.div>

          {/* Course Enrollment Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-2xl border border-[var(--border)] p-6"
          >
            <div className={`flex items-center gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <PieChart className="w-5 h-5 text-[var(--primary)]" />
              <h2 className={`text-lg font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                {t("dashboard.courseEnrollment") || "Course Enrollment"}
              </h2>
            </div>

            {/* Simple Pie Chart Visualization */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {courseEnrollments.map((course, index) => {
                    let cumulativePercentage = 0;
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += courseEnrollments[i].percentage;
                    }
                    const strokeDasharray = `${course.percentage * 2.51327} ${251.327 - course.percentage * 2.51327}`;
                    const strokeDashoffset = -cumulativePercentage * 2.51327;
                    return (
                      <circle
                        key={course.category}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getCategoryColor(course.category)}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalStudents}</p>
                    <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                      {t("dashboard.students") || "students"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {courseEnrollments.map((course) => (
                <div key={course.category} className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(course.category) }}
                    />
                    <span className={`text-sm text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                      {course.category}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{course.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Admissions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
          >
            <div className={`p-6 border-b border-[var(--border)] flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse arabic-text" : ""}`}>
                <ClipboardList className="w-5 h-5 text-[var(--primary)]" />
                {t("dashboard.recentAdmissions") || "Recent Admissions"}
              </h2>
              <Link
                href="/dashboard/admin/admissions/"
                className="text-[var(--primary)] text-sm hover:underline flex items-center gap-1"
              >
                {t("dashboard.viewAll") || "View All"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                </div>
              ) : recentAdmissions.length > 0 ? (
                recentAdmissions.map((admission: Record<string, unknown>) => (
                  <div
                    key={String(admission.id)}
                    className={`p-4 flex items-center justify-between hover:bg-[var(--background-green)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {getStatusIcon(String(admission.status))}
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{String(admission.student_name || admission.full_name || 'Student')}</p>
                        <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{String(admission.course_title || (admission.courses as Record<string, string>)?.title || 'Course')}</p>
                      </div>
                    </div>
                    <div className={isRTL ? "text-left" : "text-right"}>
                      {getStatusBadge(String(admission.status))}
                      <p className={`text-[var(--text-muted)] text-xs mt-1 ${isRTL ? "arabic-text" : ""}`}>
                        {new Date(String(admission.applied_at || admission.created_at)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  No recent admissions
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
          >
            <div className={`p-6 border-b border-[var(--border)] flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isRTL ? "flex-row-reverse arabic-text" : ""}`}>
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                {t("dashboard.upcomingSessions") || "Upcoming Sessions"}
              </h2>
              <button className="text-[var(--primary)] text-sm hover:underline flex items-center gap-1">
                {t("dashboard.viewCalendar") || "View Calendar"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 hover:bg-[var(--background-green)] transition-colors ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{session.student}</p>
                      <span className="text-[var(--primary)] text-sm font-semibold">{session.time}</span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{session.course}</p>
                      <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>with {session.teacher}</p>
                    </div>
                    <p className={`text-xs text-[var(--text-muted)] mt-1 ${isRTL ? "arabic-text" : ""}`}>{session.date}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  No upcoming sessions scheduled
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-card rounded-2xl p-6 border border-[var(--border)] shadow-sm"
        >
          <h2 className={`text-lg font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
            {t("dashboard.quickActions") || "Quick Actions"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { labelKey: "dashboard.addStudent", label: "Add Student", icon: Users, color: "#3B82F6", href: "/dashboard/admin/students/" },
              { labelKey: "dashboard.addTeacher", label: "Add Teacher", icon: GraduationCap, color: "#10B981", href: "/dashboard/admin/teachers/" },
              { labelKey: "dashboard.newCourse", label: "New Course", icon: BookOpen, color: "#F59E0B", href: "/dashboard/admin/courses/" },
              { labelKey: "dashboard.reviewPayments", label: "Review Payments", icon: CreditCard, color: "#8B5CF6", href: "/dashboard/admin/payments/" }
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group ${isRTL ? "arabic-text" : ""}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <span className={`text-sm font-medium ${isRTL ? "arabic-text" : ""}`}>{t(action.labelKey) || action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Alerts Section */}
        {(stats.pendingAdmissions > 10 || stats.pendingPayments > 5) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
          >
            <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div className={isRTL ? "text-right" : "text-left"}>
                <h3 className={`font-semibold text-yellow-800 mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("dashboard.attentionRequired") || "Attention Required"}
                </h3>
                <ul className="space-y-1">
                  {stats.pendingAdmissions > 10 && (
                    <li className={`text-sm text-yellow-700 ${isRTL ? "arabic-text" : ""}`}>
                      • {stats.pendingAdmissions} {t("dashboard.pendingAdmissionsAlert") || "admissions pending review"}
                    </li>
                  )}
                  {stats.pendingPayments > 5 && (
                    <li className={`text-sm text-yellow-700 ${isRTL ? "arabic-text" : ""}`}>
                      • {stats.pendingPayments} {t("dashboard.pendingPaymentsAlert") || "payments pending collection"}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
