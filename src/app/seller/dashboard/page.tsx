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

    // Get latest 3 project postings with skills for current page
    const { data: projectPostings } = await supabase
      .from('project_postings_with_skills')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    console.log('Profile:', profileResult.data)
    console.log('Project Postings with Skills:', projectPostings)
    console.log('Total postings:', count)

    const postings = projectPostings?.map((posting) => ({
      id: posting.id,
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
      <DashboardClient
        initialProfile={profileResult.data || { display_name: session.user.email }}
        jobPostings={postings}
        totalPostings={count || 0}
      />
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
