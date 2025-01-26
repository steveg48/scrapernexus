'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import JobDetailsClient from './JobDetailsClient';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  created_at: string;
  budget_min?: number;
  budget_max?: number;
  buyer_name: string;
  project_type?: string;
  project_location?: string;
  skills: string[];
  payment_verified: boolean;
  rating: number;
  reviews_count: number;
  total_spent: number;
  hire_rate: number;
  jobs_posted: number;
  hours_billed: number;
  connects_required: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!params.id) return;

      try {
        const { data, error } = await supabase
          .from('project_postings_with_skills')
          .select()
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Error fetching job details:', error);
          setError('Failed to load job details. Please try again.');
          return;
        }

        if (data) {
          setJob({
            ...data,
            payment_verified: true,
            rating: 4.5,
            reviews_count: 10,
            total_spent: 5000,
            hire_rate: 80,
            jobs_posted: 15,
            hours_billed: 1000
          });
        }
      } catch (err) {
        console.error('Error in fetchJobDetails:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id, supabase]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error || 'Failed to load job details'}
      </div>
    );
  }

  return <JobDetailsClient job={job} />;
}
