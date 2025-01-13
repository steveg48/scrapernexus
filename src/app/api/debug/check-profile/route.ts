import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string) {
            cookieStore.set(name, value)
          },
          remove(name: string) {
            cookieStore.delete(name)
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    // Get raw user metadata
    const { data: rawUser } = await supabase.auth.admin.getUserById(user?.id!)

    return NextResponse.json({
      user,
      profile,
      rawUser,
      message: 'Debug info retrieved successfully'
    })
  } catch (error) {
    console.error('Debug route error:', error)
    return NextResponse.json({ error: 'Failed to get debug info' }, { status: 500 })
  }
}
