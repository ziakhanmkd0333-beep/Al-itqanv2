"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}&error=unauthorized`;
        router.push(loginUrl);
        return;
      }

      if (allowedRoles && !hasRole(allowedRoles)) {
        // Wrong role - redirect to appropriate dashboard or show error
        const userRole = user?.role;
        
        // If trying to access admin panel but not admin
        if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
          router.push(`/auth/login?error=access_denied&message=${encodeURIComponent('Admin access required')}`);
          return;
        }
        
        // Redirect to correct dashboard
        if (userRole === 'teacher') {
          router.push('/dashboard/teacher?error=access_denied');
        } else if (userRole === 'student') {
          router.push('/dashboard/student?error=access_denied');
        } else {
          logout();
        }
        return;
      }

      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, hasRole, allowedRoles, user, router, pathname, logout]);

  // Loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Access Denied</h1>
          <p className="text-[var(--text-muted)] mb-6">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Admin-only route wrapper
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

// Teacher-only route wrapper
export function TeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

// Student-only route wrapper
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

// Authenticated-only route (any role)
export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
