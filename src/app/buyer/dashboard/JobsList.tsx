'use client';

import { File } from 'lucide-react';
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

interface JobsListProps {
  jobs: Job[];
  loading?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

export default function JobsList({ jobs, loading }: JobsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading job postings...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No job postings yet. Click "Post a job" to create your first job posting.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/buyer/jobs/details/${job.id}`}
          className="block group"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  <File className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{job.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-500">Created {formatDate(job.created_at)} | {job.status}</p>
                </div>
              </div>

              <div className="px-4 py-2 bg-[#59baea] text-white rounded-md text-sm font-medium">
                {job.status === 'open' ? 'Open Job Posting' : job.status}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
