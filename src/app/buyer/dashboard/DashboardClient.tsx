'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  budget_min?: number;
  budget_max?: number;
  skills?: {
    skill_id: string;
    name: string;
  }[];
}

interface Profile {
  display_name: string;
  member_type?: string;
  created_at?: string;
}

interface DashboardClientProps {
  initialProfile: Profile;
  initialJobs: Job[];
}

export default function DashboardClient({ initialProfile, initialJobs }: DashboardClientProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs when user changes
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const { data, error: jobsError } = await supabase
          .from('project_postings')
          .select(`
            project_postings_id,
            title,
            description,
            created_at,
            status,
            data_fields,
            frequency,
            budget_min,
            budget_max,
            project_skills (
              skill_id,
              skills (
                skill_name
              )
            )
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          setError('Unable to load your jobs. Please try refreshing the page.');
          return;
        }

        if (data) {
          const formattedJobs = data.map(job => ({
            id: job.project_postings_id,
            title: job.title || 'Untitled Project',
            description: job.description || '',
            created_at: job.created_at,
            status: job.status || 'active',
            data_fields: job.data_fields || {},
            frequency: job.frequency || 'weekly',
            budget_min: job.budget_min,
            budget_max: job.budget_max,
            skills: job.project_skills?.map((ps: any) => ({
              skill_id: ps.skill_id,
              name: ps.skills?.skill_name || 'Unknown Skill'
            })) || []
          }));
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error('Error in fetchJobs:', error);
        setError('An error occurred while loading your jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Hi, {initialProfile.display_name}</h1>
          <p className="text-gray-600">Overview</p>
        </div>
        <Link href="/buyer/jobs/create" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Post a Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {jobs.slice(0, 5).map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Created {formatDate(job.created_at)}</p>
                </div>
                <span className="text-sm text-gray-500 capitalize">{job.status}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 truncate">{job.description}</p>
              </div>
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.skill_id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {jobs.length > 5 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
              disabled={true}
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
              Page 1 of {Math.ceil(jobs.length / 5)}
            </span>
            <button
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
              disabled={jobs.length <= 5}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}