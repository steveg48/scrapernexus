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
        const { data: jobs, error } = await supabase
          .from('project_postings')
          .select(`
            *,
            project_skills (
              project_postings_id,
              skill_id,
              skills (
                id,
                name
              )
            )
          `)
          .eq('buyer_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRegularJobs(jobs?.map(job => ({
          ...job,
          skills: job.project_skills?.map((ps: any) => ({
            skill_id: ps.skill_id,
            name: ps.skills?.name || 'Unknown Skill'
          })) || []
        })) || []);
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
    let filteredJobs = [...jobPostings]; // Start with all jobs
    
    // Apply active filter
    if (activeFilter === 'us_only') {
      filteredJobs = filteredJobs.filter(job => job.project_location?.toLowerCase() === 'us only');
      // Remove disliked jobs for US only filter
      filteredJobs = filteredJobs.filter(job => !dislikedJobs.includes(String(job.id)));
    } else if (activeFilter === 'saved') {
      filteredJobs = filteredJobs.filter(job => likedJobs.includes(Number(job.id)));
      // Remove disliked jobs for saved filter
      filteredJobs = filteredJobs.filter(job => !dislikedJobs.includes(String(job.id)));
    } else if (activeFilter === 'not_interested') {
      // Show only disliked jobs
      filteredJobs = filteredJobs.filter(job => dislikedJobs.includes(String(job.id)));
    } else {
      // For other filters (like 'be_first'), remove disliked jobs
      filteredJobs = filteredJobs.filter(job => !dislikedJobs.includes(String(job.id)));
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
  }, [activeFilter, jobPostings, dislikedJobs, likedJobs, currentPage, postsPerPage]);

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
        const response = await fetch(`/api/favorites?project_postings_id=${jobId}`, {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8">
            {/* Promotional Card */}
            <div 
              className="bg-[#1d4354] rounded-lg p-6 mb-6 text-white relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Freelancer Plus with new perks</h2>
                  <p className="mb-4">100 monthly Connects and full access to\nUma, Upwork's Mindful AI.</p>
                  <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100">
                    Learn more
                  </button>
                </div>
                <Crown className="h-24 w-24 text-white/80" />
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                <button className="w-2 h-2 rounded-full bg-white" />
                <button className="w-2 h-2 rounded-full bg-white/50" />
                <button className="w-2 h-2 rounded-full bg-white/50" />
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Jobs you might like</h2>
              
              {/* Filter Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeFilter === 'be_first' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } first:rounded-l-lg`}
                    onClick={() => handleFilterClick('be_first')}
                  >
                    Be the 1st to apply
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'us_only' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleFilterClick('us_only')}
                  >
                    U.S. Only
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'saved' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleFilterClick('saved')}
                  >
                    Saved Jobs ({savedJobsCount})
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-l ${
                      activeFilter === 'not_interested' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } rounded-r-lg`}
                    onClick={() => handleFilterClick('not_interested')}
                  >
                    Not Interested ({notInterestedCount})
                  </button>
                </div>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {currentPagePosts.map((job) => (
                  <div 
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.project_location || 'Worldwide'}
                          <span className="mx-2">•</span>
                          Posted by Anonymous • {formatDate(job.created_at)}
                        </div>
                        <p className="mt-2 text-gray-600">{job.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-gray-900">
                          {job.budget_min && job.budget_max 
                            ? `$${job.budget_min} - $${job.budget_max}`
                            : 'Budget not specified'}
                          <span className="text-xs text-gray-500 block text-right">weekly</span>
                        </div>
                        <div className="mt-auto flex space-x-2">
                          {activeFilter === 'not_interested' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDislikeClick(job.id); // This will remove it from disliked jobs
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteClick(job.id);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Heart className={`h-5 w-5 ${likedJobs.includes(Number(job.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                              {!likedJobs.includes(Number(job.id)) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDislikeClick(job.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <ThumbsDown className="h-5 w-5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
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
                      className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
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
                <ProfileImage size="lg" />
                <div>
                  <h2 className="text-lg font-semibold">Steve</h2>
                  <p className="text-sm text-gray-600">Seller</p>
                </div>
              </div>
            </div>

            {/* Settings Menu */}
            <div className="space-y-2">
              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700">Availability badge</span>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Off</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700">Boost your profile</span>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Off</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700">Connects: 71</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700">Preferences</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700">Payments</span>
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
