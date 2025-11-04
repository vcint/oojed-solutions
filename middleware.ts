import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple middleware to enforce a canonical host (non-www).
 * Redirects requests from www.oojed.com -> oojed.com with a 301.
 * This helps prevent duplicate-host indexing issues.
 */
export function middleware(req: NextRequest) {
  try {
    const host = req.headers.get('host') || '';
    if (host.startsWith('www.')) {
      const url = req.nextUrl.clone();
      url.hostname = host.replace(/^www\./i, '');
      return NextResponse.redirect(url, 301);
    }
  } catch (e) {
    // fail open — don't block requests on middleware errors
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
