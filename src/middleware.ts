import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return req.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              res.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              res.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log(' User data:', { email: user?.email, id: user?.id })
      
      if (userError || !user) {
        console.log(' Auth error:', userError)
        return NextResponse.redirect(new URL('/auth', req.url))
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log(' Profile data:', profile)
      console.log('Profile error:', profileError)

      if (profileError || !profile) {
        console.log(' Profile error:', profileError)
        return NextResponse.redirect(new URL('/auth', req.url))
      }

      console.log(' Current state:', {
        path: req.nextUrl.pathname,
        memberType: profile.member_type,
        userId: profile.id,
      })

      // Handle root dashboard route - redirect based on user type
      if (req.nextUrl.pathname === '/dashboard') {
        const targetPath = profile.member_type === 'seller' 
          ? '/seller/dashboard' 
          : '/buyer/dashboard'
        
        console.log(`Redirecting from /dashboard to ${targetPath} for ${profile.member_type}`)
        return NextResponse.redirect(new URL(targetPath, req.url))
      }

      // Prevent sellers from accessing buyer routes
      if (profile.member_type === 'seller' && req.nextUrl.pathname.startsWith('/buyer')) {
        console.log('Seller accessing buyer route - redirecting to seller dashboard')
        return NextResponse.redirect(new URL('/seller/dashboard', req.url))
      }

      // Prevent buyers from accessing seller routes
      if (profile.member_type === 'buyer' && req.nextUrl.pathname.startsWith('/seller')) {
        console.log('Buyer accessing seller route - redirecting to buyer dashboard')
        return NextResponse.redirect(new URL('/buyer/dashboard', req.url))
      }

      console.log('Access granted to:', req.nextUrl.pathname)

    } catch (e) {
      console.error('Middleware error:', e)
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard',
    '/buyer/:path*',
    '/seller/:path*',
  ]
}
