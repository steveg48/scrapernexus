import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'
import JobDetails from './JobDetails'

interface Job {
  id: string
  title: string
  description: string
  created_at: string
  frequency: string
  data_fields?: string
  budget_min?: number
  budget_max?: number
  budget_fixed_price?: number
  project_scope?: string
  project_type?: string
  project_location?: string
  skills: {
    id: string
    name: string
    category: string
  }[]
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return (
      <div className="bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500">Please log in to view job details</div>
            <a href="/auth/login" className="text-blue-500 hover:underline mt-4 inline-block">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  try {
    // Convert id to number
    const projectId = Number(params.id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    // Fetch job details from the REST endpoint
    const response = await fetch(
      `https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/project_postings_with_skills?project_postings_id=eq.${projectId}`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${session.access_token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch job details')
    }

    const data = await response.json()
    if (!data || data.length === 0) {
      throw new Error('Job not found')
    }

    const job = data[0]

    // Transform job data
    const transformedJob: Job = {
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
      skills: job.skills || []
    }

    return (
      <div className="bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 mt-4">
          <JobDetails job={transformedJob} />
        </div>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500">{error.message}</div>
            <a href="/buyer/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }
}
