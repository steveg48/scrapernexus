'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Profile {
  id: string
  user_id: string
  full_name: string
  display_name: string
  member_type: string
  role: string
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          console.log('No session found, redirecting to home')
          router.push('/')
          return
        }

        // Then get the user details
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('User error:', userError)
          throw userError
        }

        if (!user) {
          console.log('No user found, redirecting to home')
          router.push('/')
          return
        }

        setUser(user)

        // Get or create profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError)
          throw profileError
        }
        
        if (!profile) {
          console.log('Creating new profile for user:', user.id)
          const newProfileData = {
            user_id: user.id,
            full_name: user.user_metadata?.full_name || '',
            display_name: user.user_metadata?.display_name || '',
            member_type: user.user_metadata?.member_type || 'buyer',
            role: 'user'
          }

          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfileData])
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
            throw insertError
          }
          
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (newProfileError) {
            console.error('Error fetching new profile:', newProfileError)
            throw newProfileError
          }
          setProfile(newProfile)
        } else {
          setProfile(profile)
        }
      } catch (err: any) {
        console.error('Dashboard error:', err)
        setError(err.message)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">ScraperNexus</span>
            </div>
            <div className="flex items-center">
              {profile && (
                <span className="mr-4">Welcome, {profile.display_name || profile.full_name}</span>
              )}
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Add your dashboard content here */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Dashboard content goes here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}