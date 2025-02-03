'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JobDetail {
  project_postings_id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_fixed_price: number | null;
  project_budget_type: string;
  project_location: string;
  project_scope: string;
  project_skills: Array<{
    skill_id: number;
    skills: {
      skill_name: string;
    };
  }>;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from('project_postings')
          .select(`
            *,
            project_skills (
              skill_id,
              skills (
                skill_name
              )
            )
          `)
          .eq('project_postings_id', params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Job not found');

        setJob(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err instanceof Error ? err.message : 'Error loading job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error || 'Job not found'}</p>
          </div>
          <Link href="/buyer/dashboard" className="mt-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatBudget = () => {
    if (job.project_budget_type === 'fixed') {
      return job.budget_fixed_price ? `Fixed Price: $${job.budget_fixed_price}` : 'Budget not specified';
    } else {
      const min = job.budget_min ? `$${job.budget_min}` : '';
      const max = job.budget_max ? `$${job.budget_max}` : '';
      return min && max ? `Hourly Rate: ${min} - ${max}` : 'Budget not specified';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/buyer/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800">
                {job.status}
              </span>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Budget</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatBudget()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{job.frequency}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{job.project_location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Scope</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{job.project_scope}</dd>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <div className="mt-3 prose prose-sm max-w-none text-gray-500">
                  {job.description}
                </div>
              </div>

              {job.project_skills && job.project_skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Required Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.project_skills.map((skill) => (
                      <span
                        key={skill.skill_id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill.skills.skill_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
