'use client'

import { useEffect, useState } from 'react';
import { File } from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';
import Pagination from '@/components/Pagination';

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

interface Job {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch jobs');
        }
        
        setJobs(data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading jobs. Please try refreshing the page.
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No job postings yet. Click "Post a job" to create your first job posting.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    <File className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{job.title || 'Untitled'}</h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-[#59baea] text-white">
                  Open job post
                </span>
                <span className="text-gray-500 text-sm">
                  Created {formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination totalItems={13} />
    </div>
  );
}
