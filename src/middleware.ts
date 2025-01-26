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
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return res
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
