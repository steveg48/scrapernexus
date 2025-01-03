'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User as UserIcon, Bell, Search, Plus } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function BuyerDashboard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hasNotifications] = useState(true) // Mock notification state
  
  // Mock user data
  const mockUser = {
    display_name: "John Doe",
    avatar_url: null,
    hasPendingOffers: true
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* User Greeting Bar with Post Job Button - Aligned with content */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-3">
            <div style={{ marginLeft: '132px' }}>
              <span className="text-gray-700">Hi, {mockUser.display_name}!</span>
            </div>
            <div className="flex items-center" style={{ paddingRight: '144px' }}> 
              <Link 
                href="/buyer/post-job"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Post a job</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Aligned with greeting */}
      <main className="max-w-7xl mx-auto">
        <div className="py-8">
          <div style={{ marginLeft: '132px' }}>
            <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>
            <p>Welcome to your buyer dashboard! Here you can manage your web scraping projects and find talented developers.</p>
          </div>
        </div>
      </main>
    </div>
  )
}