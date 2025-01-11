'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface JobPost {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'open';
  stats?: {
    proposals: number;
    newProposals: number;
    messaged: number;
    hired: number;
  };
}

export default function JobPostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Open', 'Drafts']);

  const mockJobs: JobPost[] = [
    {
      id: 'b080 008y08 08y0y 0y 0y89p 08y',
      title: '',
      createdAt: 'yesterday',
      createdBy: 'You',
      status: 'draft'
    },
    {
      id: '1',
      title: 'Retool Table Modification: Dropdown Implementation',
      createdAt: '2 weeks ago',
      createdBy: 'You',
      status: 'open',
      stats: {
        proposals: 6,
        newProposals: 2,
        messaged: 1,
        hired: 0
      }
    }
  ];

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button className="px-1 py-4 border-b-2 border-gray-900 text-gray-900 font-medium">
              All job posts
            </button>
            <button className="px-1 py-4 text-gray-600 hover:text-gray-900">
              All contracts
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-medium text-gray-900 mt-6 mb-8">All job posts</h1>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search job postings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <span>Filters</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link 
              href="/buyer/post-job/title"
              className="px-4 py-2 bg-[#14a800] text-white rounded hover:bg-[#14a800]/90"
            >
              Post a new job
            </Link>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            {activeFilters.map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#14a800] text-white rounded"
                onClick={() => removeFilter(filter)}
              >
                {filter}
                <X className="h-4 w-4" />
              </button>
            ))}
            <button
              className="flex items-center gap-1 text-[#14a800] hover:text-[#14a800]/80"
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Job Posts List */}
        <div className="space-y-4">
          {mockJobs.map((job) => (
            <div 
              key={job.id}
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg text-gray-900">{job.title || 'Untitled'}</h3>
                    {job.status === 'draft' && (
                      <Link 
                        href={`/buyer/post-job/title?draft=${job.id}`}
                        className="text-[#14a800] hover:text-[#14a800]/80"
                      >
                        Edit draft
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Created {job.createdAt} by {job.createdBy}</span>
                    <span>•</span>
                    <span className="capitalize">{job.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">1 - 2 of 2 Job posts</div>
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-400"
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-900 text-white">
              1
            </div>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-400"
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
