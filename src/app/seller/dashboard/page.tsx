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

    // Get total count for pagination
    const { count } = await supabase
      .from('project_postings_with_skills')
      .select('*', { count: 'exact', head: true })

    // Get all project postings with skills
    const { data: projectPostings } = await supabase
      .from('project_postings_with_skills')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Project Postings with Skills:', projectPostings)

    // Filter out duplicate jobs
    const uniquePostings = projectPostings?.filter((posting, index, self) =>
      index === self.findIndex((p) => p.project_postings_id === posting.project_postings_id)
    );

    const postings = uniquePostings?.map((posting) => ({
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
    })) || []

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardClient
            initialProfile={profileResult.data || { display_name: session.user.email }}
            jobPostings={postings}
            totalPostings={count || 0}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
