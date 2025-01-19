'use client';

import { File } from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';
import ReviewButton from '@/components/ReviewButton';
import Link from 'next/link';

interface Job {
  project_postings_id: number;
  title: string;
  created_at: string;
  project_status: string;
}

interface JobsListProps {
  jobs: Job[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const minuteStr = minute.toString().padStart(2, '0');

  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || day % 100 - day % 10 == 10) ? 0 : day % 10];
  return `${month} ${day}${suffix}, ${year} at ${hour12}:${minuteStr} ${period}`;
};

export default function JobsList({ jobs }: JobsListProps) {
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
        <div key={job.project_postings_id} className="bg-white border border-gray-200 p-6">
          <Link href={`/buyer/jobs/details/${job.project_postings_id}`} className="block">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {job.project_status === 'active' ? (
                    <div className="flex items-center gap-3">
                      <ProfileImage size="sm" />
                      <div>
                        <h3 className="text-lg font-medium">{job.title || 'Untitled'}</h3>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                        <File className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{job.title || 'Untitled'}</h3>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {(!job.project_status || job.project_status === 'open') && (
                    <>
                      <ReviewButton jobId={job.project_postings_id} />
                      <span className="px-4 py-2 bg-[#59baea] text-white rounded-md text-sm font-medium">
                        Open Job Posting
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className={`inline-flex items-center px-3 py-1 text-sm rounded-md ${
                  job.project_status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-[#59baea] text-white'
                }`}>
                  {job.project_status === 'active' ? 'Active contract' : 'Open Job Posting'}
                </span>
                <span className="text-gray-500 text-sm">Created {formatDate(job.created_at)}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
