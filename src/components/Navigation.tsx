'use client';

import { Search, Bell, HelpCircle, User, Users, FolderKanban, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const mockUser = {
  display_name: "John Doe",
  hasPendingOffers: true
}

const searchCategories = [
  { id: 'talent', name: 'Talent', description: 'Find freelancers and agencies', icon: Users },
  { id: 'projects', name: 'Projects', description: 'See projects from other pros', icon: FolderKanban },
  { id: 'jobs', name: 'Jobs', description: 'View jobs posted by clients', icon: Briefcase }
]

interface NavigationProps {
  user?: typeof mockUser
}

export default function Navigation({ user = mockUser }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('talent')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#039625] px-3 py-2 [&.active]:text-[#a9effc]">
                  <span>Hire talent</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Manage jobs and offers</h3>
                  </div>
                  <Link href="/buyer/job-posts" className="block px-4 py-2 hover:bg-gray-50">
                    Job posts and proposals
                  </Link>
                  <Link href="/pending-offers" className="block px-4 py-2 hover:bg-gray-50">
                    Pending offers
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Find freelancers</h3>
                  </div>
                  <button
                    onClick={() => router.push('/buyer/suggested')}
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Search for talent
                  </button>
                  <Link href="/saved-talent" className="block px-4 py-2 hover:bg-gray-50">
                    Talent you've hired
                  </Link>
                  <Link href="/saved-talent" className="block px-4 py-2 hover:bg-gray-50">
                    Talent you've saved
                  </Link>
                  <Link href="/any-hire" className="block px-4 py-2 hover:bg-gray-50">
                    Bring talent to ScrapeNexus
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#039625] px-3 py-2 [&.active]:text-[#a9effc]">
                  <span>Manage work</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Active and past work</h3>
                  </div>
                  <Link href="/contracts" className="block px-4 py-2 hover:bg-gray-50">
                    Your contracts
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2">
                    <h3 className="text-base font-semibold text-gray-900">Hourly contract activity</h3>
                  </div>
                  <Link href="/timesheets" className="block px-4 py-2 hover:bg-gray-50">
                    Timesheets
                  </Link>
                </div>
              </div>
              <Link 
                href="/messages"
                className="text-gray-700 hover:text-[#039625] px-3 py-2 [&.active]:text-[#a9effc] flex items-center"
              >
                Messages {user.hasPendingOffers && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>}
              </Link>
            </div>
          </div>

          {/* Right side - Search, Help, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search with category selector */}
            <div className="relative">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-[400px] pl-10 pr-24 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-0 h-full px-4 flex items-center space-x-1 text-gray-600 hover:text-gray-900 border-l border-gray-300"
                  >
                    <span className="text-sm capitalize">{selectedCategory}</span>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {searchCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 ${
                              selectedCategory === category.id ? 'bg-gray-50' : ''
                            }`}
                          >
                            <Icon className="h-5 w-5 text-gray-500" />
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                              <div className="text-xs text-gray-500">{category.description}</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Help */}
            <button className="text-gray-600 hover:text-gray-900">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                className="text-gray-600 hover:text-[#039625] relative"
              >
                <Bell className="h-5 w-5" />
                {user.hasPendingOffers && (
                  <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                      </div>
                    </div>
                    
                    {/* Notification Items */}
                    <div>
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">UP</span>
                          </div>
                          <div>
                            <p className="text-sm">Don't forget to post your saved job draft "U u7tg79 to8y8y 0978ty 8oy"</p>
                            <p className="text-xs text-gray-500 mt-1">2:47 PM</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">UP</span>
                          </div>
                          <div>
                            <p className="text-sm">Don't forget to post your saved job draft "Fit"</p>
                            <p className="text-xs text-gray-500 mt-1">2:47 PM</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">$</span>
                          </div>
                          <div>
                            <p className="text-sm">A payment of $459.03 has been applied to your financial account.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* See all notifications link */}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link href="/notifications" className="text-[#039625] hover:underline text-sm block">
                        See all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <button className="h-8 w-8 rounded-full border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors duration-200">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
