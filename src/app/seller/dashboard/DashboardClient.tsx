'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Search, ChevronRight, Crown, Award, UserCircle2, ChevronLeft, Heart, ThumbsDown, MapPin, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationPopup from '@/components/NotificationPopup';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useOnlineStatus } from '@/contexts/OnlineStatusContext';
import ProfileImage from '@/components/ProfileImage';

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
  console.log('DashboardClient jobPostings:', jobPostings);
  console.log('Sample job skills:', jobPostings[0]?.skills);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [notInterestedCount, setNotInterestedCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [regularJobs, setRegularJobs] = useState<JobPosting[]>([]);
  const [currentPagePosts, setCurrentPagePosts] = useState<JobPosting[]>([]);
  const [totalPages, setTotalPages] = useState(Math.ceil(jobPostings.length / 9));
  const postsPerPage = 5;
  const { user, signOut } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isOnline } = useOnlineStatus();

  const handleSignOut = async () => {
    try {
      setShowProfileMenu(false);
      const client = supabase;
      if (client) {
        await client.auth.signOut();
        router.push('/auth');
        router.refresh();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          
          setRegularJobs(updatedPosts);
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

        // Keep project_postings_id as numbers
        const favoriteIds = data.map((fav: any) => fav.project_postings_id);
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
    const loadDislikes = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('seller_dislikes')
          .select('project_postings_id')
          .eq('seller_id', user.id);

        if (error) {
          console.error('Error loading dislikes:', error);
          return;
        }

        const dislikedIds = data.map(dislike => String(dislike.project_postings_id));
        console.log('Loaded disliked IDs:', dislikedIds);
        setDislikedJobs(dislikedIds);
        setNotInterestedCount(dislikedIds.length);

        // Update regular jobs list to exclude disliked jobs
        const filteredJobs = jobPostings.filter(job => !dislikedIds.includes(job.id));
        setRegularJobs(filteredJobs);
        setCurrentPagePosts(filteredJobs.slice(0, postsPerPage));
      } catch (error) {
        console.error('Error loading dislikes:', error);
      }
    };

    loadDislikes();
  }, [user?.id, jobPostings, postsPerPage]);

  useEffect(() => {
    let filteredJobs = jobPostings.filter(job => !dislikedJobs.includes(String(job.id)));
    
    // Apply active filter
    if (activeFilter === 'us_only') {
      filteredJobs = filteredJobs.filter(job => job.project_location?.toLowerCase() === 'us only');
    } else if (activeFilter === 'saved') {
      filteredJobs = filteredJobs.filter(job => likedJobs.includes(Number(job.id)));
    }
    
    // Sort by newest first
    filteredJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setRegularJobs(filteredJobs);
    
    const newTotalPages = Math.ceil(filteredJobs.length / postsPerPage);
    setTotalPages(newTotalPages);
    
    // Adjust current page if necessary
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
    
    // Update current page posts
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setCurrentPagePosts(filteredJobs.slice(startIndex, endIndex));
  }, [jobPostings, dislikedJobs, currentPage, activeFilter, likedJobs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFavoriteClick = async (jobId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isCurrentlyLiked = likedJobs.includes(Number(jobId));

    try {
      // Update UI immediately
      setLikedJobs(prev => 
        isCurrentlyLiked
          ? prev.filter(id => id !== Number(jobId))
          : [...prev, Number(jobId)]
      );

      if (isCurrentlyLiked) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?project_id=${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove favorite');
        }

        setSavedJobsCount(prev => prev - 1);
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            project_postings_id: Number(jobId)
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }

        setSavedJobsCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      // Revert UI on error
      setLikedJobs(prev => 
        isCurrentlyLiked
          ? prev.filter(id => id !== Number(jobId))
          : [...prev, Number(jobId)]
      );
    }
  };

  const handleDislikeClick = async (jobId: string) => {
    console.log('Dislike clicked:', jobId);
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isCurrentlyDisliked = dislikedJobs.includes(String(jobId));
    const oldDislikedJobs = [...dislikedJobs];
    const oldRegularJobs = [...regularJobs];
    const oldCurrentPagePosts = [...currentPagePosts];
    const oldNotInterestedCount = notInterestedCount;

    try {
      // Update UI immediately
      const newDislikedJobs = isCurrentlyDisliked
        ? dislikedJobs.filter(id => id !== String(jobId))
        : [...dislikedJobs, String(jobId)];
      
      setDislikedJobs(newDislikedJobs);
      setNotInterestedCount(newDislikedJobs.length);

      // Update job lists based on active filter
      if (isCurrentlyDisliked) {
        const job = jobPostings.find(j => j.id === jobId);
        if (job) {
          setRegularJobs(prev => [...prev, job]);
          if (activeFilter === 'all') {
            setCurrentPagePosts(prev => [...prev, job]);
          }
        }
      } else {
        setRegularJobs(prev => prev.filter(job => job.id !== jobId));
        if (activeFilter === 'all') {
          setCurrentPagePosts(prev => prev.filter(job => job.id !== jobId));
        }
      }

      if (isCurrentlyDisliked) {
        const { error } = await supabase
          .from('seller_dislikes')
          .delete()
          .eq('seller_id', user.id)
          .eq('project_postings_id', parseInt(jobId, 10));

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('seller_dislikes')
          .insert([{
            seller_id: user.id,
            project_postings_id: parseInt(jobId, 10)
          }])
          .select();

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
      // Revert all UI changes on error
      setDislikedJobs(oldDislikedJobs);
      setRegularJobs(oldRegularJobs);
      setCurrentPagePosts(oldCurrentPagePosts);
      setNotInterestedCount(oldNotInterestedCount);
    }
  };

  const handleRestoreJob = async (jobId: string | number | undefined) => {
    if (!jobId || !user?.id) return;
    
    try {
      if (dislikedJobs.includes(String(jobId))) {
        const { error } = await supabase
          .from('seller_dislikes')
          .delete()
          .eq('seller_id', user.id)
          .eq('project_postings_id', parseInt(jobId, 10));

        if (error) {
          console.error('Delete error:', error);
          // Revert UI on error
          setDislikedJobs(prev => 
            prev.filter(id => id !== String(jobId))
          );
          throw error;
        }
      } else {
        console.log('Inserting dislike with:', {
          seller_id: user.id,
          project_postings_id: parseInt(jobId, 10)
        });
        
        const { error } = await supabase
          .from('seller_dislikes')
          .insert([{
            seller_id: user.id,
            project_postings_id: parseInt(jobId, 10)
          }])
          .select();

        if (error) {
          console.error('Insert error:', error);
          // Revert UI on error
          setDislikedJobs(prev => 
            prev.filter(id => id !== String(jobId))
          );
          throw error;
        }
      }

      setDislikedJobs(prev => 
        dislikedJobs.includes(String(jobId))
          ? prev.filter(id => id !== String(jobId))
          : [...prev, String(jobId)]
      );
      
      // Move restored job back to main list
      setRegularJobs(prev => {
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

  const handleFilterClick = (filter: string) => {
    // Reset pagination when changing filters
    setCurrentPage(1);
    
    // Update active filter
    setActiveFilter(filter === activeFilter ? 'all' : filter);
    
    // Update displayed jobs based on filter
    let filteredJobs;
    if (filter === 'not_interested') {
      // Show only disliked jobs
      filteredJobs = jobPostings.filter(job => dislikedJobs.includes(String(job.id)));
    } else if (filter === 'us_only') {
      // Show US only jobs that aren't disliked
      filteredJobs = jobPostings.filter(job => 
        !dislikedJobs.includes(String(job.id)) && 
        job.project_location?.toLowerCase() === 'us only'
      );
    } else if (filter === 'saved') {
      // Show liked jobs
      filteredJobs = jobPostings.filter(job => likedJobs.includes(Number(job.id)));
    } else if (filter === 'be_first') {
      // Show jobs with no applications that aren't disliked
      filteredJobs = jobPostings.filter(job => !dislikedJobs.includes(String(job.id)));
    } else {
      // Show all jobs that aren't disliked
      filteredJobs = jobPostings.filter(job => !dislikedJobs.includes(String(job.id)));
    }

    // Sort by newest first
    filteredJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setRegularJobs(filteredJobs);
    setCurrentPagePosts(filteredJobs.slice(0, postsPerPage));
    setTotalPages(Math.ceil(filteredJobs.length / postsPerPage));
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/seller/jobs/details/${jobId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleProfileMenuClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const renderJobList = () => {
    const jobsToShow = activeFilter === 'not_interested' ? 
      jobPostings.filter(job => dislikedJobs.includes(String(job.id))) : 
      currentPagePosts;
    
    return (
      <>
        {jobsToShow.length === 0 ? (
          <div className="border rounded-lg p-6 text-center text-gray-600 max-w-2xl mx-auto">
            No job postings yet. Click &quot;Post a job&quot; to create your first job posting.
          </div>
        ) : (
          jobsToShow.map((job) => (
            <div 
              key={job.id} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative h-[320px] flex flex-col"
              onClick={() => handleJobClick(job.id)}
            >
              <div className="absolute right-6 top-6 flex items-center gap-4">
                {activeFilter !== 'not_interested' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(job.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${likedJobs.includes(Number(job.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    {!likedJobs.includes(Number(job.id)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDislikeClick(job.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          dislikedJobs.includes(String(job.id)) ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-500'
                        }`}
                      >
                        <ThumbsDown className={`h-6 w-6 ${dislikedJobs.includes(String(job.id)) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex-1">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                  {job.project_location && (
                    <div className="text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 inline-block mr-1" />
                      {job.project_location}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900 mb-4">
                    {job.budget_min && job.budget_max ? (
                      <>
                        {formatBudget(job.budget_min)} - {formatBudget(job.budget_max)}
                      </>
                    ) : (
                      formatBudget(job.budget_min || job.budget_max)
                    )}
                    <span className="text-xs text-gray-500 ml-2">{job.frequency}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 line-clamp-1 min-h-[24px]">{job.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  {job.skills?.map((skill) => (
                    <span 
                      key={`${job.id}-${skill}`}
                      className="px-3 py-1.5 bg-[#b5ebfa] text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>Posted {formatDate(job.created_at)}</div>
                {activeFilter === 'not_interested' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreJob(job.id);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </>
    );
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
              <h2 className="text-lg font-semibold mb-4">
                {activeFilter === 'not_interested' ? 'Jobs You\'re Not Interested In' : 'Jobs You Might Like'}
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div></div>
                <div className="inline-flex rounded-lg border border-gray-200 bg-white">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeFilter === 'be_first' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } ${activeFilter === 'be_first' ? '' : 'hover:bg-gray-50'} first:rounded-l-lg`}
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
                    } ${activeFilter === 'saved' ? '' : 'hover:bg-gray-50'}`}
                    onClick={() => handleFilterClick('saved')}
                  >
                    Saved Jobs ({savedJobsCount})
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'not_interested' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } ${activeFilter === 'not_interested' ? '' : 'hover:bg-gray-100'} rounded-r-lg`}
                    onClick={() => handleFilterClick('not_interested')}
                  >
                    Not Interested ({dislikedJobs.length})
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {renderJobList()}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
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
                <div className="relative">
                  <img
                    src="/images/default-avatar.svg"
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
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
