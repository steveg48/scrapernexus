import { createServerClient } from '@supabase/ssr'
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

    // Redirect to the next page
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error: any) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }
}