'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navigation */}
      <header className="fixed top-0 w-full bg-white border-b shadow-sm z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ScrapeNexus
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/post-project" className="nav-link">
              Post a Project
            </Link>
            <Link href="/find-work" className="nav-link">
              Find Work
            </Link>
            <Link href="/how-it-works" className="nav-link">
              How It Works
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth" className="nav-link">
              Login
            </Link>
            <Link href="/auth" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Connecting Businesses with the Best Web Scraping Experts
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find the perfect developer or project in minutes
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/post-project" className="btn-primary text-lg px-8 py-3">
                  Post a Project
                </Link>
                <Link href="/find-work" className="btn-secondary text-lg px-8 py-3">
                  Find Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Post a Project</h3>
                <p className="text-gray-600">
                  Create a detailed project listing for your web scraping needs
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Find Work</h3>
                <p className="text-gray-600">
                  Browse and apply to web scraping projects that match your skills
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Work with confidence using our secure payment system
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
                <li><Link href="/press" className="text-gray-600 hover:text-gray-900">Press</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
                <li><Link href="/safety" className="text-gray-600 hover:text-gray-900">Safety</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
                <li><a href="mailto:support@scrapenexus.com" className="text-gray-600 hover:text-gray-900">support@scrapenexus.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}