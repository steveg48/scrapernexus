import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect('/auth/login')
    }

    // Get profile and project postings
    const [profileResult, projectPostingsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, member_type, created_at')
        .eq('id', session.user.id)
        .single(),
      supabase
        .from('project_postings')
        .select(`
          *,
          profiles:buyer_id (display_name)
        `)
        .order('created_at', { ascending: false })
    ])

    if (profileResult.data?.member_type !== 'seller') {
      redirect('/buyer/dashboard')
    }

    // Debug logs
    console.log('Profile Result:', profileResult)
    console.log('Project Postings Result:', projectPostingsResult)
    
    // If there's an error in the query, log it
    if (projectPostingsResult.error) {
      console.error('Error fetching project postings:', projectPostingsResult.error)
    }

    // Log the number of postings found
    console.log('Number of postings found:', projectPostingsResult.data?.length || 0)

    const postings = projectPostingsResult.data?.map((posting) => {
      console.log('Processing posting:', posting) // Log each posting
      return {
        id: posting.project_postings_id,
        title: posting.title || 'Untitled Project',
        description: posting.description || '',
        created_at: posting.created_at,
        status: posting.status || 'active',
        data_fields: posting.data_fields || {},
        frequency: posting.frequency || 'one_time',
        budget: posting.budget_max || posting.budget_min || 0,
        buyer_name: posting.profiles?.display_name || 'Anonymous',
        project_scope: posting.project_scope,
        project_type: posting.project_type,
        project_location: posting.project_location
      }
    }) || []

    console.log('Processed postings:', postings) // Log processed postings

    return (
      <DashboardClient
        initialProfile={profileResult.data || { display_name: session.user.email }}
        jobPostings={postings}
      />
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
