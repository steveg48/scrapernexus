'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import JobsList from './JobsList';

interface Job {
  project_postings_id: number;
  title: string;
  created_at: string;
  project_status: string;
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

export default function JobsListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const { data: projectPostings, error: projectsError } = await supabase
          .from('project_postings')
          .select('project_postings_id, title, created_at, project_status')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (projectsError) {
          throw projectsError;
        }

        setJobs(projectPostings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [supabase]);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <JobsList jobs={jobs} />
  );
}
