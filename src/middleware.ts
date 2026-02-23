import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/admin', '/complete-profile'];
const publicRoutes = ['/login', '/', '/subscribe'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = request.cookies.get('session')?.value;
  let session = null;
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      // Invalid session
    }
  }

  // 1. If trying to access protected route without session -> login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 2. If logged in:
  if (session) {
    // Check for first login
    if (session.user.isFirstLogin && path !== '/complete-profile' && !path.startsWith('/api')) {
       return NextResponse.redirect(new URL('/complete-profile', request.nextUrl));
    }

    // If completed profile but trying to access complete-profile -> dashboard
    if (!session.user.isFirstLogin && path === '/complete-profile') {
      return NextResponse.redirect(new URL('/dashboard/panel', request.nextUrl));
    }

    // Admin routes protection
    if (path.startsWith('/admin') && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/panel', request.nextUrl));
    }

    // Prevent login page access if already logged in
    if (path === '/login') {
      if (session.user.role === 'STAFF') {
        return NextResponse.redirect(new URL('/dashboard/tasks', request.nextUrl));
      }
      return NextResponse.redirect(new URL('/dashboard/panel', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
