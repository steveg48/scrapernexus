'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Search, ChevronRight, Crown, Award, UserCircle2, ChevronLeft, Heart, ThumbsDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationPopup from '@/components/NotificationPopup';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  project_skills?: string[];
  associated_skills?: string[];
  skills?: string[];
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
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<string[]>([]);
  const [currentPosts, setCurrentPosts] = useState<JobPosting[]>(jobPostings);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5;
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJobsWithSkills = async () => {
      try {
        const response = await fetch('https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/project_postings_with_skills', {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          }
        });
        
        if (response.ok) {
          const jobsWithSkills = await response.json();
          
          // Create a map of job IDs to their associated skills
          const skillsMap = jobsWithSkills.reduce((acc: {[key: string]: string[]}, job: any) => {
            if (!acc[job.project_postings_id]) {
              acc[job.project_postings_id] = [];
            }
            if (job.skill_name) {
              acc[job.project_postings_id].push(job.skill_name);
            }
            return acc;
          }, {});
          
          // Update the current posts with associated skills
          const updatedPosts = jobPostings.map(post => ({
            ...post,
            associated_skills: skillsMap[post.id] || []
          }));
          
          setCurrentPosts(updatedPosts);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchJobsWithSkills();
  }, [jobPostings]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;

      console.log('Loading favorites for user:', user.id);
      try {
        const response = await fetch(`/api/favorites?seller_id=${user.id}`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (!response.ok) {
          console.error('Error loading favorites from API:', data);
          return;
        }

        // Keep project_posting_id as numbers
        const favoriteIds = data.map((fav: any) => fav.project_posting_id);
        console.log('Loaded favorite IDs:', favoriteIds);
        setLikedJobs(favoriteIds);
        setSavedJobsCount(favoriteIds.length);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user?.id]);

  useEffect(() => {
    const fetchDislikedJobs = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('seller_dislikes')
          .select('project_posting_id')
          .eq('seller_id', user.id);

        if (error) {
          console.error('Error fetching disliked jobs:', error);
          return;
        }

        const dislikedIds = data.map((d: any) => String(d.project_posting_id));
        setDislikedJobs(dislikedIds);
      } catch (error) {
        console.error('Error fetching disliked jobs:', error);
      }
    };

    fetchDislikedJobs();
  }, [user]);

  const handleFavoriteClick = async (jobId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      if (likedJobs.includes(Number(jobId))) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?project_id=${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove favorite');
        }

        setLikedJobs(prev => prev.filter(id => id !== Number(jobId)));
        setSavedJobsCount(prev => prev - 1);
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            project_posting_id: Number(jobId)
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }

        const data = await response.json();
        setLikedJobs(prev => [...prev, Number(jobId)]);
        setSavedJobsCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const handleDislikeClick = async (jobId: string | number | undefined) => {
    if (!jobId || !user?.id) {
      console.log('No jobId or user:', { jobId, userId: user?.id });
      return;
    }
    
    console.log('Disliking job:', jobId);
    
    try {
      const { data, error } = await supabase
        .from('seller_dislikes')
        .insert([
          {
            seller_id: user.id,
            project_posting_id: Number(jobId)
          }
        ])
        .select();

      if (error) {
        console.error('Error adding dislike:', error);
        return;
      }

      console.log('Successfully disliked job:', data);
      setDislikedJobs(prev => [...prev, String(jobId)]);
      
      // Move disliked job to end of list
      setCurrentPosts(prev => {
        const updatedPosts = [...prev];
        const dislikedPost = updatedPosts.find(p => p.id === jobId);
        if (dislikedPost) {
          const otherPosts = updatedPosts.filter(p => p.id !== jobId);
          return [...otherPosts, dislikedPost];
        }
        return updatedPosts;
      });
    } catch (error) {
      console.error('Error in handleDislikeClick:', error);
    }
  };

  const handleRestoreJob = async (jobId: string | number | undefined) => {
    if (!jobId || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('seller_dislikes')
        .delete()
        .eq('seller_id', user.id)
        .eq('project_posting_id', Number(jobId));

      if (error) {
        console.error('Error removing dislike:', error);
        return;
      }

      setDislikedJobs(prev => prev.filter(id => id !== String(jobId)));
      
      // Move restored job back to main list
      setCurrentPosts(prev => {
        const updatedPosts = [...prev];
        const restoredPost = updatedPosts.find(p => p.id === jobId);
        if (restoredPost) {
          const otherPosts = updatedPosts.filter(p => p.id !== jobId);
          return [restoredPost, ...otherPosts];
        }
        return updatedPosts;
      });
    } catch (error) {
      console.error('Error in handleRestoreJob:', error);
    }
  };

  const handleFilterClick = async (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
    
    if (filter === activeFilter) {
      // If clicking active filter, remove filter
      setCurrentPosts(currentPosts.map(post => ({
        ...post,
        associated_skills: post.associated_skills || []
      })));
      return;
    }

    switch (filter) {
      case 'us_only':
        console.log('All jobs:', jobPostings);
        setCurrentPosts(jobPostings
          .filter(job => job.project_location?.toLowerCase() === 'us only')
          .map(post => ({
            ...post,
            associated_skills: post.associated_skills || []
          }))
        );
        break;
      case 'saved':
        const { data: savedJobs } = await supabase
          .from('seller_favorites')
          .select('project_posting_id')
          .eq('seller_id', user?.id);
        
        const savedIds = savedJobs?.map(job => job.project_posting_id) || [];
        setCurrentPosts(jobPostings
          .filter(job => savedIds.includes(job.id))
          .map(post => ({
            ...post,
            associated_skills: post.associated_skills || []
          }))
        );
        break;
      default:
        setCurrentPosts(jobPostings.map(post => ({
          ...post,
          associated_skills: post.associated_skills || []
        })));
    }
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/seller/jobs/details/${jobId}`);
  };

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const totalPages = Math.ceil(currentPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
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
              <h2 className="text-lg font-semibold mb-4">Jobs you might like</h2>
              <div className="flex items-center justify-between mb-4">
                <div></div>
                <div className="inline-flex rounded-lg border border-gray-200 bg-white">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeFilter === 'be_first' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } ${activeFilter === 'be_first' ? '' : 'hover:bg-gray-50'} first:rounded-l-lg last:rounded-r-lg`}
                    onClick={() => handleFilterClick('be_first')}
                  >
                    Be the 1st to apply
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'us_only' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } ${activeFilter === 'us_only' ? '' : 'hover:bg-gray-50'}`}
                    onClick={() => handleFilterClick('us_only')}
                  >
                    U.S. Only
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'saved' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } ${activeFilter === 'saved' ? '' : 'hover:bg-gray-50'} rounded-r-lg`}
                    onClick={() => handleFilterClick('saved')}
                  >
                    Saved Jobs ({savedJobsCount})
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {currentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job postings available</p>
                  </div>
                ) : (
                  currentPosts.slice(indexOfFirstPost, indexOfLastPost).map((posting) => (
                    <div 
                      key={posting.id} 
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative h-[320px] flex flex-col"
                      onClick={() => handleJobClick(posting.id)}
                    >
                      {/* Add "Not Interested" label for disliked jobs */}
                      {dislikedJobs.includes(posting.id) && (
                        <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 px-3 py-1 text-sm rounded-tr-lg rounded-bl-lg">
                          Not Interested
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreJob(posting.id);
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            Restore
                          </button>
                        </div>
                      )}

                      {/* Interaction buttons */}
                      <div className="absolute right-6 top-6 flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteClick(posting.id);
                          }}
                          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${likedJobs.includes(Number(posting.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        {/* Only show dislike button if job is not favorited */}
                        {!likedJobs.includes(Number(posting.id)) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDislikeClick(posting.id);
                            }}
                            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <ThumbsDown className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="flex-1">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{posting.title}</h3>
                          <div className="text-sm font-medium text-gray-900">
                            {posting.budget_min && posting.budget_max ? (
                              <>
                                {formatBudget(posting.budget_min)} - {formatBudget(posting.budget_max)}
                              </>
                            ) : (
                              formatBudget(posting.budget_min || posting.budget_max)
                            )}
                            <span className="text-xs text-gray-500 ml-2">{posting.frequency}</span>
                          </div>
                        </div>

                        {/* Location row */}
                        {posting.project_location && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{posting.project_location}</span>
                          </div>
                        )}

                        {/* Posted by and date */}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span>Posted by {posting.buyer_name}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(posting.created_at)}</span>
                        </div>

                        <p className="text-gray-600 mb-8 line-clamp-1 min-h-[24px]">{posting.description}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                          {posting.associated_skills && posting.associated_skills.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
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
                          {Math.min(indexOfLastPost, currentPosts.length)}
                        </span>{' '}
                        of <span className="font-medium">{currentPosts.length}</span> results
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
      {/* Not Interested Section */}
      {currentPosts.filter(post => dislikedJobs.includes(post.id)).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Not Interested</h2>
          <div className="space-y-4">
            {currentPosts.filter(post => dislikedJobs.includes(post.id)).map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">Posted {formatDate(job.created_at)}</p>
                  </div>
                  <button
                    onClick={() => handleRestoreJob(job.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Restore
                  </button>
                </div>
                {/* ... rest of job card content without the heart icon ... */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
