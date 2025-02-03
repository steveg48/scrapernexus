'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateJobPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [step, setStep] = useState(1)

  const handleContinue = () => {
    if (title.length < 6) {
      alert('Please enter a title with at least 6 characters')
      return
    }
    // Save title to localStorage for now
    localStorage.setItem('jobTitle', title)
    // Use absolute path for navigation
    router.push('/buyer/jobs/create/details')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-sm text-gray-500">1/6 Job post</span>
      </div>
      
      <div className="grid grid-cols-2 gap-16">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Let's start with a strong title.</h1>
          <p className="text-gray-600">This helps your job post stand out to the right candidates.<br />It's the first thing they'll see, so make it count!</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm mb-2">
              Write a title for your job post
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <h2 className="text-sm mb-4">Example titles</h2>
            <ul className="space-y-2 text-sm text-blue-600">
              <li>Scrape Product Data from E-commerce Websites with Price and Availability Tracking</li>
              <li>Develop a Web Scraping Script for Social Media Analytics (Python Preferred)</li>
              <li>Extract Real Estate Listings Data from Multiple Property Websites</li>
            </ul>
          </div>

          <div className="flex">
            <button 
              onClick={handleContinue}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
