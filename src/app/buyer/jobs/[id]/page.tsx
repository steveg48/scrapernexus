'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Job {
  project_postings_id: number
  title: string
  description: string
  budget_min?: number
  budget_max?: number
  status: string
  created_at: string
  frequency: string
  data_fields: Record<string, any>
  skills?: {
    skill_id: string
    name: string
  }[]
}

export default function JobPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadJob() {
      try {
        const { data: job, error } = await supabase
          .from('project_postings')
          .select(`
            *,
            project_skills (
              skill_id,
              skills (
                skill_name
              )
            )
          `)
          .eq('project_postings_id', params.id)
          .single()

        if (error) throw error

        // Format the skills data
        const formattedJob = {
          ...job,
          skills: job.project_skills?.map((ps: any) => ({
            skill_id: ps.skill_id,
            name: ps.skills?.skill_name || 'Unknown Skill'
          })) || []
        }

        setJob(formattedJob)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Budget Range</h3>
            <p className="text-lg">
              {job.budget_min || job.budget_max 
                ? `$${job.budget_min || 0} - $${job.budget_max || 'Open'}`
                : 'Budget not specified'}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Status</h3>
            <p className="text-lg capitalize">{job.status}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Frequency</h3>
            <p className="text-lg capitalize">{job.frequency}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Posted</h3>
            <p className="text-lg">
              {new Date(job.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-500 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill.skill_id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
