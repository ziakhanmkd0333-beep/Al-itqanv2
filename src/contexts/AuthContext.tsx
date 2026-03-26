"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount - sync with Supabase Auth session
  const checkAuth = useCallback(async () => {
    try {
      // Get session from Supabase Auth
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      
      if (session?.user) {
        // Get user data from our users table
        const { data: userData, error } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!error && userData) {
          const { password_hash, ...safeUser } = userData;
          setUser(safeUser as User);
        } else {
          setUser(null);
        }
      } else {
        // Fallback: check localStorage for custom auth
        const storedUser = typeof window !== 'undefined' 
          ? localStorage.getItem('user') || sessionStorage.getItem('user')
          : null;
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Subscribe to Supabase Auth state changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user data from users table
        supabaseBrowser.from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              const { password_hash, ...safeUser } = data;
              setUser(safeUser as User);
              localStorage.setItem('user', JSON.stringify(safeUser));
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // First try Supabase Auth sign in
      const { data: authData, error: authError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData.user) {
        // Get user data from our users table
        const { data: userData, error: userError } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (!userError && userData) {
          const { password_hash, ...safeUser } = userData;
          
          // Store in localStorage for compatibility
          const userJson = JSON.stringify(safeUser);
          if (rememberMe) {
            localStorage.setItem('user', userJson);
          } else {
            sessionStorage.setItem('user', userJson);
          }
          
          setUser(safeUser as User);
          return { success: true, user: safeUser as User };
        }
      }

      // Fallback: try custom API login
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
      const userDataStr = JSON.stringify(data.user);
      if (rememberMe) {
        localStorage.setItem('user', userDataStr);
      } else {
        sessionStorage.setItem('user', userDataStr);
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Sign out from Supabase Auth
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }
    } catch (supabaseError) {
      console.error('Supabase signOut exception:', supabaseError);
    }
    
    // Always clear local state regardless of Supabase result
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    
    setUser(null);
    
    // Use window.location for a full page reset
    window.location.href = '/auth/login';
  }, []);

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
