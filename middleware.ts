// Temporarily disable host-enforcing middleware to avoid redirect loops.
// The previous implementation redirected www -> non-www unconditionally which
// can conflict with hosting/CDN-level redirects (causing ERR_TOO_MANY_REDIRECTS).
//
// If you prefer an automatic redirect, re-enable it deliberately (for example,
// set ENABLE_WWW_REDIRECT=1 in your Vercel environment and deploy) or configure
// the redirect at the Vercel dashboard (recommended).

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // No-op middleware: allow all requests through to avoid redirect loops.
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
