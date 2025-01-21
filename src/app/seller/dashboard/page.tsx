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

    const [profileResult, projectsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, member_type, created_at')
        .eq('id', session.user.id)
        .single(),
      supabase
        .from('project_postings')
        .select('project_postings_id, title, description, created_at, status, data_fields, frequency')
        .eq('seller_id', session.user.id)
        .order('created_at', { ascending: false }),
    ])

    if (profileResult.data?.member_type !== 'seller') {
      redirect('/buyer/dashboard')
    }

    return (
      <DashboardClient
        initialProfile={profileResult.data || { display_name: session.user.email }}
        initialProjects={
          projectsResult.data?.map((project) => ({
            id: project.project_postings_id,
            title: project.title || 'Untitled Project',
            description: project.description || '',
            created_at: project.created_at,
            status: project.status || 'open',
            data_fields: project.data_fields || {},
            frequency: project.frequency || 'one_time',
          })) || []
        }
      />
    )
  } catch (error) {
    console.error('Error in seller dashboard:', error)
    redirect('/auth/login')
  }
}
