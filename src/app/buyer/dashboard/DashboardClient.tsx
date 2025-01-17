'use client';

import JobsList from './JobsList';
import Link from 'next/link';

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

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <JobsList jobs={initialJobs} />
      </div>
    </main>
  );
}
