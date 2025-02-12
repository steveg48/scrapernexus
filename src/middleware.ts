import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes and static files
  if (
    pathname === '/' || 
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req: request, res })
    await supabase.auth.getSession()

    // Refresh session if exists
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      if (!session) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
      // Add user info to request headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', session.user.id)
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      // Set cookie
      response.cookies.set('sb-access-token', session.access_token)
      response.cookies.set('sb-refresh-token', session.refresh_token)

      return response
    }

    // Check auth for protected routes
    if (!session && (
      pathname.startsWith('/seller/') ||
      pathname.startsWith('/buyer/')
    )) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Set cookie for all responses
    const finalResponse = NextResponse.next()
    if (session) {
      finalResponse.cookies.set('sb-access-token', session.access_token)
      finalResponse.cookies.set('sb-refresh-token', session.refresh_token)
    }

    return finalResponse
  } catch (e) {
    console.error('Middleware error:', e)
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
