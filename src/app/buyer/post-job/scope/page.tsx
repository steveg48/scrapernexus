'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'

export default function PostJobScope() {
  const [selectedScope, setSelectedScope] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<string>('')
  const router = useRouter()

  const handleNext = () => {
    if (selectedScope && selectedDuration) {
      router.push('/buyer/post-job/location')
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
                  <h2 className="text-base font-medium text-gray-900 mb-4">How long will your work take?</h2>
                  <div className="space-y-4">
                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="1-to-3"
                          checked={selectedDuration === '1-to-3'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">1 to 3 months</span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="3-to-6"
                          checked={selectedDuration === '3-to-6'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">3 to 6 months</span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="more-than-6"
                          checked={selectedDuration === 'more-than-6'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-base text-gray-900">More than 6 months</span>
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
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center">
          <div className="flex-1">
            <Link href="/buyer/post-job/skills" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <span>← Back</span>
            </Link>
          </div>
          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedScope && selectedDuration
                ? 'bg-custom-green hover:bg-custom-green/90 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next: Location
          </button>
        </div>
      </div>
    </div>
  )
}
