'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';
import { ArrowLeft } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export default function ReviewPage() {
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobData() {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        
        // Load all required fields
        const [title, description, budget, skills, frequency] = await Promise.all([
          store.getField<string>('title'),
          store.getField<string>('description'),
          store.getField<any>('budget'),
          store.getField<Array<{ skill_id: number; skill_name: string }>>('skills'),
          store.getField<string>('frequency')
        ]);

        if (!title || !description || !budget || !skills) {
          router.push('/buyer/post-job/title');
          return;
        }

        setJobData({
          title,
          description,
          budget,
          skills,
          frequency,
          status: 'active'
        });
      } catch (error) {
        console.error('Error loading job data:', error);
        setError('Failed to load job data');
      } finally {
        setIsLoading(false);
      }
    }
    loadJobData();
  }, [router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setError('You must be logged in to post a job');
        return;
      }

      const now = new Date().toISOString();
      
      // Format the job data with only required fields
      const finalJobData = {
        title: jobData.title,
        description: jobData.description,
        buyer_id: user.id,
        data_fields: {
          skills: jobData.skills || []
        },
        budget_min: jobData.budget?.type === 'fixed' 
          ? parseFloat(jobData.budget?.fixedRate || '0') 
          : parseFloat(jobData.budget?.fromRate || '0'),
        budget_max: jobData.budget?.type === 'fixed'
          ? parseFloat(jobData.budget?.fixedRate || '0')
          : parseFloat(jobData.budget?.toRate || '0'),
        created_at: now,
        status: 'active',
        frequency: 'weekly' // Using 'weekly' as the default value since we saw it in the database
      };

      console.log('Submitting job data:', finalJobData);

      // Insert the job posting
      const { data: jobResult, error: jobError } = await supabase
        .from('project_postings')
        .insert(finalJobData)
        .select('project_postings_id')
        .single();

      if (jobError) {
        console.error('Error inserting job:', jobError);
        throw jobError;
      }

      if (!jobResult) {
        throw new Error('No job data returned after insertion');
      }

      console.log('Job inserted successfully:', jobResult);

      // Clear the job posting store after successful submission
      const store = getJobPostingStore();
      await store.initialize();
      await store.clear();
      
      // Show success message and redirect
      router.push('/buyer/post-job/success');
    } catch (err: any) {
      console.error('Error submitting job post:', err);
      if (err.message.includes('auth')) {
        setError('Please log in to post a job');
      } else if (err.message.includes('duplicate')) {
        setError('A similar job post already exists');
      } else {
        setError(err.message || 'Failed to submit job post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              No job data found
            </h1>
            <p className="text-gray-600 mb-8">
              Please start from the beginning to create a new job post.
            </p>
            <button
              onClick={() => router.push('/buyer/post-job/title')}
              className="px-6 py-2 text-sm font-medium rounded-md bg-custom-green text-white hover:bg-custom-green/90"
            >
              Start New Job Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress indicator */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-4">
            <span className="text-gray-500">5/5 • Job post</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Review your job post</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 text-sm font-medium rounded-md ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-custom-green text-white hover:bg-custom-green/90'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Title</h2>
                <p className="text-gray-600">{jobData.title}</p>
              </div>
              <button 
                onClick={() => router.push('/buyer/post-job/title')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{jobData.description}</p>
              </div>
              <button 
                onClick={() => router.push('/buyer/post-job/description')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Budget</h2>
                {jobData.budget.type === 'hourly' ? (
                  <p className="text-gray-600">
                    ${jobData.budget.fromRate} - ${jobData.budget.toRate} /hour
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Fixed price: ${jobData.budget.fixedRate}
                  </p>
                )}
              </div>
              <button 
                onClick={() => router.push('/buyer/post-job/budget')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill: any) => (
                    <span
                      key={skill.skill_id}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-custom-green/10 text-custom-green"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => router.push('/buyer/post-job/skills')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Frequency</h2>
                <p className="text-gray-600">{jobData.frequency}</p>
              </div>
              <button 
                onClick={() => router.push('/buyer/post-job/frequency')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            onClick={() => router.push('/buyer/post-job/skills')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 text-sm font-medium rounded-md ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-custom-green text-white hover:bg-custom-green/90'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
