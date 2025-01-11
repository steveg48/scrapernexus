'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Award, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { jobPostingStore } from '@/lib/jobPostingStore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function FeaturePage() {
  const router = useRouter();
  const [isPostingStandard, setIsPostingStandard] = useState(false);
  const [isPostingFeatured, setIsPostingFeatured] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handlePost = async (projectType: 'standard' | 'featured') => {
    if (projectType === 'standard') {
      setIsPostingStandard(true);
    } else {
      setIsPostingFeatured(true);
    }
    setError(null);

    try {
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please sign in to post a project');
      }

      // Get all stored data
      const storedData = jobPostingStore.getAllData();
      
      // Validate required fields
      if (!storedData.title || !storedData.description || !storedData.scope || !storedData.skills) {
        throw new Error('Missing required project information');
      }

      // Map duration to frequency enum
      const frequencyMap = {
        'one-time': 'one-time',
        'weekly': 'weekly',
        'monthly': 'monthly',
        'yearly': 'yearly'
      };

      // Debug logging
      console.log('Stored duration:', storedData.scope?.duration);
      console.log('Mapped frequency:', frequencyMap[storedData.scope?.duration as keyof typeof frequencyMap]);

      // Prepare project data
      const projectData = {
        buyer_id: session.user.id,
        title: storedData.title,
        description: storedData.description,
        frequency: frequencyMap[storedData.scope?.duration as keyof typeof frequencyMap] || 'one-time',
        budget_min: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.fromRate.replace(/,/g, '')) : null,
        budget_max: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.toRate.replace(/,/g, '')) : null,
        budget_fixed_price: storedData.budget?.type === 'fixed' ? parseFloat(storedData.budget.fixedRate.replace(/,/g, '')) : null,
        project_budget_type: storedData.budget?.type || 'fixed',
        project_location: storedData.project_location || 'remote',
        project_scope: storedData.scope?.scope?.toLowerCase() || 'medium',
        project_type: projectType,
        skill_ids: storedData.skills?.map(skill => skill.skill_id) || [],
        is_draft: false  // Set is_draft to false when posting
      };

      // Debug logging
      console.log('Project data being sent:', projectData);

      // Make API call
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      // Clear stored data after successful submission
      jobPostingStore.clearData();
      
      // Navigate to success page
      router.push('/buyer/post-job/success');

    } catch (error) {
      console.error('Error posting project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project. Please try again.');
    } finally {
      setIsPostingStandard(false);
      setIsPostingFeatured(false);
    }
  };

  const handlePostStandard = () => handlePost('standard');
  const handlePostFeatured = () => handlePost('featured');

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    setError(null);

    try {
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please sign in to save draft');
      }

      // Get all stored data
      const storedData = jobPostingStore.getAllData();
      
      // Prepare project data for draft
      const projectData = {
        buyer_id: session.user.id,
        title: storedData.title || '',
        description: storedData.description || '',
        frequency: storedData.scope?.duration || 'one-time',
        budget_min: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.fromRate.replace(/,/g, '')) : null,
        budget_max: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.toRate.replace(/,/g, '')) : null,
        budget_fixed_price: storedData.budget?.type === 'fixed' ? parseFloat(storedData.budget.fixedRate.replace(/,/g, '')) : null,
        project_budget_type: storedData.budget?.type || 'fixed',
        project_location: storedData.project_location || 'remote',
        project_scope: storedData.scope?.scope?.toLowerCase() || 'medium',
        project_type: 'standard',
        skill_ids: storedData.skills?.map(skill => skill.skill_id) || [],
        is_draft: true  // Set is_draft to true when saving as draft
      };

      // Make API call
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft');
      }

      // Clear stored data after successful submission
      jobPostingStore.clearData();
      
      // Navigate back to jobs page
      router.push('/buyer/jobs');

    } catch (error) {
      console.error('Error saving draft:', error);
      setError(error instanceof Error ? error.message : 'Failed to save draft. Please try again.');
    } finally {
      setIsDraftSaving(false);
    }
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

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

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
                disabled={isPostingStandard}
                className="w-full py-2 px-4 border border-custom-green text-custom-green hover:bg-custom-green/5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingStandard ? 'Posting...' : 'Post as standard for free'}
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
                disabled={isPostingFeatured}
                className="w-full py-2 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingFeatured ? 'Posting...' : 'Post as Featured for $29.99'}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveDraft}
            disabled={isDraftSaving}
            className="mt-12 text-custom-green hover:text-custom-green/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDraftSaving ? "Saving draft..." : "Save draft without posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
