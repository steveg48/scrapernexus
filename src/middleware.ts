import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();
  
  // Allow access to API endpoints for now during development
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return res;
  }

  // If there's no session and the request is for a protected route
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && (
    req.nextUrl.pathname.startsWith('/buyer') ||
    req.nextUrl.pathname.startsWith('/seller')
  )) {
    const redirectUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/buyer/:path*',
    '/seller/:path*',
    '/auth/:path*',
    '/api/:path*'
  ]
}
