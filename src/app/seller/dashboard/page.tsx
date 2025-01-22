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
          project_postings_id,
          title,
          description,
          created_at,
          frequency,
          budget_min,
          budget_max,
          project_type,
          project_location,
          buyer_id,
          buyer:profiles!project_postings_buyer_id_fkey (display_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    ])

    if (profileResult.data?.member_type !== 'seller') {
      redirect('/buyer/dashboard')
    }

    // Debug logs
    console.log('Project Postings Result:', projectPostingsResult)

    const postings = projectPostingsResult.data?.map((posting) => ({
      id: posting.project_postings_id,
      title: posting.title || 'Untitled Project',
      description: posting.description || '',
      created_at: posting.created_at,
      frequency: posting.frequency || 'one_time',
      budget: posting.budget_max || posting.budget_min || 0,
      buyer_name: posting.buyer?.display_name || 'Anonymous',
      project_type: posting.project_type,
      project_location: posting.project_location
    })) || []

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
