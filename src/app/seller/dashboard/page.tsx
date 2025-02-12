import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SellerDashboardPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
      options: {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-red-500">Please log in to view your dashboard</div>
              <a href="/auth/login" className="text-blue-500 hover:underline mt-4 inline-block">
                Go to Login
              </a>
            </div>
          </div>
        </div>
      )
    }

    // Get profile
    const profileResult = await supabase
      .from('profiles')
      .select('id, display_name, member_type, created_at')
      .eq('id', session.user.id)
      .single()

    if (profileResult.data?.member_type !== 'seller') {
      redirect('/buyer/dashboard')
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

    // Fetch job listings from the REST endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/project_postings_with_skills?order=created_at.desc`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${freshSession.access_token}`,
          'Prefer': 'return=representation'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch job listings:', await response.text());
      throw new Error('Failed to fetch job listings');
    }

    const projectPostings = await response.json();
    
    // Group the postings by project_postings_id and collect skills
    const groupedPostings = projectPostings.reduce((acc, posting) => {
      const id = posting.project_postings_id;
      
      if (!acc[id]) {
        acc[id] = {
          ...posting,
          skills: []
        };
      }
      
      // Add skill if it exists and isn't already in the array
      if (posting.skill_name && !acc[id].skills.includes(posting.skill_name)) {
        acc[id].skills.push(posting.skill_name);
      }
      
      return acc;
    }, {});

    // Convert the grouped object back to an array
    const uniquePostings = Object.values(groupedPostings);
    console.log('First grouped posting:', uniquePostings[0]);

    const postings = uniquePostings.map((posting) => ({
      id: posting.project_postings_id,
      title: posting.title || 'Untitled Project',
      description: posting.description?.substring(0, 150) + '...',
      created_at: posting.created_at,
      frequency: posting.frequency || 'one_time',
      budget_min: posting.budget_min,
      budget_max: posting.budget_max,
      buyer_name: posting.buyer_name || 'Anonymous',
      project_type: posting.project_type,
      project_location: posting.project_location,
      skills: posting.skills || []
    }));

    console.log('First mapped posting with skills:', postings[0]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardClient
            initialProfile={profileResult.data || { display_name: session.user.email }}
            jobPostings={postings}
            totalPostings={postings.length}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
