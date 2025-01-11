'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { jobPostingStore } from '@/lib/jobPostingStore'
import Link from 'next/link'

export default function PostJobScope() {
  const router = useRouter()
  const storedScope = jobPostingStore.getField<{scope: string, duration: string}>('scope');
  const [selectedScope, setSelectedScope] = useState<string>(storedScope?.scope || '')
  const [selectedDuration, setSelectedDuration] = useState<string>(storedScope?.duration || '')

  const handleNext = () => {
    if (selectedScope && selectedDuration) {
      jobPostingStore.saveField('scope', {
        scope: selectedScope,
        duration: selectedDuration
      });
      router.push('/buyer/post-job/budget')
    } else {
      console.log('Please select a scope and duration to proceed to the budget page.')
    }
  }

  return (
    <div>
      <Navigation />

      {/* Progress indicator */}
      <div className="border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <span className="text-sm text-gray-700">3/6</span>
            <span className="ml-2 text-sm text-gray-700">Job post</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Left column */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Next, estimate the scope<br />of your work.
            </h1>
            <p className="text-gray-600">
              These aren't final answers, but this information helps us<br />
              recommend the right talent for what you need.
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Selected scope display or scope options */}
            {selectedScope ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900">{selectedScope}</h2>
                  <button 
                    onClick={() => setSelectedScope('')}
                    className="p-1.5 rounded-full border border-custom-green text-custom-green hover:bg-custom-green hover:text-white transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-gray-600">
                  {selectedScope === 'Medium' && 'Well-defined projects (ex. design business rebrand package (i.e., logos, icons))'}
                  {selectedScope === 'Large' && 'Longer term or complex initiatives (ex. develop and execute a brand strategy (i.e., graphics, positioning))'}
                  {selectedScope === 'Small' && 'Quick and straightforward tasks (ex. create logo for a new product)'}
                </p>

                {/* Duration section */}
                <div className="mt-8">
                  <h2 className="text-base font-medium text-gray-900 mb-4">How frequently will you need to scrape data?</h2>
                  <div className="space-y-4">
                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="one-time"
                          checked={selectedDuration === 'one-time'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">One-time</span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="weekly"
                          checked={selectedDuration === 'weekly'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">Weekly</span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="monthly"
                          checked={selectedDuration === 'monthly'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">Monthly</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              /* Scope options */
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Large"
                      checked={selectedScope === 'Large'}
                      onChange={(e) => setSelectedScope(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Large</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Longer term or complex initiatives (ex. develop and execute a brand strategy (i.e., graphics, positioning))
                  </p>
                </label>

                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Medium"
                      checked={selectedScope === 'Medium'}
                      onChange={(e) => setSelectedScope(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Medium</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Well-defined projects (ex. design business rebrand package (i.e., logos, icons))
                  </p>
                </label>

                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Small"
                      checked={selectedScope === 'Small'}
                      onChange={(e) => setSelectedScope(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Small</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Quick and straightforward tasks (ex. create logo for a new product)
                  </p>
                </label>
              </div>
            )}

            {/* Next button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-custom-green hover:bg-custom-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-green"
              >
                Next: Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
