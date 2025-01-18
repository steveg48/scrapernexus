'use client';

import JobsList from './JobsList';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useState } from 'react';

interface UserProfile {
  id?: string;
  display_name: string;
  member_type?: string;
  created_at?: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: any;
  frequency: string;
}

interface DashboardClientProps {
  initialProfile: UserProfile;
  initialJobs: Job[];
}

export default function DashboardClient({ initialProfile, initialJobs }: DashboardClientProps) {
  const firstName = initialProfile?.display_name?.split(' ')[0] || 'there';
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Calculate pagination values
  const totalJobs = initialJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = initialJobs.slice(startIndex, endIndex);

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
              Hi, {firstName}
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
