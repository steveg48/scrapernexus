import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (!code) {
    console.error('No code provided')
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

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

    // Redirect to the next page
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error: any) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }
}