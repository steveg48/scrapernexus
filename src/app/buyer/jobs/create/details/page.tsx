'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JobDetailsPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')

  useEffect(() => {
    const savedTitle = localStorage.getItem('jobTitle')
    if (!savedTitle) {
      router.push('/buyer/jobs/create')
      return
    }
    setTitle(savedTitle)
  }, [router])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-sm text-gray-500">2/6 Job post</span>
      </div>
      
      <div className="grid grid-cols-2 gap-16">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Now, add some details about your job.</h1>
          <p className="text-gray-600">Help candidates understand what you're looking for.</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg h-32"
              placeholder="Describe what you need..."
            />
          </div>

          <div className="flex justify-between">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => router.push('/buyer/jobs/create/skills')}
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
