'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import JobsList from './JobsList';

interface UserProfile {
  id: string;
  display_name: string;
  member_type: string;
  created_at: string;
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
  const router = useRouter();
  const [profile] = useState<UserProfile>(initialProfile);
  const [jobs] = useState<Job[]>(initialJobs);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              ScrapeNexus
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/messages" className="text-gray-600 hover:text-gray-900">
                Messages
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">
            Hi, {profile.display_name?.split(' ')[0] || 'there'}
          </h1>
          <Link
            href="/buyer/post-job"
            className="inline-flex items-center px-4 py-2 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-sm font-medium"
          >
            + Post a job
          </Link>
        </div>

        <h2 className="text-xl font-medium text-gray-900 mb-6">Overview</h2>
        
        <div>
          <JobsList jobs={jobs} />
          {jobs.length > 0 && (
            <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
              <div>1 - {jobs.length} of {jobs.length} job posts</div>
              <div className="flex items-center gap-2">
                <span>1</span>
                <button 
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
