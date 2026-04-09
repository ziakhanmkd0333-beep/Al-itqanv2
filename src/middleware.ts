import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/admission',
  '/about',
  '/contact',
  '/courses',
  '/admin-login',
];

// Role-based path access
const rolePaths: Record<string, string[]> = {
  admin: ['/dashboard/admin'],
  teacher: ['/dashboard/teacher'],
  student: ['/dashboard/student'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    // For course pages, allow access
    if (pathname.startsWith('/courses/')) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // Check if accessing dashboard
  if (pathname.startsWith('/dashboard')) {
    // Get user from cookies
    const userCookie = request.cookies.get('user')?.value;
    
    let user = null;
    
    if (userCookie) {
      try {
        user = JSON.parse(decodeURIComponent(userCookie));
      } catch (_e) {
        // Invalid cookie
      }
    }

    // No user found - redirect to login
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const userRole = user.role;
    
    // Admin can access all dashboards
    if (userRole === 'admin') {
      return NextResponse.next();
    }

    // Check if user is accessing their own dashboard
    const allowedPaths = rolePaths[userRole] || [];
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

    if (!isAllowed) {
      // Redirect to appropriate dashboard
      const dashboardPath = userRole === 'teacher' 
        ? '/dashboard/teacher' 
        : userRole === 'student'
          ? '/dashboard/student'
          : '/auth/login';
      
      const redirectUrl = new URL(dashboardPath, request.url);
      redirectUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // For API routes, check authentication
  if (pathname.startsWith('/api/')) {
    // Allow public API routes
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/admissions', '/api/courses', '/api/seed', '/api/register'];
    if (publicApiRoutes.some(route => pathname === route || pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Check for authorization
    const userCookie = request.cookies.get('user')?.value;
    
    if (!userCookie && pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
