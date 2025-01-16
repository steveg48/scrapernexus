'use client'

import Link from 'next/link'
import { Bell, MessageSquare } from 'lucide-react'

export default function TopNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-[#59baea]">
                ScrapeNexus
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                href="/buyer/dashboard"
                className="border-b-2 border-[#59baea] text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Hire talent
              </Link>
              <Link
                href="/reports"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Reports
              </Link>
              <Link
                href="/messages"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Messages
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <MessageSquare className="h-6 w-6" />
            </button>
            <button className="ml-4 p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <button className="flex items-center max-w-xs bg-white text-sm focus:outline-none">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="User profile"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
