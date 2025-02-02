'use client';

import { File } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  skills?: {
    skill_id: string;
    name: string;
  }[];
}

interface JobsListProps {
  jobs: Job[];
  loading: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

export default function JobsList({ jobs, loading }: JobsListProps) {
  const [likedJobs, setLikedJobs] = useState<string[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<string[]>([]);
  const { user } = useAuth();

  // Debug useEffect to log state changes
  useEffect(() => {
    console.log('Liked jobs state changed:', likedJobs);
  }, [likedJobs]);

  // Fetch initial favorites state
  useEffect(() => {
    console.log('Auth changed - user:', user?.id);
    const fetchFavorites = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        return;
      }

      try {
        // Try to load from localStorage first for immediate state
        const storedLikedJobs = localStorage.getItem(`likedJobs_${user.id}`);
        if (storedLikedJobs) {
          console.log('Initial load from localStorage:', storedLikedJobs);
          const parsedJobs = JSON.parse(storedLikedJobs);
          setLikedJobs(parsedJobs);
        }

        console.log('Fetching favorites with seller_id:', user.id);
        const response = await fetch(`https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/seller_favorites?select=project_postings_id&seller_id=eq.${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Prefer': 'return=representation'
          }
        });

        const responseText = await response.text();
        console.log('Raw fetch response:', responseText);

        if (response.ok) {
          const favorites = JSON.parse(responseText);
          console.log('Parsed favorites:', favorites);
          const favoriteJobIds = favorites.map((fav: any) => fav.project_postings_id.toString());
          console.log('Setting initial liked jobs:', favoriteJobIds);
          setLikedJobs(favoriteJobIds);

          // Store in localStorage for persistence
          localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(favoriteJobIds));
          console.log('Saved to localStorage:', favoriteJobIds);
        } else {
          console.error('Failed to fetch favorites:', responseText);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id]); // Only depend on user.id changes

  const handleLike = async (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    const jobIdStr = jobId.toString();
    console.log('Handling like for job:', jobIdStr);
    console.log('Current liked jobs:', likedJobs);

    try {
      // Update state immediately for better UX
      const isCurrentlyLiked = likedJobs.includes(jobIdStr);
      console.log('Is currently liked:', isCurrentlyLiked);

      if (isCurrentlyLiked) {
        // Remove from liked jobs
        const newLikedJobs = likedJobs.filter(id => id !== jobIdStr);
        console.log('Removing from liked jobs:', newLikedJobs);
        setLikedJobs(newLikedJobs);
        localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(newLikedJobs));

        console.log('Removing from favorites API...');
        const response = await fetch(`https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/seller_favorites?project_postings_id=eq.${jobIdStr}&seller_id=eq.${user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Prefer': 'return=representation'
          }
        });

        if (!response.ok) {
          console.error('Failed to remove from favorites API');
          // Revert state on error
          setLikedJobs(prev => [...prev, jobIdStr]);
          localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify([...likedJobs, jobIdStr]));
        }
      } else {
        // Add to liked jobs
        const newLikedJobs = [...likedJobs, jobIdStr];
        console.log('Adding to liked jobs:', newLikedJobs);
        setLikedJobs(newLikedJobs);
        localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(newLikedJobs));

        console.log('Adding to favorites API...');
        const response = await fetch('https://exqsnrdlctgxutmwpjua.supabase.co/rest/v1/seller_favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ 
            project_postings_id: jobIdStr,
            seller_id: user.id,
            created_at: new Date().toISOString()
          })
        });

        if (!response.ok) {
          console.error('Failed to add to favorites API');
          // Revert state on error
          setLikedJobs(prev => prev.filter(id => id !== jobIdStr));
          localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(likedJobs.filter(id => id !== jobIdStr)));
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      // Revert state on error
      setLikedJobs(prev => isCurrentlyLiked ? [...prev, jobIdStr] : prev.filter(id => id !== jobIdStr));
      localStorage.setItem(`likedJobs_${user.id}`, JSON.stringify(likedJobs));
    }

    if (dislikedJobs.includes(jobIdStr)) {
      setDislikedJobs(prev => prev.filter(id => id !== jobIdStr));
    }
  };

  const handleDislike = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    setDislikedJobs(prev => 
      prev.includes(jobId.toString()) ? prev.filter(id => id !== jobId.toString()) : [...prev, jobId.toString()]
    );
    if (likedJobs.includes(jobId.toString())) {
      setLikedJobs(prev => prev.filter(id => id !== jobId.toString()));
    }
  };

  const [jobsList, setJobsList] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
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

      setJobsList(jobs?.map(job => ({
        ...job,
        skills: job.project_skills?.map((ps: any) => ({
          skill_id: ps.skill_id,
          name: ps.skills?.name || 'Unknown Skill'
        })) || []
      })) || []);
    };

    fetchJobs();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobsList.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs posted</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
        <div className="mt-6">
          <Link
            href="/buyer/post-job"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post a Job
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {jobsList.map((job) => (
        <div key={job.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              <Link href={`/buyer/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              job.status === 'open' ? 'bg-green-100 text-green-800' :
              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.description}</p>
          {job.skills && job.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill.skill_id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500">
            Posted {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
