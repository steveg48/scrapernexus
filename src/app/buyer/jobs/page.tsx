'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  status: 'draft' | 'open';
  createdAt: string;
  createdBy: string;
  proposalCount: number;
  messagedCount: number;
  hiredCount: number;
  visibility: string;
  priceType: string;
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    open: true,
    drafts: true
  });

  const jobs: Job[] = [
    {
      id: 'b080 008y08 08y0y 0y 0y89p 08y',
      title: 'b080 008y08 08y0y 0y 0y89p 08y',
      status: 'draft',
      createdAt: '2 days ago',
      createdBy: 'You',
      proposalCount: 0,
      messagedCount: 0,
      hiredCount: 0,
      visibility: '',
      priceType: ''
    },
    {
      id: 'retool-table',
      title: 'Retool Table Modification: Dropdown Implem...',
      status: 'open',
      createdAt: '2 weeks ago',
      createdBy: 'You',
      proposalCount: 6,
      messagedCount: 1,
      hiredCount: 0,
      visibility: 'Public',
      priceType: 'Fixed Price'
    }
  ];

  const clearFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filter]: false }));
  };

  const clearAllFilters = () => {
    setFilters({
      open: false,
      drafts: false
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (!filters.open && !filters.drafts) return true;
    if (filters.open && job.status === 'open') return true;
    if (filters.drafts && job.status === 'draft') return true;
    return false;
  });

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

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-gray-900 font-medium mb-1">{job.title}</h2>
                    <p className="text-sm text-gray-600">
                      Created {job.createdAt} by {job.createdBy}
                    </p>
                    {job.status === 'draft' && (
                      <p className="text-sm text-gray-600">Draft - Saved Jan 4, 2025</p>
                    )}
                    {job.status === 'open' && (
                      <p className="text-sm text-gray-600">{job.visibility} - {job.priceType}</p>
                    )}
                  </div>
                  {job.status === 'draft' ? (
                    <button className="text-[#14a800] hover:text-[#14a800]/90">
                      Edit draft
                    </button>
                  ) : (
                    <button className="text-[#14a800] hover:text-[#14a800]/90">
                      View proposals
                    </button>
                  )}
                </div>
                {job.status === 'open' && (
                  <div className="flex gap-8">
                    <div>
                      <span className="text-gray-900">{job.proposalCount}</span>
                      <span className="text-gray-600 ml-1">Proposals</span>
                    </div>
                    <div>
                      <span className="text-gray-900">{job.messagedCount}</span>
                      <span className="text-gray-600 ml-1">Messaged</span>
                    </div>
                    <div>
                      <span className="text-gray-900">{job.hiredCount}</span>
                      <span className="text-gray-600 ml-1">Hired</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">1 - 2 of 2 Job posts</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e4ebe4] text-gray-900">1</span>
              <button className="p-2 text-gray-400 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
