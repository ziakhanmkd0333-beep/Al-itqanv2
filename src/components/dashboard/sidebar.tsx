"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Award,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  UserCheck,
  User,
  Bell,
  Video,
  PlayCircle
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/contexts/AuthContext";

const adminNavItems = [
  { href: "/dashboard/admin/", labelKey: "sidebar.dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/registrations/", labelKey: "sidebar.registrations", label: "Registrations", icon: FileText },
  { href: "/dashboard/admin/approvals/", labelKey: "sidebar.approvals", label: "Approvals", icon: UserCheck },
  { href: "/dashboard/admin/students/", labelKey: "sidebar.students", label: "Students", icon: Users },
  { href: "/dashboard/admin/teachers/", labelKey: "sidebar.teachers", label: "Teachers", icon: GraduationCap },
  { href: "/dashboard/admin/courses/", labelKey: "sidebar.courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/admin/assignments/", labelKey: "sidebar.assignments", label: "Assignments", icon: Award },
  { href: "/dashboard/admin/live-classes/", labelKey: "sidebar.liveClasses", label: "Live Classes", icon: Video },
  { href: "/dashboard/admin/recorded-lessons/", labelKey: "sidebar.recordedLessons", label: "Recorded Lessons", icon: PlayCircle },
  { href: "/dashboard/admin/admissions/", labelKey: "sidebar.admissions", label: "Admissions", icon: ClipboardList },
  { href: "/dashboard/admin/payments/", labelKey: "sidebar.payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/admin/settings/", labelKey: "sidebar.settings", label: "Settings", icon: Settings }
];

const studentNavItems = [
  { href: "/dashboard/student/", labelKey: "sidebar.dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/student/profile/", labelKey: "sidebar.profile", label: "My Profile", icon: User },
  { href: "/dashboard/student/courses/", labelKey: "sidebar.myCourses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/student/live-classes/", labelKey: "sidebar.liveClasses", label: "Live Classes", icon: Video },
  { href: "/dashboard/student/recorded-lessons/", labelKey: "sidebar.recordedLessons", label: "Recorded Lessons", icon: PlayCircle },
  { href: "/dashboard/student/assignments/", labelKey: "sidebar.assignments", label: "Assignments", icon: ClipboardList },
  { href: "/dashboard/student/materials/", labelKey: "sidebar.materials", label: "Materials", icon: FileText },
  { href: "/dashboard/student/progress/", labelKey: "sidebar.progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/student/attendance/", labelKey: "sidebar.attendance", label: "Attendance", icon: Clock },
  { href: "/dashboard/student/certificates/", labelKey: "sidebar.certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/student/schedule/", labelKey: "sidebar.schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/student/notifications/", labelKey: "sidebar.notifications", label: "Notifications", icon: Bell }
];

const teacherNavItems = [
  { href: "/dashboard/teacher/", labelKey: "sidebar.dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/teacher/students/", labelKey: "sidebar.myStudents", label: "My Students", icon: Users },
  { href: "/dashboard/teacher/attendance/", labelKey: "sidebar.attendance", label: "Attendance", icon: Clock },
  { href: "/dashboard/teacher/schedule/", labelKey: "sidebar.schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/teacher/materials/", labelKey: "sidebar.materials", label: "Materials", icon: FileText },
  { href: "/dashboard/teacher/notes/", labelKey: "sidebar.sessionNotes", label: "Session Notes", icon: ClipboardList }
];

export function DashboardSidebar({ userType }: { userType: "admin" | "student" | "teacher" }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useTranslation();
  const { logout } = useAuth();

  const navItems = userType === "admin" ? adminNavItems : userType === "student" ? studentNavItems : teacherNavItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/auth/login';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 z-50 p-2 bg-[var(--primary)] text-white rounded-lg ${isRTL ? "right-4" : "left-4"}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isRTL ? 100 : -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 h-full w-64 bg-[var(--primary-dark)] text-white z-40 flex flex-col ${
          isRTL ? "right-0" : "left-0"
        } ${
          isMobileMenuOpen ? "translate-x-0" : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Al-Itqan Institute"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="font-brand font-bold text-sm">Al-Itqan Institute</h1>
              <p className="text-white/60 text-xs capitalize">{userType} {t("sidebar.panel") || "Panel"}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href.slice(0, -1));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                  isActive
                    ? "bg-[#C9A84C] text-[var(--primary-dark)] font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className={isRTL ? "arabic-text" : ""}>{t(item.labelKey) || item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all w-full ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LogOut className="w-5 h-5" />
            <span className={isRTL ? "arabic-text" : ""}>{t("sidebar.logout") || "Logout"}</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
