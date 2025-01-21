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
