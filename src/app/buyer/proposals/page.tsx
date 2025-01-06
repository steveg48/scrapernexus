'use client'

import { useState, useEffect } from 'react'
import { Search, ThumbsUp, ThumbsDown, MessageCircle, Zap, SlidersHorizontal, ImageIcon } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ProfileImage from '@/components/ProfileImage'
import Link from 'next/link'

interface Proposal {
  id: number
  freelancer: {
    name: string
    country: string
    title: string
    avatar?: string
    isNew?: boolean
  }
  stats: {
    jobSuccess: number
    completedJobs: number
    totalHours: number
    earned: string
    profileItems: number
    skills: number
    similarJobs?: number
  }
  skills: string[]
  hourlyRate: number
  coverLetter: string
  isBookmarked?: boolean
  isBoosted?: boolean
  userVote?: 'up' | 'down'
  thumbsUp?: boolean
  thumbsDown?: boolean
}

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Best match')
  const [jobId, setJobId] = useState<string | null>(null)

  // Get job ID from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('job')
    setJobId(id)
  }, [])

  // Mock job data
  const job = {
    id: jobId,
    title: 'Retool Table Modification: Dropdown Implementation'
  }

  const proposals: Proposal[] = [
    {
      id: 1,
      freelancer: {
        name: 'Salman M.',
        country: 'Pakistan',
        title: 'Retool Developer | Retool Expert | Retool Development',
        isNew: true
      },
      stats: {
        jobSuccess: 87,
        completedJobs: 63,
        totalHours: 2328,
        earned: '100K+',
        profileItems: 4,
        skills: 15
      },
      skills: ['Database', 'Firebase', 'NoSQL Database', 'Data Analysis', 'Amazon Web Services'],
      hourlyRate: 50.00,
      coverLetter: 'Hi, I am a pioneer in offering Retool development services. I\'ve developed a lot of start-to-end solutions using Retool and SQL. Please feel at ease scheduling a call to assess my technical expertise and my proficiency in English...',
      isBoosted: true
    },
    {
      id: 2,
      freelancer: {
        name: 'Tanuj N.',
        country: 'India',
        title: 'Full Stack Developer',
        isNew: true
      },
      stats: {
        jobSuccess: 0,
        completedJobs: 3,
        totalHours: 101,
        earned: '1K+',
        profileItems: 2,
        skills: 11,
        similarJobs: 1
      },
      skills: ['HTML5', 'Bootstrap', 'CSS 3', 'JavaScript', 'Tailwind CSS'],
      hourlyRate: 15.00,
      coverLetter: 'Hello, I hope you are doing well. I can help you with retool and the problem you are telling I can help you get fixed too within less time. Let me know when to connect. Thanks and Regards, Tanuj'
    }
  ]

  const handleVote = (id: number, vote: 'up' | 'down') => {
    // Implement voting logic here
  }

  const handleThumbsUp = (id: number) => {
    // Implement thumbs up logic here
  }

  const handleThumbsDown = (id: number) => {
    // Implement thumbs down logic here
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-150">
      <Navigation />
      
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent"
            >
              <option>Best match</option>
              <option>Hourly rate</option>
              <option>Job success</option>
            </select>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-8 mb-4">
          <div className="text-sm text-gray-600">Stats</div>
          <div className="text-sm text-gray-600">Qualifications</div>
          <div className="text-sm text-gray-600">Details</div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map((proposal, index) => (
            <div 
              key={proposal.id} 
              className="border border-gray-200 hover:bg-gray-50 rounded-lg p-6 transition-colors duration-150"
            >
              <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Stats */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Profile Avatar */}
                    <ProfileImage size="md" src={proposal.freelancer.avatar} />
                    
                    {/* Freelancer Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{proposal.freelancer.name}</h3>
                        {proposal.freelancer.isNew && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{proposal.freelancer.country}</p>
                      <p className="text-gray-900">{proposal.freelancer.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{proposal.stats.jobSuccess}% Job Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{proposal.stats.completedJobs} completed jobs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{proposal.stats.totalHours} total hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>${proposal.stats.earned} earned</span>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Qualifications */}
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600">{proposal.stats.profileItems} profile items</span> highlighted
                  </div>
                  {proposal.stats.similarJobs && (
                    <div>
                      <span className="text-gray-600">{proposal.stats.similarJobs} similar job</span> completed on ScrapeNexus
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">{proposal.stats.skills} skills</span> on their profile
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proposal.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-[#a9effc] rounded-full text-gray-600 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {proposal.skills.length > 5 && (
                      <span className="px-3 py-1 bg-[#a9effc] rounded-full text-gray-600 text-sm">
                        +{proposal.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                  {/* Price and Boosted */}
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-medium">${proposal.hourlyRate.toFixed(2)}</div>
                    {proposal.isBoosted && (
                      <div className="inline-flex items-center gap-1 text-[#0d6efd] bg-[#0d6efd10] rounded-full px-3 py-1 text-sm">
                        <Zap className="h-4 w-4" />
                        <span>Boosted</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-800">{proposal.coverLetter}</p>
                  {proposal.coverLetter.length > 150 && (
                    <button className="text-gray-600 hover:text-gray-800 underline">
                      View more
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
                  Hire
                </button>
                <button className="px-4 py-1.5 border border-green-600 text-green-600 hover:bg-green-50 text-sm rounded">
                  Message
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleThumbsUp(proposal.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                      proposal.thumbsUp 
                        ? 'bg-[#afafaf] border-[#afafaf]' 
                        : 'border-[#e0e6ef] hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${proposal.thumbsUp ? 'stroke-white fill-[#e0e6ef]' : 'stroke-gray-600'}`} />
                  </button>
                  <button 
                    onClick={() => handleThumbsDown(proposal.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                      proposal.thumbsDown 
                        ? 'bg-[#afafaf] border-[#afafaf]' 
                        : 'border-[#e0e6ef] hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsDown className={`h-4 w-4 ${proposal.thumbsDown ? 'stroke-white fill-[#e0e6ef]' : 'stroke-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
