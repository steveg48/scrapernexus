import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If accessing auth pages while logged in, redirect to appropriate dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('member_type')
      .eq('id', session.user.id)
      .single()

    if (profile?.member_type) {
      return NextResponse.redirect(new URL(`/${profile.member_type}/dashboard`, req.url))
    } else {
      return NextResponse.redirect(new URL('/auth/complete-profile', req.url))
    }
  }

  // If accessing protected routes without auth, redirect to login
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/buyer') ||
    req.nextUrl.pathname.startsWith('/seller')
  )) {
    const returnTo = req.nextUrl.pathname
    return NextResponse.redirect(new URL(`/auth?returnTo=${encodeURIComponent(returnTo)}`, req.url))
  }

  // If accessing wrong member type dashboard, redirect to correct one
  if (session && (req.nextUrl.pathname.startsWith('/buyer') || req.nextUrl.pathname.startsWith('/seller'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('member_type')
      .eq('id', session.user.id)
      .single()

    if (profile?.member_type && !req.nextUrl.pathname.startsWith(`/${profile.member_type}`)) {
      return NextResponse.redirect(new URL(`/${profile.member_type}/dashboard`, req.url))
    }
  }

  return res
}

// Specify which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/buyer/:path*',
    '/seller/:path*',
    '/auth/:path*'
  ]
}
