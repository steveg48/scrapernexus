'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Award, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';
import { createBrowserClient } from '@/lib/supabase';

export default function FeaturePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPostingStandard, setIsPostingStandard] = useState(false);
  const [isPostingFeatured, setIsPostingFeatured] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get session first
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!currentSession) {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/auth/login?returnUrl=${returnUrl}`);
          return;
        }

        setSession(currentSession);

        // Initialize store and get job data after session is confirmed
        const store = getJobPostingStore();
        await store.initialize();
        const data = await store.getAllData();
        setJobData(data);
      } catch (error) {
        console.error('Error initializing:', error);
        setError('Error loading data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [router, supabase.auth]);

  const handlePost = async (projectType: 'standard' | 'featured') => {
    if (!session) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    try {
      if (projectType === 'standard') {
        setIsPostingStandard(true);
      } else {
        setIsPostingFeatured(true);
      }

      const store = getJobPostingStore();
      await store.initialize();
      const storedData = await store.getAllData();

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

      // Prepare project data
      const projectData = {
        title: storedData.title,
        description: storedData.description,
        frequency: frequencyMap[storedData.scope?.duration as keyof typeof frequencyMap] || 'one-time',
        budget_min: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.fromRate?.replace(/,/g, '') || '0') : null,
        budget_max: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.toRate?.replace(/,/g, '') || '0') : null,
        budget_fixed_price: storedData.budget?.type === 'fixed' ? parseFloat(storedData.budget.fixedRate?.replace(/,/g, '') || '0') : null,
        project_budget_type: storedData.budget?.type || 'fixed',
        project_location: storedData.project_location || 'remote',
        project_scope: storedData.scope?.scope?.toLowerCase() || 'medium',
        project_type: projectType,
        skill_ids: storedData.skills?.map(skill => Number(skill.skill_id)) || [],
        data_fields: JSON.stringify(storedData) // Store full data as JSON string
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to create project');
      }

      // Clear the store after successful post
      await store.clearData();
      
      // Redirect to success page
      router.push('/buyer/post-job/success');
    } catch (error) {
      console.error('Error posting job:', error);
      setError(error instanceof Error ? error.message : 'Failed to post job. Please try again.');
    } finally {
      setIsPostingStandard(false);
      setIsPostingFeatured(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!session) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    try {
      setIsDraftSaving(true);
      const store = getJobPostingStore();
      await store.initialize();
      await store.persistToStorage();
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('Failed to save draft. Please try again.');
    } finally {
      setIsDraftSaving(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-custom-green hover:text-custom-green/90 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
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
                onClick={() => handlePost('standard')}
                disabled={isPostingStandard}
                className="w-full py-2 px-4 border border-custom-green text-custom-green hover:bg-custom-green/5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingStandard ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-custom-green mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  'Post as standard for free'
                )}
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
                onClick={() => handlePost('featured')}
                disabled={isPostingFeatured}
                className="w-full py-2 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingFeatured ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  'Post as Featured for $29.99'
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveDraft}
            disabled={isDraftSaving}
            className="mt-12 text-custom-green hover:text-custom-green/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDraftSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-custom-green mr-2"></div>
                Saving draft...
              </>
            ) : (
              "Save draft without posting"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
