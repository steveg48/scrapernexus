'use client';

import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase';
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
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const supabase = getBrowserClient();

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('project_postings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_postings',
        },
        async (payload) => {
          // Refresh the jobs list when changes occur
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: updatedJobs } = await supabase
              .from('project_postings')
              .select('*')
              .eq('buyer_id', user.id)
              .order('created_at', { ascending: false });

            if (updatedJobs) {
              setJobs(updatedJobs.map(job => ({
                id: job.project_postings_id,
                title: job.title || 'Untitled Project',
                description: job.description || '',
                created_at: job.created_at,
                status: job.status || 'open',
                data_fields: job.data_fields || {},
                frequency: job.frequency || 'one_time',
              })));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hi, {initialProfile.display_name.split(' ')[0]}
                </h1>
              </div>
              <Link href="/buyer/post-job" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Post a Job
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
            <JobsList jobs={currentJobs} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 mb-8">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        pageNum === currentPage
                          ? 'bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}