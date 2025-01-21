'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Job {
  id: string
  title: string
  description: string
  budget: number
  status: string
  created_at: string
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
          .from('jobs')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error

        setJob(job)
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{job.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-500">Budget</h3>
            <p className="text-lg">${job.budget}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Status</h3>
            <p className="text-lg capitalize">{job.status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
