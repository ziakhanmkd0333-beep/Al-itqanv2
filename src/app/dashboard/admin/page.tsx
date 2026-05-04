"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatsSkeleton } from "@/components/admin/LoadingSkeleton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  Mail,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAdminDashboard } from "@/hooks/use-realtime-data";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminLayout>
        <AdminDashboardContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function AdminDashboardContent() {
  const { t } = useTranslation();
  const { stats, recentAdmissions, upcomingSessions, loading, refetch } = useAdminDashboard();
  const [isConnected, setIsConnected] = useState(true);

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

  return (
    <>
      <PageHeader
        title={t("dashboard.adminTitle") || "Admin Dashboard"}
        description={t("dashboard.welcomeBack") || "Welcome back! Here's what's happening today."}
        breadcrumbs={[]}
        action={
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isConnected ? 'Live' : 'Offline'}</span>
            </div>
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/dashboard/admin/admissions/"
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Review Admissions
              {(stats?.pendingAdmissions || 0) > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {stats?.pendingAdmissions}
                </span>
              )}
            </Link>
          </div>
        }
      />

      {loading ? (
        <StatsSkeleton count={4} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title={t("dashboard.totalStudents") || "Total Students"} value={(stats?.totalStudents || 0).toLocaleString()} icon={Users} color="#3B82F6" />
            <StatsCard title={t("dashboard.activeTeachers") || "Active Teachers"} value={String(stats?.totalTeachers || 0)} icon={GraduationCap} color="#10B981" />
            <StatsCard title={t("dashboard.courses") || "Courses"} value={String(stats?.activeCourses || 0)} icon={BookOpen} color="#F59E0B" />
            <StatsCard title={t("dashboard.monthlyRevenue") || "Monthly Revenue"} value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="#8B5CF6" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title={t("dashboard.pendingAdmissions") || "Pending Admissions"} value={stats?.pendingAdmissions || 0} icon={ClipboardList} color="#F59E0B" />
            <StatsCard title={t("dashboard.pendingPayments") || "Pending Payments"} value={stats?.pendingPayments || 0} icon={CreditCard} color="#EF4444" />
            <StatsCard title={t("dashboard.totalEnrollments") || "Total Enrollments"} value={stats?.totalEnrollments || 0} icon={TrendingUp} color="#10B981" />
            <StatsCard title={t("dashboard.activeStudents") || "Active Students"} value={stats?.activeStudents || 0} icon={Users} color="#3B82F6" />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AdminCard
          title="Recent Admissions"
          action={
            <Link href="/dashboard/admin/approvals/" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          {recentAdmissions && recentAdmissions.length > 0 ? (
            <div className="space-y-3">
              {recentAdmissions.slice(0, 5).map((admission: Record<string, unknown>, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{String(admission.full_name || 'Unknown')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{String(admission.email || '')}</p>
                    </div>
                  </div>
                  <StatusBadge status={String(admission.status || 'pending')} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent admissions</p>
          )}
        </AdminCard>

        <AdminCard
          title="Upcoming Sessions"
          action={
            <Link href="/dashboard/admin/live-classes/" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session: Record<string, unknown>, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {String((session.courses as Record<string, string>)?.title || session.course_id || 'Session')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {String(session.scheduled_date || '')} at {String(session.scheduled_time || '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No upcoming sessions</p>
          )}
        </AdminCard>

        <AdminCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Students", href: "/dashboard/admin/students/", icon: Users, color: "#3B82F6" },
              { label: "Teachers", href: "/dashboard/admin/teachers/", icon: GraduationCap, color: "#10B981" },
              { label: "Courses", href: "/dashboard/admin/courses/", icon: BookOpen, color: "#F59E0B" },
              { label: "Payments", href: "/dashboard/admin/payments/", icon: CreditCard, color: "#8B5CF6" },
              { label: "Approvals", href: "/dashboard/admin/approvals/", icon: ClipboardList, color: "#EF4444" },
              { label: "Settings", href: "/dashboard/admin/settings/", icon: Mail, color: "#6B7280" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${link.color}15` }}>
                  <link.icon className="w-4 h-4" style={{ color: link.color }} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.label}</span>
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  );
}