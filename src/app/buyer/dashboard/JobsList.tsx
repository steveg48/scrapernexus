'use client'

import { useEffect, useState } from 'react';
import { File } from 'lucide-react';
import Link from 'next/link';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
  // Add the ordinal suffix to the day
  const day = date.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || day % 100 - day % 10 == 10) ? 0 : day % 10];
  
  // Replace the day number with the day number + suffix
  return formattedDate.replace(/(\d+),/, `$1${suffix},`);
};

interface Job {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs }: JobsListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No job postings yet. Click "Post a job" to create your first job posting.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link href={`/buyer/jobs/${job.id}`} key={job.id}>
          <div className="bg-white border border-gray-200 p-6 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                <File className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created {formatDate(job.created_at)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Open job post
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
