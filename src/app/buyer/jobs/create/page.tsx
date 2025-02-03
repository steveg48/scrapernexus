'use client'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function CreateJobPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <span className="text-sm text-gray-500">1/6 Job post</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Let's start with a strong title.</h1>
        <p className="text-gray-600">This helps your job post stand out to the right candidates.<br />It's the first thing they'll see, so make it count!</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write a title for your job post
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Minimum 6 characters"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Example titles</h2>
        <ul className="space-y-2 text-sm text-blue-600">
          <li>Scrape Product Data from E-commerce Websites with Price and Availability Tracking</li>
          <li>Develop a Web Scraping Script for Social Media Analytics (Python Preferred)</li>
          <li>Extract Real Estate Listings Data from Multiple Property Websites</li>
        </ul>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Continue
        </button>
      </div>
    </div>
  )
}
