'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { jobPostingStore } from '@/lib/jobPostingStore';

export default function ReviewPage() {
  const [isScreeningExpanded, setIsScreeningExpanded] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    title: 'No title specified',
    description: 'No description provided',
    skills: [],
    scope: 'Not specified',
    location: 'Worldwide',
    budget: 'Not specified'
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = jobPostingStore.getAllData();
      setJobDetails({
        title: storedData.title || 'No title specified',
        description: storedData.description || 'No description provided',
        skills: (storedData.skills || []).map(skill => skill.skill_name),
        scope: formatScope(storedData.scope),
        location: storedData.location === 'us' ? 'United States only' : 'Worldwide',
        budget: formatBudget(storedData.budget)
      });
    }
  }, []);

  const handleFinalize = () => {
    router.push('/buyer/post-job/feature');
  };

  const formatBudget = (budget: any) => {
    if (!budget) return 'Not specified';
    
    if (budget.type === 'fixed') {
      return `$${parseFloat(budget.fixedRate).toFixed(2)} fixed price`;
    } else if (budget.type === 'hourly') {
      return `$${budget.fromRate} - $${budget.toRate} per hour`;
    }
    return 'Not specified';
  };

  const formatScope = (scope: any) => {
    if (!scope) return 'Not specified';
    return `${scope.scope}, ${scope.duration}`;
  };

  const handleEditSection = (section: string) => {
    const routes: { [key: string]: string } = {
      title: '/buyer/post-job/title',
      description: '/buyer/post-job/description',
      skills: '/buyer/post-job/skills',
      scope: '/buyer/post-job/scope',
      location: '/buyer/post-job/location',
      budget: '/buyer/post-job/budget'
    };
    
    if (routes[section]) {
      router.push(`${routes[section]}?from=review`);
    }
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
              NEXT: FINALIZE JOB POST
            </button>
          </div>

          {/* Job Details Sections */}
          <div className="space-y-8">
            {/* Title Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900">{jobDetails.title}</h2>
              </div>
              <button 
                onClick={() => handleEditSection('title')} 
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Description Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <p className="text-gray-600">{jobDetails.description}</p>
              </div>
              <button 
                onClick={() => handleEditSection('description')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Category Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Category</h3>
                <p className="text-gray-600">Graphic Design</p>
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
              <button 
                onClick={() => handleEditSection('skills')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Scope Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Scope</h3>
                <p className="text-gray-600">{jobDetails.scope}</p>
              </div>
              <button 
                onClick={() => handleEditSection('scope')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Location Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location preferences</h3>
                <p className="text-gray-600">{jobDetails.location}</p>
              </div>
              <button 
                onClick={() => handleEditSection('location')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Budget Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Budget</h3>
                <p className="text-gray-600">{jobDetails.budget}</p>
              </div>
              <button 
                onClick={() => handleEditSection('budget')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
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

          {/* Back and Next Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleFinalize}
              className="px-6 py-2 bg-custom-green hover:bg-custom-green/90 text-white rounded-lg font-medium"
            >
              Next: Finalize job post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
