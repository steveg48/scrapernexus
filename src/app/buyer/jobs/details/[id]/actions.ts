'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = 'https://exqsnrdlctgxutmwpjua.supabase.co'
const supabase = createServerActionClient({ cookies: () => cookies() })

export async function getJobDetails(jobId: string) {
  try {
    const projectId = Number(jobId)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    // Get the current session for the auth token
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    // Fetch job details from the REST endpoint
    const response = await fetch(
      `${supabaseUrl}/rest/v1/project_postings_with_skills?project_postings_id=eq.${projectId}`,
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

    // Format the project scope as a string
    let projectScope = ''
    if (job.project_scope) {
      const scopeValue = job.project_scope.toLowerCase()
      const scopeDescriptions = {
        large: 'Longer term or complex initiatives',
        medium: 'Well-defined projects',
        small: 'Quick and straightforward tasks'
      }
      projectScope = `${scopeValue.charAt(0).toUpperCase() + scopeValue.slice(1)} - ${scopeDescriptions[scopeValue] || ''}`
    }

    return {
      id: job.project_postings_id.toString(),
      title: job.title || 'Untitled',
      description: job.description || '',
      created_at: job.created_at,
      frequency: job.frequency || '',
      data_fields: job.data_fields || '',
      budget_min: job.budget_min,
      budget_max: job.budget_max,
      budget_fixed_price: job.budget_fixed_price,
      project_scope: projectScope,
      project_type: job.project_type || '',
      project_location: job.project_location || '',
      skills: job.skills || []
    }
  } catch (error) {
    console.error('Error fetching job details:', error)
    throw error
  }
}
