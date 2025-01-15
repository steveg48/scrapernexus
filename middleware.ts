import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Allow static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()

    // Check if route requires auth
    const requiresAuth = 
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/buyer')

    if (requiresAuth && !session) {
      // Store the original URL to redirect back after login
      const returnUrl = request.nextUrl.pathname + request.nextUrl.search
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', returnUrl)
      return NextResponse.redirect(loginUrl)
    }

    // Add user session to request headers for client components
    if (session) {
      response.headers.set('x-user-session', JSON.stringify(session))
    }

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    // On error, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/dashboard/:path*',
    '/buyer/:path*'
  ]
}