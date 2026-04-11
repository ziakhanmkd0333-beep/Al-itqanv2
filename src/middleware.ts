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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Check if accessing dashboard
  if (pathname.startsWith('/dashboard')) {
    // Get user from cookies
    const userCookie = request.cookies.get('user')?.value;
    
    console.log('[Middleware] Dashboard access:', pathname, 'Cookie exists:', !!userCookie);
    
    let user: { role?: string } | null = null;
    
    if (userCookie) {
      try {
        user = JSON.parse(decodeURIComponent(userCookie));
        console.log('[Middleware] User found:', user?.email, 'Role:', user?.role);
      } catch (e) {
        console.error('[Middleware] Invalid cookie:', e);
      }
    }

    // No user found - redirect to login without error param
    if (!user) {
      console.log('[Middleware] No user, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
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
