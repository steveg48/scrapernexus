'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import JobsList from './JobsList'

interface UserData {
  id: string
  email: string
  firstName: string
  fullName: string
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data')
        }
        
        setUserData(data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user data')
      }
    }

    fetchUserData()
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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-[32px] font-normal text-gray-900">
            Hi, {userData?.firstName || 'there'}
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