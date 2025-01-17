'use client';

import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  created_at: string;
}

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs }: JobsListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link
            href={`/buyer/jobs/${job.id}`}
            className="text-sm text-[#59baea] hover:text-[#59baea]/80"
          >
            Open Job Posting
          </Link>
        </div>
      ))}
      {jobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs posted yet</p>
        </div>
      )}
    </div>
  );
}
