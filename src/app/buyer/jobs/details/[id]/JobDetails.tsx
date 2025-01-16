'use client'

import { ArrowLeft, Edit, Eye, Copy, X, Lock, MapPin, Clock, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabaseClient from '@/lib/supabaseClient'
import { getJobDetails } from './actions'

interface Skill {
  id: string
  name: string
  category: string
}

interface JobPost {
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
  skills: Skill[]
}

export default function JobDetails({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJob() {
      try {
        const jobData = await getJobDetails(jobId);
        setJob(jobData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!job || !job.id) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">Invalid job data</div>
        <Link href="/buyer/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">{error}</div>
        <Link href="/buyer/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Title and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h1>
          <div className="text-green-600">30 invites left</div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit posting</span>
          </button>
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>View posting</span>
          </button>
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>Reuse posting</span>
          </button>
          <button className="text-red-600 hover:text-red-700 flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>Remove posting</span>
          </button>
          <button className="text-gray-600 hover:text-gray-700 flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Make private</span>
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap mb-6">{job.description}</p>

            {job.frequency && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Frequency</h3>
                <p className="text-gray-700">
                  {job.frequency === 'one-time' ? 'One-time' :
                   job.frequency.charAt(0).toUpperCase() + job.frequency.slice(1)}
                </p>
              </div>
            )}

            {job.project_scope && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Scope</h3>
                <p className="text-gray-700">{job.project_scope}</p>
              </div>
            )}

            <h2 className="text-lg font-medium text-gray-900 mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.project_location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{job.frequency || 'Frequency not specified'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{job.project_scope || 'Scope not specified'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Budget</h3>
              <div className="text-sm text-gray-600">
                {job.budget_fixed_price ? (
                  <p>Fixed Price: ${job.budget_fixed_price}</p>
                ) : job.budget_min && job.budget_max ? (
                  <p>
                    Budget Range: ${job.budget_min} - ${job.budget_max}
                  </p>
                ) : (
                  <p>Budget not specified</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
