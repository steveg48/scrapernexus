'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Star, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface JobDetailsClientProps {
  projectId: string;
  session: Session;
}

export default function JobDetailsClient({ projectId, session }: JobDetailsClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
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

        // Fetch job details and skills using Supabase client
        const [{ data: jobData, error: jobError }, { data: skillsData, error: skillsError }] = await Promise.all([
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
            .eq('project_posting_id', projectId)
        ]);

        console.log('Job Data:', jobData);
        console.log('Job Error:', jobError);
        console.log('Skills Data:', skillsData);
        console.log('Skills Error:', skillsError);

        if (jobError) throw jobError;
        if (skillsError) throw skillsError;
        if (!jobData) throw new Error('Job not found');

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
  }, [projectId, supabase]);

  // Check if job is already favorited when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('project_posting_id')
          .eq('seller_id', user.id);

        if (error) throw error;

        const isFavorited = data.some((fav: any) => fav.project_posting_id === job?.id);
        setIsLiked(isFavorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (job) {
      checkFavoriteStatus();
    }
  }, [user, job, supabase]);

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

  const handleFavoriteClick = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('seller_id', user.id)
          .eq('project_posting_id', job.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            seller_id: user.id,
            project_posting_id: job.id
          });

        if (error) throw error;
      }

      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislikeClick = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
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
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Posted {formatDate(job.created_at)}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`p-2 rounded-full ${
                isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-100 hover:text-red-600 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={handleDislikeClick}
              className={`p-2 rounded-full ${
                isDisliked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-100 hover:text-red-600 transition-colors`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left column - Job details */}
        <div className="col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Client info and activity */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
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
  );
}
