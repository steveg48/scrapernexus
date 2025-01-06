'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PostJobTitle() {
  const [title, setTitle] = useState('')
  const router = useRouter()
  const mockUser = {
    display_name: "John Doe",
    avatar_url: "/avatar-placeholder.png",
    hasPendingOffers: true
  }

  const exampleTitles = [
    "Scrape Product Data from E-commerce Websites with Price and Availability Tracking",
    "Develop a Web Scraping Script for Social Media Analytics (Python Preferred)",
    "Extract Real Estate Listings Data from Multiple Property Websites"
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Progress bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">1/6</span>
              <span className="text-gray-900">Job post</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left column */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Let's start with a strong title.</h1>
            <p className="text-base text-gray-600">
              This helps your job post stand out to the right candidates. It's the first thing they'll see, so make it count!
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">
                Write a title for your job post
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your job post title"
                minLength={6}
              />
              <div className="mt-2 space-y-2">
                {title.length > 100 && (
                  <div className="text-red-500 text-sm flex items-center gap-2">
                    <span>⚠</span>
                    Must be less than 100 characters
                  </div>
                )}
                {title.split(' ').some(word => word.length > 50) && (
                  <div className="text-red-500 text-sm flex items-center gap-2">
                    <span>⚠</span>
                    Please limit the length of the words to less than 50 characters each
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Example titles */}
            <div>
              <h2 className="text-base font-medium text-gray-900 mb-3">Example titles</h2>
              <ul className="space-y-3">
                {exampleTitles.map((example, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            {/* Continue button */}
            <div className="pt-4">
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  title.length >= 6
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={title.length < 6}
                onClick={() => router.push('/buyer/post-job/skills')}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
