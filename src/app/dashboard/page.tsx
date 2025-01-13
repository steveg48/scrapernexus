'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { File } from 'lucide-react'

interface Project {
  id: string
  title: string
  createdAt: string
  createdBy: string
  status: string
  stats?: {
    proposals: number
    newProposals: number
    messaged: number
    hired: number
  }
}

export default function Dashboard() {
  const [jobPosts, setJobPosts] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize Supabase client inside the component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current session
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }

        if (!user) {
          console.log('No user found')
          router.push('/login')
          return
        }

        console.log('Fetching jobs for user:', user.id)

        const { data: projectPostings, error: jobsError } = await supabase
          .from('project_postings')
          .select('*')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })

        console.log('Project postings from DB:', projectPostings)
        console.log('Query error if any:', jobsError)

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError)
          throw jobsError
        }

        if (projectPostings) {
          const formattedJobs = projectPostings.map(posting => ({
            id: posting.id,
            title: posting.title || 'Untitled',
            createdAt: posting.created_at,
            createdBy: 'You',
            status: posting.is_draft ? 'draft' : 'open',
            stats: {
              proposals: 0,
              newProposals: 0,
              messaged: 0,
              hired: 0
            }
          }))

          console.log('Formatted jobs:', formattedJobs)
          setJobPosts(formattedJobs)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hi, User</h1>
          <Link 
            href="/post-job" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            + Post a job
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Overview</h2>

        <div className="grid grid-cols-1 gap-4">
          {jobPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {post.status === 'active' ? (
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                        <File className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-gray-600">{post.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      post.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.status === 'open' ? 'Open job post' : 'Active contract'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Created {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {post.status === 'active' ? (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                      Fund & activate milestone
                    </button>
                  ) : (
                    <Link
                      href={`/job/${post.id}/proposals`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Review proposals
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex space-x-8">
                <div>
                  <span className="text-gray-500">Invited</span>
                  <p className="font-semibold">0/30</p>
                </div>
                <div>
                  <span className="text-gray-500">Proposals</span>
                  <p className="font-semibold">{post.stats?.proposals} {post.stats?.newProposals > 0 && 
                    <span className="text-sm text-gray-500">({post.stats.newProposals} new)</span>
                  }</p>
                </div>
                <div>
                  <span className="text-gray-500">Messages</span>
                  <p className="font-semibold">{post.stats?.messaged}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hired</span>
                  <p className="font-semibold">{post.stats?.hired}/1</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
