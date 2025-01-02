'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Dashboard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // Mock user data
  const mockUser = {
    display_name: "John Doe",
    avatar_url: "/images/default-avatar.png",
    hasPendingOffers: true // Mock state for pending offers
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between h-16 px-4">
            {/* Left side - Logo and Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                ScrapeNexus
              </Link>
              
              {/* Main Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Hire Talent Dropdown */}
                <div className="dropdown">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                    <span>Hire talent</span>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="dropdown-content">
                    {mockUser.hasPendingOffers && (
                      <Link href="/pending-offers" className="dropdown-item">
                        Pending offers
                      </Link>
                    )}
                    <Link href="/job-posts" className="dropdown-item">
                      Job posts
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link href="/post-job" className="dropdown-item">
                      Post a job
                    </Link>
                    <Link href="/search-talent" className="dropdown-item">
                      Search for talent
                    </Link>
                    <Link href="/hired-talent" className="dropdown-item">
                      Talent you've hired
                    </Link>
                    <Link href="/saved-talent" className="dropdown-item">
                      Talent you've saved
                    </Link>
                    <Link href="/invite-talent" className="dropdown-item">
                      Invite new talent
                    </Link>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                    <span>Manage work</span>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <Link href="/messages" className="flex items-center text-gray-700 hover:text-gray-900">
                  <span>Messages</span>
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">1</span>
                </Link>
              </div>
            </div>

            {/* Right side - Search and Profile */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="dropdown">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Search Dropdown */}
                <div className="dropdown-content">
                  <Link href="/search/talent" className="dropdown-item">
                    Search Talent
                  </Link>
                  <Link href="/search/jobs" className="dropdown-item">
                    Search Jobs
                  </Link>
                  <Link href="/search/projects" className="dropdown-item">
                    Search Projects
                  </Link>
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Hi, {mockUser.display_name}!</span>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={mockUser.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p>Welcome to your dashboard! This is a temporary view without authentication.</p>
      </main>
    </div>
  )
}