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
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Web Scraping Made Easy
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect with expert developers to build custom web scraping solutions for your business
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-[#14A800] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#14A800]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14A800]"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}