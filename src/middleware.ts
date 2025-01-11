import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Only run middleware on protected routes
  if (req.nextUrl.pathname.startsWith('/buyer') || req.nextUrl.pathname.startsWith('/seller')) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return req.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              req.cookies.set({
                name,
                value,
                ...options,
              })
              res.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              req.cookies.set({
                name,
                value: '',
                ...options,
              })
              res.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

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
