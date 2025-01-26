'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Search, ChevronRight, Crown, Award, UserCircle2, ChevronLeft, Heart, ThumbsDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
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
  skills: string[];
  associated_skills?: string[];
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
      } finally {
        setLoading(false);
      }
    };

    fetchJobsWithSkills();
  }, [jobPostings]);

  useEffect(() => {
    const fetchSavedJobsCount = async () => {
      const { data: savedJobs, error } = await supabase
        .from('seller_favorites')
        .select('*')
        .eq('seller_id', user?.id);

      if (error) {
        console.error('Error fetching saved jobs:', error);
        return;
      }

      setSavedJobsCount(savedJobs?.length || 0);
    };

    if (user?.id) {
      fetchSavedJobsCount();
    }
  }, [user?.id]);

  // Load initial favorites from localStorage first, then API
  useEffect(() => {
    if (!user?.id) return;

    const loadFavorites = async () => {
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
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const handleFavoriteClick = async (jobId: string) => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    // Convert jobId to number since that's what the database expects
    const projectPostingId = parseInt(jobId);
    if (isNaN(projectPostingId)) {
      console.error('Invalid job ID:', jobId);
      return;
    }

    const isCurrentlyLiked = likedJobs.includes(projectPostingId);
    console.log('Handling favorite click:', {
      jobId,
      projectPostingId,
      isCurrentlyLiked,
      currentLikedJobs: likedJobs
    });

    try {
      if (isCurrentlyLiked) {
        console.log('Attempting to delete favorite:', {
          seller_id: user.id,
          project_posting_id: projectPostingId
        });

        // Optimistically update UI
        setLikedJobs(prev => {
          const newLikedJobs = prev.filter(id => id !== projectPostingId);
          console.log('Optimistically removing from liked jobs:', {
            prev,
            newLikedJobs,
            projectPostingId
          });
          return newLikedJobs;
        });
        setSavedJobsCount(prev => prev - 1); // Decrement saved jobs count

        const response = await fetch(
          `/api/favorites`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              seller_id: user.id,
              project_posting_id: projectPostingId
            })
          }
        );

        const responseData = await response.text();
        console.log('Delete response:', {
          ok: response.ok,
          status: response.status,
          data: responseData
        });

        if (!response.ok) {
          // Revert UI on error
          setLikedJobs(prev => {
            const newLikedJobs = [...prev, projectPostingId];
            console.log('Reverting liked jobs after error:', {
              prev,
              newLikedJobs,
              projectPostingId
            });
            return newLikedJobs;
          });
          setSavedJobsCount(prev => prev + 1); // Revert saved jobs count on error
          console.error('Error deleting favorite:', responseData);
          return;
        }
      } else {
        console.log('Attempting to insert favorite:', {
          seller_id: user.id,
          project_posting_id: projectPostingId
        });

        // Optimistically update UI
        setLikedJobs(prev => {
          const newLikedJobs = [...prev, projectPostingId];
          console.log('Optimistically adding to liked jobs:', {
            prev,
            newLikedJobs,
            projectPostingId
          });
          return newLikedJobs;
        });
        setSavedJobsCount(prev => prev + 1); // Increment saved jobs count

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            seller_id: user.id,
            project_posting_id: projectPostingId
          })
        });

        const responseData = await response.text();
        console.log('Post response:', {
          ok: response.ok,
          status: response.status,
          data: responseData
        });

        if (!response.ok) {
          // Revert UI on error
          setLikedJobs(prev => {
            const newLikedJobs = prev.filter(id => id !== projectPostingId);
            console.log('Reverting liked jobs after error:', {
              prev,
              newLikedJobs,
              projectPostingId
            });
            return newLikedJobs;
          });
          setSavedJobsCount(prev => prev - 1); // Revert saved jobs count on error
          console.error('Error adding favorite:', responseData);
          return;
        }
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      // Revert UI on error
      if (isCurrentlyLiked) {
        setLikedJobs(prev => [...prev, projectPostingId]);
        setSavedJobsCount(prev => prev + 1); // Revert saved jobs count on error
      } else {
        setLikedJobs(prev => prev.filter(id => id !== projectPostingId));
        setSavedJobsCount(prev => prev - 1); // Revert saved jobs count on error
      }
    }
  };

  const handleDislikeClick = (jobId: string | number | undefined) => {
    if (!jobId) return;
    const jobIdStr = String(jobId);
    
    setDislikedJobs(prev => {
      const isDisliked = prev.includes(jobIdStr);
      if (isDisliked) {
        return prev.filter(id => id !== jobIdStr);
      } else {
        return [...prev, jobIdStr];
      }
    });

    // Remove from liked if necessary
    if (likedJobs.includes(Number(jobId))) {
      setLikedJobs(prev => prev.filter(id => id !== Number(jobId)));
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
    router.push(`/seller/jobs/${jobId}`);
  };

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const totalPages = Math.ceil(currentPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative h-[320px] flex flex-col"
                      onClick={() => handleJobClick(posting.id)}
                    >
                      {/* Interaction buttons */}
                      <div className="absolute right-6 top-6 flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteClick(posting.id);
                          }}
                          className={`p-2 rounded-full hover:bg-gray-100 ${
                            likedJobs.includes(Number(posting.id)) ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDislikeClick(posting.id);
                          }}
                          className={`p-2 rounded-full hover:bg-gray-100 ${
                            dislikedJobs.includes(posting.id) ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="h-5 w-5" />
                        </button>
                      </div>

                      <div>
                        <div className="mb-2">
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
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap items-center gap-2 mt-auto">
                        {posting.associated_skills && posting.associated_skills.map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                            {skill}
                          </span>
                        ))}
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
    </div>
  );
}
