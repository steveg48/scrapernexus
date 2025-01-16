'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Initialize Supabase client with environment variables
const supabase = createServerActionClient({ cookies: () => cookies() })

export async function getJobDetails(jobId: string) {
  try {
    const projectId = Number(jobId)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    // Get job details without joins
    const { data: job, error: jobError } = await supabase
      .from('project_postings')
      .select('*')
      .eq('project_postings_id', projectId)
      .maybeSingle()

    if (jobError) {
      console.error('Database error:', jobError)
      throw new Error('Failed to fetch job details')
    }

    if (!job) {
      throw new Error('Job not found')
    }

    // Get skills in a separate query
    const { data: projectSkills } = await supabase
      .from('project_skills')
      .select('skill_id')
      .eq('project_postings_id', projectId)

    const skills = []
    if (projectSkills && projectSkills.length > 0) {
      const { data: skillsData } = await supabase
        .from('skills')
        .select('skill_id, skill_name, skill_categories(category_name)')
        .in('skill_id', projectSkills.map(ps => ps.skill_id))

      if (skillsData) {
        skills.push(...skillsData.map(skill => ({
          id: skill.skill_id.toString(),
          name: skill.skill_name,
          category: skill.skill_categories?.category_name || ''
        })))
      }
    }

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
      skills
    }
  } catch (error) {
    console.error('Error in getJobDetails:', error)
    throw error
  }
}
