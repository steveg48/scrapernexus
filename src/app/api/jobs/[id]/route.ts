import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Convert id to number
    const projectId = Number(params.id)
    if (isNaN(projectId)) {
      return new NextResponse('Invalid project ID', { status: 400 })
    }

    // Get job details with skills
    const { data: job, error: jobError } = await supabase
      .from('project_postings')
      .select(`
        *,
        project_skills!inner (
          skill_id,
          skills!inner (
            skill_id,
            skill_name,
            category_id,
            skill_categories!inner (
              category_name
            )
          )
        )
      `)
      .eq('project_postings_id', projectId)
      .single()

    if (jobError) {
      console.error('Error fetching job:', jobError)
      return new NextResponse('Failed to load job details', { status: 500 })
    }

    if (!job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    // Transform job data
    const transformedJob = {
      id: job.project_postings_id.toString(),
      title: job.title || 'Untitled',
      description: job.description || '',
      created_at: job.created_at,
      frequency: job.frequency || '',
      data_fields: job.data_fields || '',
      budget_min: job.budget_min,
      budget_max: job.budget_max,
      budget_fixed_price: job.budget_fixed_price,
      project_scope: job.project_scope || '',
      project_type: job.project_type || '',
      project_location: job.project_location || '',
      skills: job.project_skills?.map((ps: any) => ({
        id: ps.skills.skill_id.toString(),
        name: ps.skills.skill_name,
        category: ps.skills.skill_categories?.category_name || ''
      })) || []
    }

    return NextResponse.json(transformedJob)
  } catch (error: any) {
    console.error('Error in job details API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
