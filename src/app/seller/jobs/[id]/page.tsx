import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import JobDetailsClient from './JobDetailsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Check authentication
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
  }

  if (!session) {
    const returnUrl = `/seller/jobs/${params.id}`;
    return redirect(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }

  try {
    // Convert id to number
    const projectId = Number(params.id);
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID');
    }

    // Get a fresh session token
    const { data: { session: freshSession }, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Error refreshing session:', refreshError);
      return redirect('/auth/login');
    }

    if (!freshSession) {
      console.error('No fresh session available');
      return redirect('/auth/login');
    }

    // Fetch job details from the REST endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/project_postings_with_skills?project_postings_id=eq.${projectId}`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${freshSession.access_token}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error('Job not found');
    }

    const jobData = data[0];
    const job = {
      id: jobData.project_postings_id.toString(),
      title: jobData.title || 'Untitled',
      description: jobData.description || '',
      created_at: jobData.created_at,
      budget_min: jobData.budget_min,
      budget_max: jobData.budget_max,
      buyer_name: jobData.buyer_name || '',
      project_type: jobData.project_type || '',
      project_location: jobData.project_location || '',
      skills: jobData.skills || [],
      payment_verified: true,
      rating: 4.5,
      reviews_count: 10,
      total_spent: 5000,
      hire_rate: 80,
      jobs_posted: 15,
      hours_billed: 1000,
      connects_required: 4
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <JobDetailsClient job={job} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in job details page:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500">Error loading job details</div>
            <a href="/seller/jobs" className="text-blue-500 hover:underline mt-4 inline-block">
              Back to Jobs
            </a>
          </div>
        </div>
      </div>
    );
  }
}
