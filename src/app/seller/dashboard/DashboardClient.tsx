'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronRight, Crown, Award, UserCircle2, ChevronLeft, Heart, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NotificationPopup from '@/components/NotificationPopup';
import supabaseClient from '@/lib/supabaseClient';

interface Profile {
  id?: string;
  display_name: string;
  member_type?: string;
  created_at?: string;
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  created_at: string;
  frequency: string;
  budget_min?: number;
  budget_max?: number;
  buyer_name: string;
  project_type?: string;
  project_location?: string;
  skills: string[];
}

interface DashboardClientProps {
  initialProfile: Profile;
  jobPostings: JobPosting[];
  totalPostings: number;
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatBudget = (budget: number | undefined) => {
  if (!budget) return 'Budget not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(budget);
};

export default function DashboardClient({ 
  initialProfile,
  jobPostings,
  totalPostings
}: DashboardClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedJobs, setLikedJobs] = useState<string[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<string[]>([]);
  const postsPerPage = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Debug logs
  console.log('DashboardClient received jobPostings:', jobPostings)

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = jobPostings.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(jobPostings.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleLike = async (jobId: string) => {
    try {
      if (!likedJobs.includes(jobId)) {
        // Insert into favorites
        const response = await fetch('https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/insert_seller_favorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          },
          body: JSON.stringify({
            job_id: jobId,
            user_id: initialProfile.id,
            created_at: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save favorite');
        }

        setLikedJobs(prev => [...prev, jobId]);
        if (dislikedJobs.includes(jobId)) {
          setDislikedJobs(prev => prev.filter(id => id !== jobId));
        }
      } else {
        // Remove from favorites (you might want to add an API endpoint for this)
        setLikedJobs(prev => prev.filter(id => id !== jobId));
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      // You might want to add error handling UI here
    }
  };

  const handleDislike = (jobId: string) => {
    setDislikedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
    if (likedJobs.includes(jobId)) {
      setLikedJobs(prev => prev.filter(id => id !== jobId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8">
            {/* Upgrade Profile Card */}
            <div 
              className="rounded-lg p-6 mb-6 text-white"
              style={{ backgroundColor: carouselItems[currentSlide].bgColor }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{carouselItems[currentSlide].title}</h2>
                  <p className="mb-4 whitespace-pre-line">{carouselItems[currentSlide].description}</p>
                  <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100">
                    {carouselItems[currentSlide].buttonText}
                  </button>
                </div>
                <div>
                  {React.createElement(carouselItems[currentSlide].icon, {
                    className: "h-24 w-24 text-white/80"
                  })}
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Jobs you might like</h2>
                <div className="flex space-x-4">
                  <button className="text-blue-600 font-medium">Be the 1st to apply</button>
                  <button className="text-gray-600">Most Recent</button>
                  <button className="text-gray-600">U.S. Only</button>
                  <button className="text-gray-600">Saved Jobs (1)</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.</p>
              
              {/* Job Listings */}
              <div className="space-y-6">
                {currentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job postings available</p>
                  </div>
                ) : (
                  currentPosts.map((posting) => (
                    <div key={posting.id} className="border-t pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{posting.title}</h3>
                        <div className="text-right">
                          <div className="text-lg font-medium text-gray-900">
                            {posting.budget_min && posting.budget_max ? (
                              <>
                                {formatBudget(posting.budget_min)} - {formatBudget(posting.budget_max)}
                              </>
                            ) : (
                              formatBudget(posting.budget_min || posting.budget_max)
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{posting.frequency}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>Posted by {posting.buyer_name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(posting.created_at)}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{posting.description}</p>

                      {/* Project Type */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {posting.project_type === 'US only' && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                            US only
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      {posting.skills && posting.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {posting.skills.map((skill: string, index: number) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Interaction buttons */}
                      <div className="flex items-center justify-end space-x-4 mt-4">
                        <button 
                          onClick={() => handleLike(posting.id)}
                          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${likedJobs.includes(posting.id) ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <Heart className="w-5 h-5" fill={likedJobs.includes(posting.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => handleDislike(posting.id)}
                          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${dislikedJobs.includes(posting.id) ? 'text-blue-500' : 'text-gray-400'}`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination - Matching buyer dashboard style */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between mt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastPost, jobPostings.length)}
                        </span>{' '}
                        of <span className="font-medium">{jobPostings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4">
            {/* Profile Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src="/images/default-avatar.svg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{initialProfile.display_name}</h2>
                  <p className="text-gray-600">Seller</p>
                </div>
              </div>
            </div>

            {/* Additional Profile Sections */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Availability badge</span>
                  <span className="text-gray-400">Off</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Boost your profile</span>
                  <span className="text-gray-400">Off</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Connects: 71</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Preferences</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Payments</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
