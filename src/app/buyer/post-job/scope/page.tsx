'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { getJobPostingStore } from '@/lib/jobPostingStore'
import Link from 'next/link'

export default function PostJobScope() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedScope, setSelectedScope] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        const storedScope = await store.getField<string>('project_scope');
        const storedFrequency = await store.getField<string>('frequency');
        setSelectedScope(storedScope || '');
        setSelectedDuration(storedFrequency || '');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNext = async () => {
    if (selectedScope && selectedDuration) {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.saveField('project_scope', selectedScope);
        await store.saveField('frequency', selectedDuration);
        router.push('/buyer/post-job/budget');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } else {
      console.log('Please select a scope and duration to proceed to the budget page.');
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
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
                  {selectedScope === 'medium' && 'Well-defined projects (ex. design business rebrand package (i.e., logos, icons))'}
                  {selectedScope === 'large' && 'Longer term or complex initiatives (ex. develop and execute a brand strategy (i.e., graphics, positioning))'}
                  {selectedScope === 'small' && 'Quick and straightforward tasks (ex. create logo for a new product)'}
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
                          className="h-4 w-4 text-custom-green border-gray-300 focus:ring-custom-green"
                        />
                        <span className="ml-3 text-gray-900">One-time project</span>
                      </div>
                    </label>
                    <label className="block">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          value="ongoing"
                          checked={selectedDuration === 'ongoing'}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-custom-green border-gray-300 focus:ring-custom-green"
                        />
                        <span className="ml-3 text-gray-900">Ongoing project</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-4">Project scope</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedScope('small')}
                    className="w-full text-left p-4 border rounded-lg hover:border-custom-green focus:outline-none focus:ring-2 focus:ring-custom-green"
                  >
                    <h3 className="font-medium text-gray-900">Small</h3>
                    <p className="text-sm text-gray-600 mt-1">Quick and straightforward tasks</p>
                  </button>
                  <button
                    onClick={() => setSelectedScope('medium')}
                    className="w-full text-left p-4 border rounded-lg hover:border-custom-green focus:outline-none focus:ring-2 focus:ring-custom-green"
                  >
                    <h3 className="font-medium text-gray-900">Medium</h3>
                    <p className="text-sm text-gray-600 mt-1">Well-defined projects</p>
                  </button>
                  <button
                    onClick={() => setSelectedScope('large')}
                    className="w-full text-left p-4 border rounded-lg hover:border-custom-green focus:outline-none focus:ring-2 focus:ring-custom-green"
                  >
                    <h3 className="font-medium text-gray-900">Large</h3>
                    <p className="text-sm text-gray-600 mt-1">Longer term or complex initiatives</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedScope || !selectedDuration}
            className={`px-6 py-2 rounded-md text-white ${
              selectedScope && selectedDuration
                ? 'bg-custom-green hover:bg-custom-green-dark'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
