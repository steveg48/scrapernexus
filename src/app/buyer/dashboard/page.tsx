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

    const [profileResult, jobsResult] = await Promise.all([
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
          project_skills (
            project_id,
            skill_id,
            skills (
              id,
              name
            )
          )
        `)
        .eq('buyer_id', session.user.id)
        .order('created_at', { ascending: false }),
    ])

    if (jobsResult.error) {
      console.error('Error fetching jobs:', jobsResult.error)
      throw new Error(jobsResult.error.message)
    }

    if (profileResult.error) {
      console.error('Error fetching profile:', profileResult.error)
      // Don't throw here, just use email as display name
    }

    return (
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
            skills: job.project_skills?.map((ps: any) => ({
              skill_id: ps.skill_id,
              name: ps.skills?.name || 'Unknown Skill'
            })) || []
          })) || []
        }
      />
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We're having trouble loading your dashboard. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    )
  }
}