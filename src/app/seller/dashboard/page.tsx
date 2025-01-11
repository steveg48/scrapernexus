'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, ChevronRight, Crown, Award, UserCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NotificationPopup from '@/components/NotificationPopup';
import { createBrowserClient } from '@supabase/ssr';

interface JobPost {
  project_id: string;
  title: string;
  description: string;
  rate_type: string;
  experience_level: string;
  estimated_time: string;
  hours_per_week: string;
  skills: string[];
  created_at: string;
  buyer_id: string;
}

const carouselItems = [
  {
    title: "Freelancer Plus with new perks",
    description: "100 monthly Connects and full access to\nUma, Upwork's Mindful AI.",
    buttonText: "Learn more",
    icon: Crown,
    bgColor: "#1d4354"
  },
  {
    title: "Boost your earning potential",
    description: "Get certified in top skills to stand out\nand win more projects.",
    buttonText: "Get certified",
    icon: Award,
    bgColor: "#108a00"
  },
  {
    title: "Upgrade your profile",
    description: "Add your portfolio and skills to attract\nmore clients and opportunities.",
    buttonText: "Upgrade now",
    icon: UserCircle2,
    bgColor: "#3c8dd5"
  }
];

export default function SellerDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [firstName, setFirstName] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      );
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.first_name) {
        setFirstName(user.user_metadata.first_name);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch('/api/jobs/all');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch jobs');
        }
        
        setJobPosts(data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobPosts();
  }, []);

  const handleShowNotification = () => {
    console.log('Opening notification popup');
    setShowNotificationPopup(true);
  };

  const handleCloseNotification = () => {
    console.log('Closing notification popup');
    setShowNotificationPopup(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationPopup 
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onSubscribe={() => {
          setShowNotificationPopup(false);
          setIsSubscribed(true);
        }}
      />
      
      <Navigation />

      {/* Welcome Message */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hi, {firstName}
        </h1>
      </div>
      
      {/* Carousel Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-6">
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="transition-all duration-1000 ease-in-out rounded-lg overflow-hidden"
            style={{ backgroundColor: carouselItems[currentSlide].bgColor }}
          >
            <div className="p-8 relative">
              <div className="flex justify-between items-center">
                <div className="text-white max-w-2xl">
                  <h2 className="text-2xl font-semibold mb-2 transition-opacity duration-1000">{carouselItems[currentSlide].title}</h2>
                  <p className="text-2xl font-light whitespace-pre-line transition-opacity duration-1000">{carouselItems[currentSlide].description}</p>
                  <button className="mt-4 bg-white text-gray-800 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-300">
                    {carouselItems[currentSlide].buttonText}
                  </button>
                </div>
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {React.createElement(carouselItems[currentSlide].icon, {
                    className: "w-36 h-36 text-white/90 transition-all duration-1000",
                    strokeWidth: 1.5
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  currentSlide === index 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
              </div>
            </div>

            {/* Jobs Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Jobs you might like</h2>
              
              {isSubscribed ? (
                <div className="bg-[#e3f2dd] p-4 rounded-lg mb-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14a800]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">You have 30 days of job alerts. Watch your notifications and email for the latest updates.</span>
                </div>
              ) : (
                <div className="bg-[#f2f7ff] p-4 rounded-lg mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-[#3c8dd5]" />
                    <span className="text-gray-700">Be the 1st to apply with instant job alerts</span>
                  </div>
                  <button
                    onClick={() => setShowNotificationPopup(true)}
                    className="bg-[#14a800] text-white px-4 py-2 rounded-full hover:bg-[#14a800]/90 flex items-center gap-2"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Get alerts</span>
                  </button>
                </div>
              )}
              {/* Job Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <div className="flex gap-6">
                  <button className="border-b-2 border-[#14a800] text-[#14a800] pb-2 font-medium">Best Matches</button>
                  <button className="text-gray-600 pb-2 hover:text-gray-900">Most Recent</button>
                  <button className="text-gray-600 pb-2 hover:text-gray-900">U.S. Only</button>
                  <button className="text-gray-600 pb-2 hover:text-gray-900">Saved Jobs (1)</button>
                </div>
              </div>

              {/* Job Description */}
              <div className="text-sm text-gray-600 mb-4">
                Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.
              </div>

              {/* Job Card */}
              {jobPosts.map((job) => (
                <div key={job.project_id} className="bg-white rounded-lg border border-gray-200 p-6 mb-4 hover:border-[#14a800] cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-[#14a800]">
                        {job.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {job.rate_type} - {job.experience_level} - Est. Time: {job.estimated_time}, {job.hours_per_week}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Thumbs down</span>
                        👎
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Save job</span>
                        ❤️
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/images/default-avatar.svg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Steven G.</h3>
                  <p className="text-sm text-gray-600">System Engineer, Ex...</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm text-gray-900">70%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-[#14a800] rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <Link href="/profile" className="text-[#14a800] hover:underline text-sm">
                Complete your profile
              </Link>
            </div>

            {/* Additional Sections */}
            <div className="space-y-4">
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <div>
                  <span className="font-medium">Availability badge</span>
                  <p className="text-sm text-gray-500">Off</p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <div>
                  <span className="font-medium">Boost your profile</span>
                  <p className="text-sm text-gray-500">Off</p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <div>
                  <span className="font-medium">Connects: 71</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <span className="font-medium">Preferences</span>
                <ChevronDown className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <span className="font-medium">Proposals</span>
                <ChevronDown className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
                <span className="font-medium">Project Catalog</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
