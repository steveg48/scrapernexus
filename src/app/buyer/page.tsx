'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function BuyerDashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Hi, {user.email?.split('@')[0] || 'there'}!</h1>
        <Link 
          href="/post-project"
          className="bg-[#14A800] hover:bg-[#14A800]/90 text-white px-4 py-2 rounded-md inline-flex items-center space-x-2"
        >
          <span className="text-xl font-bold">+</span>
          <span>Post a job</span>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Buyer Dashboard</h2>
      <p className="text-gray-600 text-lg">
        Welcome to your buyer dashboard! Here you can manage your web scraping projects and find talented developers.
      </p>
    </div>
  )
}
