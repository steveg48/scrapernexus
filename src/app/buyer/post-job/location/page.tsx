'use client';

import { useState } from 'react';
import { MapPin, Globe, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { jobPostingStore } from '@/lib/jobPostingStore';

export default function LocationPage() {
  const storedLocation = jobPostingStore.getField<'us' | 'worldwide' | null>('location');
  const [selectedLocation, setSelectedLocation] = useState<'us' | 'worldwide' | null>(storedLocation || null);
  const router = useRouter();

  const handleNext = () => {
    if (selectedLocation) {
      jobPostingStore.saveField('location', {
        type: selectedLocation,
        locations: []
      });
      router.push('/buyer/post-job/description')
    }
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">4/6 Job post</p>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-gray-900">
              Select your preferred<br />talent location.
            </h1>
            
            <p className="text-gray-600">
              This increases proposals from talent in a specific region, but<br />
              still opens your job post to all candidates.
            </p>

            {/* Location options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* U.S. only option */}
              <button
                onClick={() => setSelectedLocation('us')}
                className={`p-6 rounded-xl border ${
                  selectedLocation === 'us'
                    ? 'border-custom-green ring-1 ring-custom-green'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="absolute right-4 top-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    selectedLocation === 'us'
                      ? 'border-custom-green'
                      : 'border-gray-300'
                  }`}>
                    {selectedLocation === 'us' && (
                      <div className="w-4 h-4 bg-custom-green rounded-full" />
                    )}
                  </div>
                </div>
                
                <MapPin className="h-6 w-6 text-gray-900 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">U.S. only</h2>
                <p className="text-gray-600">Only talent in United States can submit proposals</p>
              </button>

              {/* Worldwide option */}
              <button
                onClick={() => setSelectedLocation('worldwide')}
                className={`p-6 rounded-xl border ${
                  selectedLocation === 'worldwide'
                    ? 'border-custom-green ring-1 ring-custom-green'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="absolute right-4 top-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    selectedLocation === 'worldwide'
                      ? 'border-custom-green'
                      : 'border-gray-300'
                  }`}>
                    {selectedLocation === 'worldwide' && (
                      <div className="w-4 h-4 bg-custom-green rounded-full" />
                    )}
                  </div>
                </div>
                
                <Globe className="h-6 w-6 text-gray-900 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Worldwide</h2>
                <p className="text-gray-600">Talent in any location can submit proposals</p>
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedLocation
                  ? 'bg-custom-green hover:bg-custom-green/90 text-white cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next: Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
