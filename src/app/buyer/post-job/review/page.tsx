'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ReviewPage() {
  const [isScreeningExpanded, setIsScreeningExpanded] = useState(false);
  const router = useRouter();

  const handleFinalize = () => {
    // Navigate to feature selection page instead of dashboard
    router.push('/buyer/post-job/feature');
  };

  const jobDetails = {
    title: 'o8uiyt;p89y 9 [0u y9y 9piy9pi8y i89y',
    description: 'ju-uj-9u 9-u w4e-utg -93wjua4t g9-wq23u4t g9-j23awqu 4tg9-w4uaet g-u90 -w42e -9ut2gw43u-90w4rg3 aug3u a-we4r',
    category: 'Graphic Design',
    skills: ['Social Media Imagery', 'Graphic Design'],
    scope: 'Medium, 3 to 6 months, Intermediate level, Contract-to-hire opportunity',
    location: 'Worldwide',
    budget: '$6,000.00'
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Job details</h1>
            <button
              onClick={handleFinalize}
              className="px-6 py-2 bg-custom-green hover:bg-custom-green/90 text-white rounded-lg font-medium"
            >
              Next: Finalize job post
            </button>
          </div>

          {/* Job Details Sections */}
          <div className="space-y-8">
            {/* Title Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900">{jobDetails.title}</h2>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Description Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <p className="text-gray-600">{jobDetails.description}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Category Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Category</h3>
                <p className="text-gray-600">{jobDetails.category}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Skills Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex gap-2">
                  {jobDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Scope Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Scope</h3>
                <p className="text-gray-600">{jobDetails.scope}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Location Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location preferences</h3>
                <p className="text-gray-600">{jobDetails.location}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Budget Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Budget</h3>
                <p className="text-gray-600">{jobDetails.budget}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Screening Questions Section */}
            <div>
              <button
                onClick={() => setIsScreeningExpanded(!isScreeningExpanded)}
                className="w-full flex justify-between items-center py-4"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Screening questions (optional)</h3>
                  <p className="text-gray-600">Narrow down your candidates</p>
                </div>
                {isScreeningExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
