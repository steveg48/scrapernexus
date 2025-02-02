'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';
import { ArrowLeft } from 'lucide-react';

export default function JobDescriptionPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        const savedDescription = await store.getField<string>('description');
        if (savedDescription) {
          setDescription(savedDescription);
        }
      } catch (error) {
        console.error('Error loading description:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleNext = async () => {
    const trimmedDescription = description?.trim();
    if (trimmedDescription && trimmedDescription.length >= 50) {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.saveField('description', trimmedDescription);
        router.push('/buyer/post-job/budget');
      } catch (error) {
        console.error('Error saving description:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress indicator */}
          <div className="mb-8 text-gray-500">
            2/5 • Job post
          </div>

          <div className="grid grid-cols-2 gap-12 relative">
            {/* Left Column */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Describe your project
              </h1>
              <p className="text-gray-600">
                This helps us understand your needs and match you with the right talent.
                Be as detailed as possible about what you're looking to achieve.
              </p>
            </div>

            {/* Right Column */}
            <div>
              <div className="space-y-6">
                <div>
                  <textarea
                    placeholder="Example: I need a Python script that can scrape product data from multiple e-commerce websites. The script should be able to extract product names, prices, descriptions, and availability status. Data should be saved in a structured format (CSV/JSON)."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum 50 characters ({description.length}/50)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => router.push('/buyer/post-job/title')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!description?.trim() || description.trim().length < 50}
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                description?.trim() && description.trim().length >= 50
                  ? 'bg-custom-green text-white hover:bg-custom-green/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
