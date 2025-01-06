'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Star, MoreHorizontal, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function FreelancerProfile() {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const freelancer = {
    id: 1,
    name: 'Minhaz U.',
    isVerified: true,
    location: 'Dhaka, Bangladesh',
    localTime: '8:32 am local time',
    isAvailable: true,
    jobSuccess: 95,
    isTopRated: true,
    title: 'Graphic Designer | Banner Ads & UI/UX Design Specialist',
    hourlyRate: 15,
    bio: "Welcome to my Creative Oasis!\n\nI'm Minhaz, a passionate Graphic Designer with a keen eye for visually stunning creations. Specializing in Banner Ads and UI/UX design, I transform ideas into compelling visual stories that captivate and engage your audience.",
    skills: ['Graphic Design', 'UX/UI Design'],
    stats: {
      totalEarnings: '70K+',
      totalJobs: 396,
      totalHours: 3500
    },
    availability: {
      hoursPerWeek: 'Less than 30 hrs/week',
      responseTime: '< 24 hrs'
    },
    languages: [
      { language: 'English', level: 'Fluent', isVerified: true }
    ],
    workHistory: {
      completed: 291,
      inProgress: 105,
      recentJob: {
        title: 'Create Beautiful Ads - For Facebook and Google',
        date: 'Oct 17, 2024 - Jan 4, 2025',
        feedback: 'No feedback given'
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/buyer/suggested" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="text-sm text-green-600">
                Open profile in a new window
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start gap-8">
          {/* Left Column */}
          <div className="w-1/3">
            <div className="flex items-start gap-4">
              <img 
                src="/images/default-avatar.svg" 
                alt={freelancer.name}
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-medium">{freelancer.name}</h1>
                  {freelancer.isVerified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{freelancer.location}</span>
                </div>
                <div className="text-gray-600 mt-1">
                  {freelancer.localTime}
                </div>
                {freelancer.isAvailable && (
                  <div className="text-purple-600 mt-2">
                    Available now
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1 text-gray-900">
                <Star className="h-5 w-5 text-blue-500" />
                <span>{freelancer.jobSuccess}% Job Success</span>
              </div>
              {freelancer.isTopRated && (
                <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 rounded-full text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Top Rated Plus</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-medium mb-4">View profile</h2>
              <div className="space-y-2">
                {freelancer.skills.map((skill) => (
                  <div key={skill} className="text-gray-600">
                    {skill}
                  </div>
                ))}
                <div className="text-gray-600 cursor-pointer">
                  All work →
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div>
                <div className="font-medium">${freelancer.stats.totalEarnings}</div>
                <div className="text-gray-600 text-sm">Total earnings</div>
              </div>
              <div>
                <div className="font-medium">{freelancer.stats.totalJobs}</div>
                <div className="text-gray-600 text-sm">Total jobs</div>
              </div>
              <div>
                <div className="font-medium">{freelancer.stats.totalHours}</div>
                <div className="text-gray-600 text-sm">Total hours</div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-medium mb-4">Hours per week</h2>
              <div className="text-gray-600">{freelancer.availability.hoursPerWeek}</div>
              <div className="flex items-center gap-1 text-gray-600 mt-2">
                <span>{freelancer.availability.responseTime}</span>
                <span className="text-gray-400">response time</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-medium mb-4">Languages</h2>
              {freelancer.languages.map((lang) => (
                <div key={lang.language} className="flex items-center gap-2">
                  <span>{lang.language}: {lang.level}</span>
                  {lang.isVerified && <span className="text-blue-500">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">{freelancer.title}</h2>
              <div className="text-2xl font-medium">${freelancer.hourlyRate.toFixed(2)}/hr</div>
            </div>

            <div className="mt-8 whitespace-pre-line">
              {freelancer.bio}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Hire
              </button>
              <button className="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50">
                Message
              </button>
              <button 
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-gray-600"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <div className="flex-1"></div>
              <button className="flex items-center gap-2 text-green-600">
                Share
              </button>
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-4 border-b">
                <h2 className="text-lg font-medium pb-4 border-b-2 border-gray-900">
                  Work history
                </h2>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm">
                  {freelancer.workHistory.completed}
                </div>
              </div>

              <div className="flex gap-8 mt-4">
                <button className="font-medium border-b-2 border-gray-900 pb-2">
                  Completed jobs ({freelancer.workHistory.completed})
                </button>
                <button className="text-gray-600 pb-2">
                  In progress ({freelancer.workHistory.inProgress})
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg text-green-600">
                  {freelancer.workHistory.recentJob.title}
                </h3>
                <div className="text-gray-600 mt-2">
                  {freelancer.workHistory.recentJob.date}
                </div>
                <div className="text-gray-600 mt-2">
                  {freelancer.workHistory.recentJob.feedback}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
