"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  ClipboardList,
  Users,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherSidebarProps {
  children: React.ReactNode;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/teacher" },
  { id: "profile", label: "My Profile", icon: User, href: "/dashboard/teacher/profile" },
  { id: "courses", label: "My Courses", icon: BookOpen, href: "/dashboard/teacher/courses" },
  { id: "materials", label: "Materials", icon: FileText, href: "/dashboard/teacher/materials" },
  { id: "assignments", label: "Assignments", icon: ClipboardList, href: "/dashboard/teacher/assignments" },
  { id: "students", label: "Students", icon: Users, href: "/dashboard/teacher/students" },
  { id: "announcements", label: "Announcements", icon: Bell, href: "/dashboard/teacher/announcements" },
];

export function TeacherSidebar({ children }: TeacherSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, hasRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirect if not authenticated or not teacher/admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (!hasRole(['teacher', 'admin'])) {
        router.push('/auth/login?error=access_denied');
        return;
      }
    }
  }, [isLoading, user, hasRole, router]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-[var(--border)] z-50 flex items-center justify-between px-4">
        <Link href="/dashboard/teacher" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)]">Teacher Panel</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-[var(--background-green)] rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full bg-card border-r border-[var(--border)] z-50 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-[var(--border)] ${isCollapsed ? "justify-center px-2" : "px-6"}`}>
          <Link href="/dashboard/teacher" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-[var(--text-primary)] whitespace-nowrap">Teacher Panel</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--background-green)] hover:text-[var(--text-primary)]"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
          {/* Collapse Button (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center gap-3 px-3 py-2 mb-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all w-full ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 pt-16 lg:pt-0 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
