'use client';

import { File } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
  skills: {
    skill_id: string;
    name: string;
  }[];
}

interface JobsListProps {
  jobs: Job[];
  loading?: boolean;
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

export default function JobsList({ jobs, loading = false }: JobsListProps) {
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

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading job postings...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-600 max-w-4xl mx-auto">
        No job postings yet. Click &quot;Post a job&quot; to create your first job posting.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/buyer/jobs/details/${job.id}`}
          className="block group"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  <File className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">Created {formatDate(job.created_at)}</p>
                  <div className="mt-2 flex flex-wrap gap-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', justifyContent: 'start' }}>
                    {job.skills?.map((skill) => (
                      <span
                        key={skill.skill_id}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
