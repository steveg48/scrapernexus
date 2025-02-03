'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  skills: {
    skill_id: string;
    name: string;
  }[];
}

interface JobsListProps {
  jobs: Job[];
  loading?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `Created ${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}`;
};

export default function JobsList({ jobs, loading = false }: JobsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading job postings...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-600">
        No job postings yet. Click &quot;Post a job&quot; to create your first job posting.
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      {currentJobs.map((job) => (
        <Link 
          href={`/buyer/jobs/${job.id}`}
          key={job.id} 
          className="block w-[800px] bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{formatDate(job.created_at)}</p>
              </div>
              <span className="text-sm text-gray-500 capitalize">{job.status}</span>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600 truncate">{job.description}</p>
            </div>
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill) => (
                  <span
                    key={skill.skill_id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            PREV
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1
                ? 'border-gray-400 bg-gray-100 text-gray-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}
