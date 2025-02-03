'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import JobsList from './JobsList';

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

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      
      try {
        const supabase = createClientComponentClient();
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
            project_skills (
              skill_id,
              skills (
                skill_name
              )
            )
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        if (data) {
          setJobs(
            data.map((job) => ({
              id: job.project_postings_id,
              title: job.title || 'Untitled Project',
              description: job.description || '',
              created_at: job.created_at,
              status: job.status || 'active',
              data_fields: job.data_fields || {},
              frequency: job.frequency || 'one_time',
              skills: job.project_skills?.map((ps: any) => ({
                skill_id: ps.skill_id,
                name: ps.skills?.skill_name || 'Unknown Skill'
              })) || []
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return (
    <div className="py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-[800px] flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <Link
          href="/buyer/post-job"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-custom-green hover:bg-hover-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-green"
        >
          Post a Job
        </Link>
      </div>

      {loading && (
        <div className="text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
          <div className="mt-6">
            <Link
              href="/buyer/post-job"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-custom-green hover:bg-hover-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-green"
            >
              Post a Job
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <JobsList jobs={jobs} loading={loading} />
      )}
    </div>
  );
}