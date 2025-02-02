'use client';

import { File } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  skills?: {
    skill_id: string;
    name: string;
  }[];
}

interface JobsListProps {
  jobs: Job[];
  loading: boolean;
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
  const [likedJobs, setLikedJobs] = useState<string[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<string[]>([]);
  const { user } = useAuth();

  // Fetch initial favorites state
  useEffect(() => {
    if (!user?.id) return;

    const fetchFavorites = async () => {
      try {
        // Try to load from localStorage first for immediate state
        const storedLikedJobs = localStorage.getItem(`likedJobs_${user.id}`);
        if (storedLikedJobs) {
          const parsedJobs = JSON.parse(storedLikedJobs);
          setLikedJobs(parsedJobs);
        }

        const response = await fetch(`https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/seller_favorites?select=project_postings_id&seller_id=eq.${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Prefer': 'return=representation'
          }
        });

        if (response.ok) {
          const favorites = await response.json();
          const favoriteJobIds = favorites.map((fav: any) => fav.project_postings_id.toString());
          setLikedJobs(favoriteJobIds);
          localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(favoriteJobIds));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs posted</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
        <div className="mt-6">
          <Link
            href="/buyer/post-job"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post a Job
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {jobs.map((job) => (
        <div key={job.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              <Link href={`/buyer/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              job.status === 'open' ? 'bg-green-100 text-green-800' :
              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.description}</p>
          {job.skills && job.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill.skill_id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500">
            Posted {formatDate(job.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
}
