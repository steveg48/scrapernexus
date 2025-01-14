import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log(' Starting middleware for path:', req.nextUrl.pathname)
  const res = NextResponse.next()

  // Skip middleware for auth-related routes and debug routes
  if (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname.startsWith('/api/debug')) {
    console.log(' Skipping middleware for:', req.nextUrl.pathname)
    return res
  }

  // Only run middleware on protected routes
  if (req.nextUrl.pathname.startsWith('/buyer') || 
      req.nextUrl.pathname.startsWith('/seller') || 
      req.nextUrl.pathname === '/dashboard') {
    try {
      console.log(' Processing protected route:', req.nextUrl.pathname)
      
      const supabase = createMiddlewareClient({ req, res })
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log(' Session data:', { userId: session?.user?.id })
      
      if (sessionError || !session) {
        console.log(' Auth error:', sessionError)
        // Redirect to login page
        const redirectUrl = new URL('/auth', req.url)
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if profile exists and member type matches route
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('member_type')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        console.log(' Profile error:', profileError)
        // Redirect to profile creation
        return NextResponse.redirect(new URL('/auth/complete-profile', req.url))
      }

      // Check if user is accessing the correct dashboard type
      const isBuyerRoute = req.nextUrl.pathname.startsWith('/buyer')
      const isSellerRoute = req.nextUrl.pathname.startsWith('/seller')
      
      if ((isBuyerRoute && profile.member_type !== 'buyer') || 
          (isSellerRoute && profile.member_type !== 'seller')) {
        console.log(' Invalid member type for route:', { 
          memberType: profile.member_type, 
          route: req.nextUrl.pathname 
        })
        // Redirect to appropriate dashboard
        const correctPath = profile.member_type === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard'
        return NextResponse.redirect(new URL(correctPath, req.url))
      }
      
      return res
    } catch (error) {
      console.error(' Middleware error:', error)
      // Redirect to login on any error
      const redirectUrl = new URL('/auth', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard',
    '/buyer/:path*',
    '/seller/:path*',
    '/api/jobs',
    '/api/projects',
    '/api/profiles'
  ]
}
