'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import LandingNav from '@/components/LandingNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      
      {/* Hero Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connecting Businesses with the<br />
              Best Web Scraping Experts
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Find the perfect developer or project within days
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/post-project"
                className="bg-[#FF1493] hover:bg-[#FF1493]/90 text-white px-6 py-3 rounded-full text-lg font-medium"
              >
                Post a Project
              </Link>
              <Link
                href="/find-work"
                className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full text-lg font-medium"
              >
                Find Work
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post a Project</h3>
              <p className="text-gray-600">
                Tell us what you need. It's free to post.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Work</h3>
              <p className="text-gray-600">
                Browse custom offers and pick the best one.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Pay safely through our secure platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}