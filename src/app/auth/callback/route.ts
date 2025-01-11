import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    console.error('No code provided')
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options })
        },
      }
    }
  )

  try {
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin))
    }

    if (!data.session) {
      console.error('No session in response')
      return NextResponse.redirect(new URL('/?error=No+session+created', requestUrl.origin))
    }

    // Get the user's member type from their metadata
    const memberType = data.session.user.user_metadata.member_type

    // Redirect based on member type
    const redirectPath = memberType === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard'
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))

  } catch (error: any) {
    console.error('Auth error:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }
}