'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface JobDetailsClientProps {
  projectId: string;
  session: Session;
}

export default function JobDetailsClient({ projectId, session }: JobDetailsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const id = Number(projectId);
        if (isNaN(id)) {
          throw new Error('Invalid project ID');
        }

        // Fetch job details, skills, and favorite status
        const [
          { data: jobData, error: jobError }, 
          { data: skillsData, error: skillsError },
          { data: favoriteData, error: favoriteError }
        ] = await Promise.all([
          supabase
            .from('project_postings')
            .select()
            .eq('project_postings_id', projectId)
            .single(),
          supabase
            .from('project_skills')
            .select(`
              skill_id,
              skills (
                skill_name
              )
            `)
            .eq('project_posting_id', projectId),
          supabase
            .from('seller_favorites')
            .select()
            .eq('project_posting_id', projectId)
            .eq('seller_id', session.user.id)
            .single()
        ]);

        if (jobError) throw jobError;
        if (skillsError) throw skillsError;
        
        // Set favorite status
        setIsFavorite(!!favoriteData);

        const skills = skillsData?.map(skill => skill.skills.skill_name) || [];

        setJob({
          id: jobData.project_postings_id.toString(),
          title: jobData.title || 'Untitled',
          description: jobData.description || '',
          created_at: jobData.created_at,
          budget_min: jobData.budget_min,
          budget_max: jobData.budget_max,
          buyer_name: jobData.buyer_name || '',
          project_type: jobData.project_type || '',
          project_location: jobData.project_location || '',
          skills: skills,
          payment_verified: true,
          rating: 4.5,
          reviews_count: 10,
          total_spent: 5000,
          hire_rate: 80,
          jobs_posted: 15,
          hours_billed: 1000,
          connects_required: 4
        });
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err instanceof Error ? err.message : 'Error loading job details');
      }
    };

    fetchJobDetails();
  }, [projectId, supabase, session.user.id]);

  const handleFavorite = async () => {
    try {
      const { data, error } = isFavorite
        ? await supabase
            .from('seller_favorites')
            .delete()
            .eq('project_posting_id', projectId)
            .eq('seller_id', session.user.id)
        : await supabase
            .from('seller_favorites')
            .insert([
              {
                project_posting_id: projectId,
                seller_id: session.user.id
              }
            ])
            .select();

      if (error) {
        console.error('Error toggling favorite:', error);
        return;
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number | undefined) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">{error}</div>
        <Link href="/seller/jobs" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="border-b border-gray-200">
            <div className="p-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Posted {formatDate(job.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex">
            {/* Left column */}
            <div className="flex-[2] p-6 border-r border-gray-200">
              <div className="space-y-8">
                <div className="min-h-[200px]">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>

                <div className="min-h-[120px]">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">
                        {formatBudget(job.budget_min)} - {formatBudget(job.budget_max)}
                      </p>
                    </div>

                    {job.project_type && (
                      <div>
                        <p className="text-sm text-gray-500">Project Type</p>
                        <p className="font-medium">{job.project_type}</p>
                      </div>
                    )}

                    {job.project_location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <p className="font-medium">{job.project_location}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500">Connects Required</p>
                      <p className="font-medium">{job.connects_required}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1">
              <div className="flex flex-col gap-3 items-center p-6">
                <button 
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full max-w-[200px]"
                  onClick={() => router.push(`/seller/jobs/apply/${job.id}`)}
                >
                  Apply now
                </button>
                <button 
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full max-w-[200px]"
                  onClick={handleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save job'}
                </button>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <p className="font-medium">{job.buyer_name}</p>
                      {job.payment_verified && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Payment Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{job.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({job.reviews_count} reviews)
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(job.total_spent)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Hire Rate</p>
                      <p className="font-medium">{job.hire_rate}%</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Jobs Posted</p>
                      <p className="font-medium">{job.jobs_posted}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Hours Billed</p>
                      <p className="font-medium">{job.hours_billed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}