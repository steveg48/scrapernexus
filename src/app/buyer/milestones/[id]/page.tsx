'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MoreHorizontal, RotateCcw, Upload } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';
import MilestoneTimeline from '@/components/MilestoneTimeline';

interface Job {
  id: string
  title: string
}

interface ProjectStats {
  projectPrice: number;
  inEscrow: number;
  milestonesPaid: number;
  milestonesRemaining: number;
  totalCharges: number;
}

interface Milestone {
  title: string;
  amount: number;
  status: 'paid' | 'pending' | 'rejected';
}

interface RecentFile {
  name: string;
  size: string;
  uploadedBy: string;
  uploadTime: string;
  message: string;
}

export default function MilestonePage() {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const supabase = createClientComponentClient()

  const [projectStats, setProjectStats] = useState<ProjectStats>({
    projectPrice: 0,
    inEscrow: 0,
    milestonesPaid: 0,
    milestonesRemaining: 0,
    totalCharges: 0
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    async function loadJob() {
      try {
        const { data: job, error } = await supabase
          .from('jobs')
          .select('id, title')
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

  useEffect(() => {
    async function loadProjectStats() {
      try {
        const { data, error } = await supabase
          .from('project_stats')
          .select('projectPrice, inEscrow, milestonesPaid, milestonesRemaining, totalCharges')
          .eq('jobId', params.id)
          .single()

        if (error) throw error

        setProjectStats(data)
      } catch (error: any) {
        setError(error.message)
      }
    }

    loadProjectStats()
  }, [params.id, supabase])

  useEffect(() => {
    async function loadMilestones() {
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('title, amount, status')
          .eq('jobId', params.id)

        if (error) throw error

        setMilestones(data)
      } catch (error: any) {
        setError(error.message)
      }
    }

    loadMilestones()
  }, [params.id, supabase])

  useEffect(() => {
    async function loadRecentFiles() {
      try {
        const { data, error } = await supabase
          .from('recent_files')
          .select('name, size, uploadedBy, uploadTime, message')
          .eq('jobId', params.id)

        if (error) throw error

        setRecentFiles(data)
      } catch (error: any) {
        setError(error.message)
      }
    }

    loadRecentFiles()
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Project Header */}
      <div className="bg-[#1C4532] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold mb-4">
                {job.title}
              </h1>
              <div className="flex items-center gap-3">
                <ProfileImage size="lg" />
                <div>
                  <h2 className="font-medium">Shivam Kumar</h2>
                  <p className="text-sm opacity-80">India · Wed 3:56 AM</p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-5 gap-8">
            <div>
              <p className="text-sm text-gray-600">Project price</p>
              <p className="text-xl font-medium">${projectStats.projectPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Fixed-price</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">In escrow</p>
              <p className="text-xl font-medium">${projectStats.inEscrow.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones paid ({milestones.filter(milestone => milestone.status === 'paid').length})</p>
              <p className="text-xl font-medium">${projectStats.milestonesPaid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones remaining ({milestones.filter(milestone => milestone.status !== 'paid').length})</p>
              <p className="text-xl font-medium">${projectStats.milestonesRemaining.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total charges</p>
              <p className="text-xl font-medium">${projectStats.totalCharges.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {['Overview', 'Messages', 'Contract details'].map((tab) => (
              <button
                key={tab}
                className={`py-4 ${
                  tab === 'Overview'
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2">
            <MilestoneTimeline milestones={milestones} />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent files</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#14A800] text-white rounded-full hover:bg-[#14A800]/90">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
              </div>

              {recentFiles.map((file, index) => (
                <div key={index} className="mt-4">
                  <div className="flex items-start gap-3">
                    <ProfileImage size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{file.uploadedBy}</p>
                        <span className="text-sm text-gray-500">{file.uploadTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{file.message}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-500">{file.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
