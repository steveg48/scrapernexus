'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function FeaturePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!currentSession) {
          router.push('/auth/login');
          return;
        }

        setSession(currentSession);

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
  }, [router]);

  const handlePost = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsPosting(true);
      setError(null);

      const store = getJobPostingStore();
      await store.initialize();
      const storedData = await store.getAllData();

      if (!storedData.title || !storedData.description || !storedData.scope || !storedData.skills) {
        throw new Error('Missing required project information');
      }

      const frequencyMap = {
        'one-time': 'one-time',
        'weekly': 'weekly',
        'monthly': 'monthly'
      };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // First, insert the project posting
      const { data: projectPosting, error: projectError } = await supabase
        .from('project_postings')
        .insert({
          buyer_id: user.id,
          title: storedData.title,
          description: storedData.description,
          frequency: frequencyMap[storedData.scope?.duration as keyof typeof frequencyMap] || 'one-time',
          budget_min: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.fromRate?.replace(/,/g, '') || '0') : null,
          budget_max: storedData.budget?.type === 'hourly' ? parseFloat(storedData.budget.toRate?.replace(/,/g, '') || '0') : null,
          budget_fixed_price: storedData.budget?.type === 'fixed' ? parseFloat(storedData.budget.fixedRate?.replace(/,/g, '') || '0') : null,
          project_budget_type: storedData.budget?.type || 'fixed',
          project_location: storedData.project_location || 'remote',
          project_scope: storedData.scope?.scope?.toLowerCase() || 'medium',
          project_type: 'standard',
          data_fields: storedData
        })
        .select()
        .single();

      if (projectError) throw projectError;
      if (!projectPosting) throw new Error('Failed to create project posting');

      // Then, insert the project skills
      const skillPromises = storedData.skills.map(async (skill: any) => {
        const { error: skillError } = await supabase
          .from('project_skills')
          .insert({
            project_posting_id: projectPosting.project_postings_id,
            skill_id: Number(skill.skill_id)
          });
        if (skillError) throw skillError;
      });

      await Promise.all(skillPromises);

      await store.clearData();
      router.push('/buyer/post-job/success');
    } catch (error) {
      console.error('Error posting job:', error);
      setError(error instanceof Error ? error.message : 'Failed to post job');
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true);
      router.push('/buyer/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      setError(error instanceof Error ? error.message : 'Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">6/6</span>
              <span className="text-gray-900">Finalize job post</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Choose your option</h1>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900">Post a job</h2>
                <p className="mt-1 text-sm text-gray-500">Free</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">•</span>
                    Get proposals from skilled freelancers and agencies
                  </li>
                </ul>
                <button
                  onClick={handlePost}
                  disabled={isPosting}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isPosting ? 'Posting...' : 'Post as Standard Job for Free'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleSaveDraft}
            disabled={isDraftSaving}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            {isDraftSaving ? 'Saving draft...' : 'Save draft without posting'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
