'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Nav Links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/buyer/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ScrapeNexus</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/buyer/post-job" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                Post a job
              </Link>
              <Link href="/buyer/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
