'use client';

import { Heart, Flag, MapPin, Clock, Building2, Calendar, DollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  created_at: string;
  budget_min?: number;
  budget_max?: number;
  buyer_name: string;
  project_type?: string;
  project_location?: string;
  skills: string[];
  payment_verified: boolean;
  rating: number;
  reviews_count: number;
  total_spent: number;
  hire_rate: number;
  jobs_posted: number;
  hours_billed: number;
  connects_required: number;
}

interface JobDetailsClientProps {
  job: JobDetails;
}

export default function JobDetailsClient({ job }: JobDetailsClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: 'sb-access-token'
      }
    }
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const returnUrl = window.location.pathname;
          router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: savedJob } = await supabase
          .from('saved_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('job_id', job.id)
          .single();

        setIsSaved(!!savedJob);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkSavedStatus();
  }, [job.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleSaveJob = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const returnUrl = window.location.pathname;
        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }

      if (isSaved) {
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', session.user.id)
          .eq('job_id', job.id);
      } else {
        await supabase
          .from('saved_jobs')
          .upsert({
            user_id: session.user.id,
            job_id: job.id,
            saved_at: new Date().toISOString()
          });
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content */}
      <div className="col-span-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-sm text-gray-600">
                <span>Posted {formatDate(job.created_at)}</span>
                {job.project_location && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.project_location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="border-t border-b py-4 my-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Less than 30 hrs/week
                </div>
                <div className="text-sm text-gray-500">Project Length: Less than 1 month</div>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Users className="h-4 w-4 mr-2" />
                  Expert
                </div>
                <div className="text-sm text-gray-500">I am willing to pay higher rates for the most experienced freelancers</div>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {job.budget_min && job.budget_max ? (
                    <>${job.budget_min} - ${job.budget_max}</>
                  ) : (
                    <>Budget: ${job.budget_min || job.budget_max || 'Not specified'}</>
                  )}
                </div>
                <div className="text-sm text-gray-500">Project Type: {job.project_type || 'One-time project'}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Project Description</h2>
            <div className="prose max-w-none text-gray-600">
              <p>{job.description}</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-medium mb-3">Skills and Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Activity on this job</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Connects required</div>
              <div className="font-medium">{job.connects_required}</div>
            </div>
            <div>
              <div className="text-gray-600">Available Connects</div>
              <div className="font-medium">81</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 mb-4">
            Apply now
          </button>
          <button 
            onClick={handleSaveJob}
            className={`w-full border rounded-md py-2 px-4 flex items-center justify-center gap-2 mb-4 ${
              isSaved 
                ? 'bg-green-50 border-green-600 text-green-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-green-600' : ''}`} />
            {isSaved ? 'Saved' : 'Save job'}
          </button>
          <button className="w-full text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
            <Flag className="h-5 w-5" />
            Flag as inappropriate
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">About the client</h2>
          <div className="space-y-4">
            {job.payment_verified && (
              <div className="flex items-center text-green-600">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment method verified
              </div>
            )}
            <div>
              <div className="flex items-center mb-1">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium">{job.rating.toFixed(1)}</span>
                <span className="text-gray-600 text-sm ml-1">
                  ({job.reviews_count} reviews)
                </span>
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">{job.jobs_posted} jobs posted</div>
              <div className="text-gray-600">{job.hire_rate}% hire rate, {job.hours_billed} hours billed</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Member since {formatDate(job.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
