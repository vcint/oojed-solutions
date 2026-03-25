import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Protected admin routes (except login and register)
  const protectedRoutes = [
    '/admin/dashboard',
    '/admin/create-blog',
    '/admin/edit-blog',
  ];

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for valid session cookie
    const sessionCookie = req.cookies.get('author_session')?.value;

    if (!sessionCookie) {
      // Redirect to login if no session
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify session is valid (not expired)
      const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
      if (!decoded.authorId) {
        // Invalid session, redirect to login
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    } catch {
      // Invalid session format, redirect to login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Redirect /admin/login to dashboard if already logged in
  if (pathname === '/admin/login' || pathname === '/admin/register') {
    const sessionCookie = req.cookies.get('author_session')?.value;
    if (sessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
        if (decoded.authorId) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      } catch {
        // Continue to login page if session invalid
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
