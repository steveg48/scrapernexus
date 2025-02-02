'use client';

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

    console.log('Session:', JSON.stringify(session, null, 2));

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
            project_posting_id,
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

    console.log('Profile result:', JSON.stringify(profileResult, null, 2));
    console.log('Jobs result:', JSON.stringify(jobsResult, null, 2));

    if (profileResult.error) {
      console.error('Profile error:', profileResult.error);
      throw profileResult.error;
    }

    if (jobsResult.error) {
      console.error('Jobs error:', jobsResult.error);
      throw jobsResult.error;
    }

    const profile = profileResult.data;
    const jobs = jobsResult.data || [];

    return (
      <>
        <DashboardClient
          initialProfile={profile || { display_name: session.user.email }}
          initialJobs={jobs.map((job) => ({
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
          }))}
        />
      </>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return <div>Error loading dashboard. Please try again.</div>
  }
}