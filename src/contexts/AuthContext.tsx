"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  const checkAuth = useCallback(async () => {
    try {
      // Check localStorage first (remember me) - with SSR check
      const storedUser = typeof window !== 'undefined' 
        ? localStorage.getItem('user') || sessionStorage.getItem('user')
        : null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function - memoized with useCallback
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store user data
      const userData = JSON.stringify(data.user);
      if (rememberMe) {
        localStorage.setItem('user', userData);
        // Set cookie for middleware (expires in 30 days if remember me)
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `user=${encodeURIComponent(userData)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      } else {
        sessionStorage.setItem('user', userData);
        // Set session cookie for middleware
        document.cookie = `user=${encodeURIComponent(userData)}; path=/; SameSite=Lax`;
      }

      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    // Remove cookie
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  // Check if user has required role
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protecting components
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function ProtectedComponent(props: P) {
    const { user, isLoading, isAuthenticated, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/auth/login');
          return;
        }

        if (allowedRoles && !hasRole(allowedRoles)) {
          // Redirect to appropriate dashboard based on role
          if (user?.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (user?.role === 'teacher') {
            router.push('/dashboard/teacher');
          } else {
            router.push('/dashboard/student');
          }
        }
      }
    }, [isLoading, isAuthenticated, hasRole, router, user]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-muted)]">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Role-based redirect helper
export function getDashboardPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'teacher':
      return '/dashboard/teacher';
    case 'student':
      return '/dashboard/student';
    default:
      return '/auth/login';
  }
}
