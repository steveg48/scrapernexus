'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, MessageSquare, Search, HelpCircle, ChevronDown } from 'lucide-react'

export default function TopNavigation() {
  const [isManageWorkOpen, setIsManageWorkOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHireTalentOpen, setIsHireTalentOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#59baea]">ScrapeNexus</span>
                <span className="ml-1 text-pink-500">♡</span>
              </Link>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center border-b-2 border-[#59baea]"
                  onClick={() => setIsHireTalentOpen(!isHireTalentOpen)}
                >
                  Hire talent
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isHireTalentOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link
                        href="/buyer/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/buyer/post-job"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Post a Job
                      </Link>
                      <Link
                        href="/buyer/talent"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Find Talent
                      </Link>
                      <Link
                        href="/buyer/saved"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Saved Talent
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium inline-flex items-center"
                  onClick={() => setIsManageWorkOpen(!isManageWorkOpen)}
                >
                  Manage work
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isManageWorkOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link
                        href="/buyer/jobs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Jobs
                      </Link>
                      <Link
                        href="/buyer/contracts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Contracts
                      </Link>
                      <Link
                        href="/buyer/payments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Payments
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium inline-flex items-center"
                  onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                >
                  Messages
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    1
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isMessagesOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Recent Messages</h3>
                      </div>
                      <Link
                        href="/messages/1"
                        className="block px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                              alt="User"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">John Doe</p>
                            <p className="text-sm text-gray-500 truncate">Hey, I'm interested in your project...</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 text-sm focus:outline-none focus:ring-1 focus:ring-[#59baea]"
              />
            </div>
            <Link href="/help" className="text-gray-400 hover:text-gray-600">
              <HelpCircle className="h-6 w-6" />
            </Link>
            <Link href="/notifications" className="relative text-gray-400 hover:text-gray-600">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </Link>
            <div className="relative">
              <button
                className="flex items-center"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="User profile"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          // Handle logout
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
