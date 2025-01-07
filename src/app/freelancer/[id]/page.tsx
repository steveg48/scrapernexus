'use client';

import { ArrowLeft, MoreHorizontal, MapPin, Crown, Clock, HelpCircle, ChevronRight, ArrowUpDown, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';

interface FreelancerProfile {
  id: string;
  name: string;
  location: string;
  title: string;
  description: string;
  jobSuccess: string;
  rating: string;
  totalEarnings: string;
  totalJobs: number;
  totalHours: number;
  hoursPerWeek: string;
  responseTime: string;
  languages: { language: string; proficiency: string }[];
  avatar_url: string;
  hourlyRate: string;
}

export default function FreelancerProfile({ params }: { params: { id: string } }) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  // This would normally come from an API
  const profile: FreelancerProfile = {
    id: params.id,
    name: "Minhaz U.",
    location: "Dhaka, Bangladesh",
    title: "Graphic Designer | Banner Ads & UI/UX Design Specialist",
    description: "I'm Minhaz, a passionate Graphic Designer with a keen eye for visually stunning creations. Specializing in Banner Ads and UI/UX design, I transform ideas into compelling visual stories that captivate and engage your audience.",
    jobSuccess: "95%",
    rating: "Top Rated Plus",
    totalEarnings: "70K+",
    totalJobs: 396,
    totalHours: 3500,
    hoursPerWeek: "Less than 30 hrs/week",
    responseTime: "< 24 hrs response time",
    languages: [{ language: "English", proficiency: "Fluent" }],
    avatar_url: "/default-profile.svg",
    hourlyRate: "$25",
  };

  const currentTime = new Date();
  const localTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Sub Navigation */}
      <div className="bg-white border-b border-[#e0e6ef]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link href="/buyer/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <nav className="flex gap-8">
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white">
          {/* Profile Header */}
          <div className="p-8 flex items-start justify-between border-b border-[#e0e6ef]">
            <div className="flex gap-6">
              {/* Avatar and Online Status */}
              <div className="relative">
                <ProfileImage size="lg" src={profile.avatar_url} />
                <div className="absolute top-[4px] right-[4px] w-4 h-4 rounded-full bg-[#14a800] border-[3px] border-white"></div>
              </div>

              {/* Name and Location */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-medium text-gray-900">{profile.name}</h1>
                  <div className="group relative inline-flex">
                    <div className="w-5 h-5 rounded-full bg-[#1d9bf0] flex items-center justify-center cursor-help">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      This freelancer's identity has been verified through a government ID check and a visual verification. You will see their verified name if you enter into a contract together.
                      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1.5">
                        <div className="border-8 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                  <span className="mx-1">—</span>
                  <span>{localTime} local time</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 text-[#7c3aed] bg-[#7c3aed]/10 px-2.5 py-1 rounded-full text-sm">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span>Available now</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-[#0d6efd] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#0d6efd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-gray-900">{profile.jobSuccess} Job Success</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-lg bg-[#ff2bc2] flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-900">{profile.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#e0e6ef] hover:bg-gray-50">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <button className="h-10 px-6 bg-white text-[#14a800] border border-[#14a800] rounded-lg hover:bg-[#14a800]/5">
                Message
              </button>
              <button className="h-10 px-6 bg-[#14a800] text-white rounded-lg hover:bg-[#14a800]/90">
                Hire
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                  isSaved 
                    ? 'bg-white border-[#e0e6ef] text-red-500 hover:bg-[#afafaf]' 
                    : 'border-[#e0e6ef] text-gray-600 hover:bg-[#afafaf]'
                }`}
              >
                {isSaved ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Main Content Two Columns */}
          <div className="flex gap-8 p-6">
            {/* Left Column */}
            <div className="w-80 shrink-0 border-r border-gray-200 pr-8">
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900">View profile</h2>
                <div className="mt-4 space-y-3">
                  <button className="text-gray-600 hover:text-gray-900">Graphic Design</button>
                  <button className="block text-gray-600 hover:text-gray-900">UX/UI Design</button>
                  <div className="flex items-center justify-between">
                    <button className="text-gray-600 hover:text-gray-900">All work</button>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-[#e0e6ef]">
                <div>
                  <div className="text-xl font-medium text-gray-900">${profile.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Total earnings</div>
                </div>
                <div>
                  <div className="text-xl font-medium text-gray-900">{profile.totalJobs}</div>
                  <div className="text-sm text-gray-600">Total jobs</div>
                </div>
                <div>
                  <div className="text-xl font-medium text-gray-900">{profile.totalHours}</div>
                  <div className="text-sm text-gray-600">Total hours</div>
                </div>
              </div>

              <div className="py-6 border-t border-[#e0e6ef]">
                <h2 className="text-xl font-medium text-gray-900">Hours per week</h2>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{profile.hoursPerWeek}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{profile.responseTime}</span>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[#14a800]">Open to contract to hire</span>
                  <span className="text-xs text-[#0d6efd] bg-[#0d6efd]/10 px-2 py-1 rounded">New</span>
                </div>
              </div>

              <div className="py-6 border-t border-[#e0e6ef]">
                <h2 className="text-xl font-medium text-gray-900">Languages</h2>
                <div className="mt-4 space-y-3">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{lang.language}:</span>
                      <span className="text-gray-600">{lang.proficiency}</span>
                      <svg className="w-4 h-4 text-[#0d6efd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="relative flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600">🎨</span>
                  </span>
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 text-gray-900">
                    Welcome to my Creative Oasis!
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-line mb-4">{profile.description}</p>
                <button className="text-[#14a800] hover:underline">more</button>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-medium text-gray-900">Work history</h2>
                  <div className="w-6 h-6 rounded-full bg-[#14a800] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex gap-6 border-b border-gray-200">
                    <button className="px-0 py-4 text-gray-900 font-medium border-b-2 border-gray-900">
                      Completed jobs (291)
                    </button>
                    <button className="px-0 py-4 text-gray-500 hover:text-gray-900">
                      In progress (105)
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Job Item */}
                  <div className="border-b border-gray-200 pb-8">
                    <a href="#" className="text-[#14a800] hover:underline text-lg mb-2 block">
                      Create Beautiful Ads - For Facebook and Google
                    </a>
                    <div className="text-gray-600 mb-4">Oct 17, 2024 - Jan 4, 2025</div>
                    <div className="text-gray-600 mb-4">No feedback given</div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>$245.00</span>
                      <span>$15.00 /hr</span>
                      <span>16 hours</span>
                    </div>
                  </div>

                  {/* Job Item */}
                  <div className="border-b border-gray-200 pb-8">
                    <a href="#" className="text-[#14a800] hover:underline text-lg mb-2 block">
                      Google Banner Ad Design
                    </a>
                    <div className="text-gray-600 mb-4">Nov 4, 2024 - Jan 4, 2025</div>
                    <div className="text-gray-600 mb-4">No feedback given</div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>$30.00</span>
                      <span>$10.00 /hr</span>
                      <span>3 hours</span>
                    </div>
                  </div>

                  {/* Job Item with Rating */}
                  <div className="border-b border-gray-200 pb-8">
                    <a href="#" className="text-[#14a800] hover:underline text-lg mb-2 block">
                      Graphic design
                    </a>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-900 font-medium">5.00</span>
                      <span className="text-gray-600">Nov 26, 2024 - Dec 29, 2024</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-gray-900 font-medium mb-2">Freelancer's response</h4>
                      <p className="text-gray-600">"It was an absolute pleasure working with you. You made the process easy with your clear expectations.</p>
                      <p className="text-gray-600 mt-2">I look forward to working with you again."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
