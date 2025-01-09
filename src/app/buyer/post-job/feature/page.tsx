'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Award, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { jobPostingStore } from '@/lib/jobPostingStore';

export default function FeaturePage() {
  const router = useRouter();

  const handlePostStandard = () => {
    // Submit job posting as standard
    jobPostingStore.clearData(); // Clear stored data after successful submission
    router.push('/buyer/post-job/success');
  };

  const handlePostFeatured = () => {
    // Submit job posting as featured
    jobPostingStore.clearData(); // Clear stored data after successful submission
    router.push('/buyer/post-job/success');
  };

  const handleSaveDraft = () => {
    // The data is already saved in localStorage, so we can just redirect
    router.push('/buyer/dashboard');
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back link at the top */}
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-xl font-medium text-gray-900 mb-4">Finalize job post</h1>
          
          <h2 className="text-4xl font-semibold text-gray-900 mb-12">
            Choose the right option for you
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Standard Job Post */}
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="mb-6">
                <FileText className="h-12 w-12 text-gray-600" />
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Post a standard job
              </h3>
              <p className="text-gray-600 mb-6">Free</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Get proposals from skilled freelancers and agencies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Invite up to 30 freelancers total to apply
                  </span>
                </li>
              </ul>

              <button
                onClick={handlePostStandard}
                className="w-full py-2 px-4 border border-custom-green text-custom-green hover:bg-custom-green/5 rounded-lg font-medium"
              >
                Post as standard for free
              </button>
            </div>

            {/* Featured Job Post */}
            <div className="bg-gray-900 text-white rounded-lg p-8">
              <div className="mb-6">
                <Award className="h-12 w-12 text-yellow-400" />
              </div>

              <h3 className="text-2xl font-semibold mb-2">
                Post a Featured Job
              </h3>
              <p className="text-gray-300 mb-6">$29.99/post</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Maximize your reach to quality talent
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Invite up to 70 freelancers daily to apply
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Get a "Featured" badge to stand out
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Attract top talent to find the right match
                  </span>
                </li>
              </ul>

              <button
                onClick={handlePostFeatured}
                className="w-full py-2 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium"
              >
                Post as Featured for $29.99
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveDraft}
            className="mt-12 text-custom-green hover:text-custom-green/90 font-medium"
          >
            Save draft without posting
          </button>
        </div>
      </div>
    </div>
  );
}
