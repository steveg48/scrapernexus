'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getJobPostingStore } from '@/lib/jobPostingStore'

export default function TitlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    async function initializeStore() {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.clear(); // Clear any existing data when starting a new job post
        
        if (mounted) {
          setTitle('');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing store:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeStore();

    return () => {
      mounted = false;
    };
  }, []);

  const exampleTitles = [
    "Scrape Product Data from E-commerce Websites with Price and Availability Tracking",
    "Develop a Web Scraping Script for Social Media Analytics (Python Preferred)",
    "Extract Real Estate Listings Data from Multiple Property Websites"
  ]

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleNext = async () => {
    if (title.trim().length >= 6) {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.saveField('title', title.trim());
        router.push('/buyer/post-job/description');
      } catch (error) {
        console.error('Error saving title:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">1/5</span>
              <span className="text-gray-900">Job post</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left column */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Let's start with a strong title.</h1>
            <p className="text-base text-gray-600">
              This helps your job post stand out to the right candidates. It's the first thing they'll see, so make it count!
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">
                Write a title for your job post
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Web Scraping Expert Needed for E-commerce Data Collection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Example titles</h3>
              <ul className="space-y-3">
                {exampleTitles.map((example, index) => (
                  <li
                    key={index}
                    onClick={() => setTitle(example)}
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={handleNext}
                disabled={title.trim().length < 6}
                className={`w-full px-4 py-2 rounded-lg text-white ${
                  title.trim().length >= 6
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Next: Description
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
