'use client';

import { useState, useEffect } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { jobPostingStore } from '@/lib/jobPostingStore';

export default function LocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const fromReview = searchParams?.get('from') === 'review';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLocation = jobPostingStore.getField<string>('project_location');
      if (storedLocation) {
        setSelectedLocation(storedLocation);
      }
    }
  }, []);

  const handleNext = async () => {
    if (selectedLocation) {
      try {
        jobPostingStore.saveField('project_location', selectedLocation);
        const nextPath = fromReview ? '/buyer/post-job/review' : '/buyer/post-job/description';
        await router.push(nextPath);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Progress bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">4/6</span>
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Select your preferred talent location.
            </h1>
            <p className="text-base text-gray-600">
              This increases proposals from talent in a specific region, but
              still opens your job post to all candidates.
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Location options */}
            <div className="space-y-4">
              {/* U.S. only option */}
              <button
                onClick={() => setSelectedLocation('US only')}
                className={`w-full p-4 rounded-lg border ${
                  selectedLocation === 'US only'
                    ? 'border-green-600 ring-1 ring-green-600'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-700" />
                  <div>
                    <h3 className="font-medium text-gray-900">U.S. only</h3>
                    <p className="text-sm text-gray-500">Only talent in United States can submit proposals</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedLocation === 'US only'
                        ? 'border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedLocation === 'US only' && (
                        <div className="w-3 h-3 bg-green-600 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Worldwide option */}
              <button
                onClick={() => setSelectedLocation('Worldwide')}
                className={`w-full p-4 rounded-lg border ${
                  selectedLocation === 'Worldwide'
                    ? 'border-green-600 ring-1 ring-green-600'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-700" />
                  <div>
                    <h3 className="font-medium text-gray-900">Worldwide</h3>
                    <p className="text-sm text-gray-500">Talent in any location can submit proposals</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedLocation === 'Worldwide'
                        ? 'border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedLocation === 'Worldwide' && (
                        <div className="w-3 h-3 bg-green-600 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedLocation
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedLocation}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
