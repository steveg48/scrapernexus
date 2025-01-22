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
          status,
          data_fields,
          frequency,
          budget_min,
          budget_max,
          project_scope,
          project_type,
          project_location,
          buyer_id,
          profiles:buyer_id (display_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    ])

    if (profileResult.data?.member_type !== 'seller') {
      redirect('/buyer/dashboard')
    }

    console.log('Project Postings:', projectPostingsResult.data) // Debug log

    return (
      <DashboardClient
        initialProfile={profileResult.data || { display_name: session.user.email }}
        jobPostings={
          projectPostingsResult.data?.map((posting) => ({
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
          })) || []
        }
      />
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
