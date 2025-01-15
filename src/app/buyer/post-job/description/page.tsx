'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Paperclip } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';

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
    if (trimmedDescription) {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.saveField('description', trimmedDescription);
        router.push('/buyer/post-job/review');
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
            6/6 • Job post
          </div>

          <div className="grid grid-cols-2 gap-12 relative">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-6">
                Start the conversation.
              </h1>

              <div className="mb-8">
                <h2 className="text-lg text-gray-900 mb-4">
                  Talent are looking for:
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                    <span className="text-gray-600">Clear expectations about your task or deliverables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                    <span className="text-gray-600">The skills required for your work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                    <span className="text-gray-600">Good communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                    <span className="text-gray-600">Details about how you or your team like to work</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4">
                Describe what you need
              </h2>

              <div className="space-y-6">
                <div>
                  <textarea
                    placeholder="Already have a description? Paste it here!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green resize-none"
                  />
                  <div className="flex justify-between items-center text-sm mt-2">
                    {description.length > 0 && description.length < 50 && (
                      <div className="flex items-start gap-2 bg-[#fff8e5] text-[#6b4e02] p-3 rounded-md w-full">
                        <span className="text-[#f1a817]">⚠</span>
                        Your description looks a little short. Add details like your project milestones and a bit about your team.
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {50000 - description.length} characters left
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">Need help?</h3>
                  <a
                    href="#"
                    className="text-custom-green hover:text-custom-green/90"
                  >
                    See examples of effective descriptions
                  </a>
                </div>

                <div>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach file
                  </button>
                  <div className="text-sm text-gray-500 mt-1">
                    Max file size: 100MB
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons row */}
          <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto px-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!description?.trim()}
              className="px-6 py-3 bg-custom-green text-white rounded-lg hover:bg-custom-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
