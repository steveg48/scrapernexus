'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import JobsList from './JobsList';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Job {
  project_postings_id: number;
  title: string;
  created_at: string;
  project_status: string;
}

export default function DashboardClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user?.email) {
          setUserEmail(user.email);
        }

        const { data: jobsData, error: jobsError } = await supabase
          .from('project_postings')
          .select('*')
          .eq('buyer_id', user?.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // Calculate pagination values
  const totalJobs = jobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-medium text-gray-900">
              Hi, {userEmail || 'there'}
            </h1>
            <Link
              href="/buyer/post-job"
              className="inline-flex items-center px-4 py-2 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-sm font-medium"
            >
              + Post a job
            </Link>
          </div>

          <h2 className="text-xl font-medium text-gray-900 mb-6">Overview</h2>
          
          <div className="px-6">
            <JobsList jobs={currentJobs} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, totalJobs)}</span> of{' '}
                    <span className="font-medium">{totalJobs}</span> jobs
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === pageNumber
                            ? 'bg-[#59baea] text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
