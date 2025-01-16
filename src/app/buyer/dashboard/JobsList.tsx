'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: any;
  frequency: string;
}

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs }: JobsListProps) {
  if (!jobs || !Array.isArray(jobs)) {
    return null;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No jobs posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div 
          key={job.id}
          className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 mt-1">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full text-gray-400"
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" 
                />
              </svg>
            </div>
            <div>
              <Link 
                href={`/buyer/jobs/details/${job.id}`}
                className="text-base font-medium text-gray-900 hover:text-gray-700"
              >
                {job.title}
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                Created {format(new Date(job.created_at), 'MMMM do, yyyy \'at\' h:mm a')}
              </div>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-500">
              Open Job Posting
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
