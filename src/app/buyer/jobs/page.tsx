'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, MoreHorizontal } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Job {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  isDraft: boolean;
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    open: true,
    drafts: true
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }
      console.log('Fetching jobs for user:', user.id);

      const { data: projectPostings, error } = await supabase
        .from('project_postings')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Project postings from DB:', projectPostings);
      console.log('Query error if any:', error);

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      const formattedJobs: Job[] = projectPostings?.map(posting => {
        console.log('Processing posting:', posting);
        return {
          id: posting.id,
          title: posting.title || 'Untitled',
          createdAt: new Date(posting.created_at).toLocaleDateString(),
          createdBy: 'You',
          isDraft: posting.is_draft
        };
      }) || [];

      console.log('Formatted jobs:', formattedJobs);
      setJobs(formattedJobs);
    };

    fetchJobs();
  }, []);

  const clearFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filter]: false }));
  };

  const clearAllFilters = () => {
    setFilters({
      open: false,
      drafts: false
    });
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="border-b">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-8">
              <Link 
                href="/buyer/jobs" 
                className="py-4 border-b-2 border-gray-900 text-gray-900"
              >
                All job posts
              </Link>
              <Link 
                href="/buyer/contracts" 
                className="py-4 text-gray-600 hover:text-gray-900"
              >
                All contracts
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-900">All job posts</h1>
            <Link 
              href="/buyer/post-job"
              className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-[#14a800] text-white hover:bg-[#14a800]/90"
            >
              Post a new job
            </Link>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search job postings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#14a800] focus:border-[#14a800]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            {filters.open && (
              <button 
                className="flex items-center gap-2 px-3 py-1.5 bg-[#e4ebe4] rounded-full text-sm"
                onClick={() => clearFilter('open')}
              >
                <span>Open</span>
                <X className="h-4 w-4" />
              </button>
            )}
            {filters.drafts && (
              <button 
                className="flex items-center gap-2 px-3 py-1.5 bg-[#e4ebe4] rounded-full text-sm"
                onClick={() => clearFilter('drafts')}
              >
                <span>Drafts</span>
                <X className="h-4 w-4" />
              </button>
            )}
            {(filters.open || filters.drafts) && (
              <button 
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="space-y-8">
            {jobs.map((job) => (
              <div key={job.id} className="space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-normal text-gray-900">{job.title}</h2>
                    <p className="text-gray-600">Created {job.createdAt} by {job.createdBy}</p>
                    {job.isDraft && (
                      <p className="mt-2 text-gray-900">Draft - Saved {job.createdAt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.isDraft ? (
                      <Link
                        href={`/buyer/jobs/${job.id}/edit`}
                        className="inline-flex items-center px-4 py-2 rounded-lg border border-[#14a800] text-[#14a800] hover:bg-[#14a800]/5"
                      >
                        Edit draft
                      </Link>
                    ) : (
                      <Link
                        href={`/buyer/jobs/${job.id}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-[#14a800] hover:text-[#14a800]/90"
                      >
                        View proposals
                      </Link>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
