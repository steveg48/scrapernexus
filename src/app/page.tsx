'use client'

import Link from 'next/link'
import { CloudDownload } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Nav Links */}
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-[24px] font-semibold text-[#3c8dd5]">
                  ScrapeNexus
                </span>
                <CloudDownload className="h-10 w-10 text-[#FF69B4]" />
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-700 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#14A800] hover:bg-[#14A800]/90 text-white px-4 py-2 rounded-full"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Web Scraping Made Easy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with expert developers to build custom web scraping solutions
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-[#FF1493] hover:bg-[#FF1493]/90 text-white px-6 py-3 rounded-full text-lg font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full text-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#3c8dd5] font-semibold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Project</h3>
              <p className="text-gray-600">
                Tell us what you need. Get custom offers from our experts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#3c8dd5] font-semibold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose an Expert</h3>
              <p className="text-gray-600">
                Browse custom offers and pick the best one.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#3c8dd5] font-semibold text-lg">3</span>
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