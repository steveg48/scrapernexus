import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Only run middleware on protected routes
  if (req.nextUrl.pathname.startsWith('/buyer') || req.nextUrl.pathname.startsWith('/seller')) {
    try {
      const supabase = createMiddlewareClient({ req, res })
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
    } catch (error) {
      console.error('Middleware error:', error)
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/buyer/:path*',
    '/seller/:path*'
  ]
}
