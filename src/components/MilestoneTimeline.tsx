'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Milestone {
  id: string
  title: string
  description: string
  status: string
  due_date: string
  completed_at: string | null
}

export default function MilestoneTimeline({ jobId }: { jobId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadMilestones() {
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('job_id', jobId)
          .order('due_date', { ascending: true })

        if (error) throw error

        setMilestones(data || [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMilestones()
  }, [jobId, supabase])

  if (loading) {
    return <div>Loading milestones...</div>
  }

  if (error) {
    return <div>Error loading milestones: {error}</div>
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {milestones.map((milestone, index) => (
          <li key={milestone.id}>
            <div className="relative pb-8">
              {index !== milestones.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      milestone.completed_at
                        ? 'bg-green-500'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {/* Icon or number can go here */}
                    <span className="text-white text-sm">{index + 1}</span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {milestone.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {milestone.description}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <div>Due: {new Date(milestone.due_date).toLocaleDateString()}</div>
                    {milestone.completed_at && (
                      <div className="text-green-600">
                        Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
