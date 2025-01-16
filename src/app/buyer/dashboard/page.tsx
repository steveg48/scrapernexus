import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

async function getData() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [profileResult, jobsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, member_type, created_at')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('project_postings')
      .select('project_postings_id, title, description, created_at, status, data_fields, frequency')
      .eq('buyer_id', session.user.id)
      .order('created_at', { ascending: false })
  ]);

  if (profileResult.error) throw profileResult.error;
  if (jobsResult.error) throw jobsResult.error;

  const transformedJobs = jobsResult.data?.map(job => ({
    id: job.project_postings_id,
    title: job.title || 'Untitled Project',
    description: job.description || '',
    created_at: job.created_at,
    status: job.status || 'open',
    data_fields: job.data_fields || {},
    frequency: job.frequency || 'one_time'
  })) || [];

  return {
    profile: profileResult.data,
    jobs: transformedJobs
  };
}

export default async function Dashboard() {
  try {
    const data = await getData();
    
    return (
      <div className="min-h-screen bg-white">
        <DashboardClient 
          initialProfile={data.profile} 
          initialJobs={data.jobs} 
        />
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">Error loading dashboard. Please try refreshing the page.</div>
          </div>
        </div>
      </div>
    );
  }
}