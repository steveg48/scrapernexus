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
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gray-600">Created {job.createdAt} by {job.createdBy}</span>
                  </div>
                  {job.status === 'draft' ? (
                    <>
                      <h3 className="text-lg text-gray-400 mb-1">{job.title || 'Untitled'}</h3>
                      <div className="text-sm">Draft - Saved Jan 4, 2025</div>
                      <button className="mt-4 px-4 py-1.5 border border-[#14a800] text-[#14a800] rounded hover:bg-[#14a800]/5">
                        Edit draft
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg text-gray-900 hover:text-[#14a800] mb-2">{job.title}</h3>
                      <div className="text-sm">Public - Fixed Price</div>
                      <div className="flex items-center gap-8 mt-4">
                        <div>
                          <div className="font-medium">{job.stats?.proposals} ({job.stats?.newProposals} new)</div>
                          <div className="text-sm text-gray-600">Proposals</div>
                        </div>
                        <div>
                          <div className="font-medium">{job.stats?.messaged}</div>
                          <div className="text-sm text-gray-600">Messaged</div>
                        </div>
                        <div>
                          <div className="font-medium">{job.stats?.hired}</div>
                          <div className="text-sm text-gray-600">Hired</div>
                        </div>
                      </div>
                      <Link 
                        href={`/buyer/proposals?job=${job.id}`}
                        className="inline-block mt-4 px-4 py-1.5 border border-[#14a800] text-[#14a800] rounded hover:bg-[#14a800]/5"
                      >
                        View proposals
                      </Link>
                    </>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
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
