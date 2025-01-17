import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import TopNavigation from '@/components/TopNavigation'

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
        .order('created_at', { ascending: false }),
    ])

    return (
      <>
        <TopNavigation />
        <DashboardClient
          initialProfile={profileResult.data || { display_name: session.user.email }}
          initialJobs={
            jobsResult.data?.map((job) => ({
              id: job.project_postings_id,
              title: job.title || 'Untitled Project',
              description: job.description || '',
              created_at: job.created_at,
              status: job.status || 'open',
              data_fields: job.data_fields || {},
              frequency: job.frequency || 'one_time',
            })) || []
          }
        />
      </>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return <div>Error loading dashboard. Please try again.</div>
  }
}