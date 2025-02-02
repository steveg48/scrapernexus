'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import JobsList from './JobsList';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Fetch jobs when user changes
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
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
              project_posting_id,
              skill_id,
              skills (
                id,
                name
              )
            )
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        if (data) {
          const formattedJobs = data.map(job => ({
            id: job.project_postings_id,
            title: job.title || 'Untitled Project',
            description: job.description || '',
            created_at: job.created_at,
            status: job.status || 'open',
            data_fields: job.data_fields || {},
            frequency: job.frequency || 'one_time',
            skills: job.project_skills?.map((ps: any) => ({
              skill_id: ps.skill_id,
              name: ps.skills?.name || 'Unknown Skill'
            })) || []
          }));
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('project_postings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_postings',
          filter: `buyer_id=eq.${user.id}`
        },
        () => {
          // When a change occurs, fetch the latest data
          const fetchLatestJobs = async () => {
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
                  project_posting_id,
                  skill_id,
                  skills (
                    id,
                    name
                  )
                )
              `)
              .eq('buyer_id', user.id)
              .order('created_at', { ascending: false });

            if (!jobsError && data) {
              const formattedJobs = data.map(job => ({
                id: job.project_postings_id,
                title: job.title || 'Untitled Project',
                description: job.description || '',
                created_at: job.created_at,
                status: job.status || 'open',
                data_fields: job.data_fields || {},
                frequency: job.frequency || 'one_time',
                skills: job.project_skills?.map((ps: any) => ({
                  skill_id: ps.skill_id,
                  name: ps.skills?.name || 'Unknown Skill'
                })) || []
              }));
              setJobs(formattedJobs);
            }
          };

          fetchLatestJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your Dashboard</h1>
        <Link
          href="/buyer/post-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Post a New Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <JobsList jobs={currentJobs} loading={loading} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}