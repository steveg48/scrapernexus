'use client'

import Link from 'next/link'

export default function LandingNav() {
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Nav Links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ScrapeNexus</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link 
                href="/post-project"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Post a Project
              </Link>
              <Link 
                href="/find-work"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Find Work
              </Link>
              <Link 
                href="#how-it-works"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth" 
              className="text-gray-700 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/auth?signup=true"
              className="bg-[#14A800] hover:bg-[#14A800]/90 text-white px-4 py-2 rounded-full"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
