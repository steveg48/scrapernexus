'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { createBrowserClient } from '@supabase/ssr'
import JobsList from './JobsList'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  user_type: string
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profile)
      } catch (error: any) {
        console.error('Error fetching profile:', error)
        setError(error.message)
      }
    }

    fetchProfile()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-[32px] font-normal text-gray-900">
            Hi, {profile.first_name}
          </h1>
          <Link 
            href="/buyer/post-job/title"
            className="inline-flex items-center px-6 py-2.5 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-base font-medium"
          >
            <span className="mr-1">+</span> Post a job
          </Link>
        </div>

        <h2 className="text-[32px] font-normal text-gray-900 mt-8 mb-6">Overview</h2>
        
        <JobsList />
      </div>
    </div>
  )
}