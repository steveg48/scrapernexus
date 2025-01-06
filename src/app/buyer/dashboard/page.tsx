'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MoreVertical } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { MessageCircle, Users, CheckCircle2 } from 'lucide-react'

interface JobPost {
  id: number;
  title: string;
  status: 'open' | 'draft';
  createdAt: string;
  stats: {
    invited: number;
    inviteLimit: number;
    proposals: number;
    newProposals: number;
    messages: number;
    hired: number;
    hireLimit: number;
  };
}

export default function BuyerDashboard() {
  // Mock job posts data
  const jobPosts: JobPost[] = [
    {
      id: 1,
      title: "Retool Table Modification: Dropdown Implementation",
      status: 'open',
      createdAt: "10 days ago",
      stats: {
        invited: 0,
        inviteLimit: 30,
        proposals: 6,
        newProposals: 3,
        messages: 1,
        hired: 0,
        hireLimit: 1
      }
    }
  ]

  // Mock user data
  const mockUser = {
    display_name: "John Doe",
    avatar_url: null,
    hasPendingOffers: true
  }

  const openJobs = jobPosts.filter(post => post.status === 'open').length
  const draftJobs = jobPosts.filter(post => post.status === 'draft').length

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* User Greeting Bar with Post Job Button */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-3 px-4">
            <div>
              <span className="text-gray-700">Hi, {mockUser.display_name}!</span>
            </div>
            <div className="flex items-center">
              <Link 
                href="/buyer/post-job"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Post a job</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="py-8">
          {/* Overview Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-4">Overview</h1>
            <div className="flex space-x-4 mb-6">
              <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">
                Open job posts ({openJobs})
              </button>
              <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">
                Active contracts (1)
              </button>
              <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">
                Draft job posts ({draftJobs})
              </button>
            </div>

            {/* Job Posts List */}
            <div className="space-y-4">
              {jobPosts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    {/* Left side with title and job post button */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">≡</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                        <div className="flex items-center gap-4">
                          <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
                            Open job post
                          </button>
                          <span className="text-sm text-gray-500">Created {post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle section with stats */}
                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          Invited
                        </div>
                        <div className="text-sm font-medium">{post.stats.invited}/{post.stats.inviteLimit}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          Proposals
                        </div>
                        <div className="text-sm font-medium">
                          {post.stats.proposals} {post.stats.newProposals > 0 && <span className="text-gray-500">({post.stats.newProposals} new)</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                          Messaged
                        </div>
                        <div className="text-sm font-medium">{post.stats.messages}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-gray-400" />
                          Hired
                        </div>
                        <div className="text-sm font-medium">{post.stats.hired}/{post.stats.hireLimit}</div>
                      </div>
                    </div>

                    {/* Right side with buttons */}
                    <div className="flex items-center gap-4">
                      <Link 
                        href={`/buyer/proposals?job=${post.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                      >
                        Review proposals
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}