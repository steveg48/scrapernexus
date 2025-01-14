'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import JobsList from './JobsList'

interface UserProfile {
  id: string
  display_name: string
  member_type: string
}

interface Job {
  id: string
  title: string
  created_at: string
  status: string
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        // Create the Supabase client with proper auth context
        const supabase = createClientComponentClient()

        // Get the current user and handle auth state
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        if (!user) {
          throw new Error('Not authenticated')
        }

        // Get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profile)

        // Fetch jobs with auth header
        const response = await fetch('/api/jobs', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to fetch jobs')
        }
        
        const data = await response.json()
        setJobs(data.jobs || [])

      } catch (error: any) {
        console.error('Error fetching data:', error)
        setError(error.message)
      }
    }

    fetchData()
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
            Hi, {profile.display_name.split(' ')[0]}
          </h1>
          <Link 
            href="/buyer/post-job"
            className="inline-flex items-center px-6 py-2.5 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-base font-medium"
          >
            + Post a job
          </Link>
        </div>

        {jobs.length > 0 && (
          <>
            <h2 className="text-[32px] font-normal text-gray-900 mt-8 mb-6">Overview</h2>
            <JobsList jobs={jobs} />
          </>
        )}
      </div>
    </div>
  )
}