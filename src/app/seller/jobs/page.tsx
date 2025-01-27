import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SellerNavigation from '@/components/SellerNavigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function JobsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      redirect('/auth/login');
    }

    const { data: jobs, error: jobsError } = await supabase
      .from('project_postings')
      .select('*')
      .order('created_at', { ascending: false });

    if (jobsError) {
      throw jobsError;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <SellerNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Available Jobs</h1>
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Link 
                key={job.id} 
                href={`/seller/jobs/${job.id}`}
                className="block bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-medium text-gray-900 mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{job.project_type || 'One-time project'}</span>
                  {job.budget_min && job.budget_max && (
                    <>
                      <span className="mx-2">•</span>
                      <span>${job.budget_min} - ${job.budget_max}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in jobs page:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <SellerNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500">Error loading jobs</div>
          </div>
        </div>
      </div>
    );
  }
}
