import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Navigation from '@/components/Navigation';
import JobsList from './JobsList';

export default async function Dashboard() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return (
        <div className="min-h-screen bg-white">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-red-500">
              Error: Failed to authenticate. Please try logging in again.
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-white">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              Please log in to view your dashboard.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <h1 className="text-[32px] font-normal text-gray-900">Hi, {user.email?.split('@')[0]}</h1>
            <Link 
              href="/buyer/post-job/title"
              className="inline-flex items-center px-6 py-2.5 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-base font-medium"
            >
              <span className="mr-1">+</span> Post a job
            </Link>
          </div>

          <h2 className="text-[32px] font-normal text-gray-900 mt-8 mb-6">Overview</h2>
          
          <JobsList />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500">
            An error occurred. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }
}