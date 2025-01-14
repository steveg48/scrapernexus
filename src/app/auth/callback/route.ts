import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      if (session) {
        // Get user's member type
        const { data: profile } = await supabase
          .from('profiles')
          .select('member_type')
          .eq('id', session.user.id)
          .single()

        if (profile?.member_type) {
          return NextResponse.redirect(new URL(`/${profile.member_type}/dashboard`, requestUrl.origin))
        } else {
          return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin))
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth?error=Unable to verify login', requestUrl.origin))
    }
  }

  // Fallback to complete profile if something goes wrong
  return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin))
}