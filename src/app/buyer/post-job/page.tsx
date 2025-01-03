'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function PostJob() {
  const [title, setTitle] = useState('')
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
        <div className="max-w-5xl mx-auto px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">1/6</span>
              <span className="text-gray-900">Job post</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left column */}
          <div className="col-span-5">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Let's start with a strong title.</h1>
            <p className="text-base text-gray-700">
              This helps your job post stand out to the right candidates. It's the first thing they'll see, so make it count!
            </p>
          </div>

          {/* Right column */}
          <div className="col-span-7">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-lg font-medium text-gray-900 mb-2">
                  Write a title for your job post
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your job post title"
                  minLength={6}
                />
                <p className="mt-2 text-sm text-gray-500">Minimum 6 characters</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">Example titles</h2>
                <ul className="space-y-3">
                  {exampleTitles.map((example, index) => (
                    <li key={index} className="text-gray-700">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Continue button */}
            <div className="mt-8">
              <button
                className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                  title.length >= 6
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={title.length < 6}
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
