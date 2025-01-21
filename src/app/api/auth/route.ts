import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()

    // Create a Supabase client for the route handler
    const supabase = createRouteHandlerClient({ cookies })

    if (action === 'signIn') {
      // First, sign out any existing session
      await supabase.auth.signOut()

      // Now attempt the new sign in
      const { data: { user, session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      if (!user) throw new Error('No user returned after sign in')

      // Get user's member type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('member_type')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      if (!profile) throw new Error('No profile found')

      return NextResponse.json({
        user,
        session,
        memberType: profile.member_type
      })
    }

    if (action === 'signUp') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      return NextResponse.json({
        message: 'Check your email for the confirmation link'
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    console.error('Auth API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
