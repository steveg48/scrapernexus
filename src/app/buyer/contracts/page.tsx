'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, MoreHorizontal, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Contract {
  id: string;
  freelancer: {
    name: string;
    avatar: string | null;
    title: string;
  };
  jobTitle: string;
  status: 'Active' | 'Ended';
  type: 'Fixed-price';
  lastActivity: string;
  totalEarnings: string;
}

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All contracts');
  const [sortBy, setSortBy] = useState('Last activity');

  const contracts: Contract[] = [
    {
      id: '1',
      freelancer: {
        name: 'Shivam Kumar',
        avatar: null,
        title: 'Senior Software Engineer'
      },
      jobTitle: 'Automate Execution and Reporting of Cucumber Tests',
      status: 'Active',
      type: 'Fixed-price',
      lastActivity: 'Last active Aug 25',
      totalEarnings: '$1,000'
    },
    {
      id: '2',
      freelancer: {
        name: 'Prince E.',
        avatar: null,
        title: 'Web / Software Developer'
      },
      jobTitle: 'Web Development Project',
      status: 'Ended',
      type: 'Fixed-price',
      lastActivity: 'Last active Jul 15',
      totalEarnings: '$2,500'
    }
  ];

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="border-b">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-8">
              <Link 
                href="/buyer/jobs" 
                className="py-4 text-gray-600 hover:text-gray-900"
              >
                All job posts
              </Link>
              <Link 
                href="/buyer/contracts" 
                className="py-4 border-b-2 border-gray-900 text-gray-900"
              >
                All contracts
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-6">All contracts</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by contract, freelancer, or agency name"
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Sort by</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg">
                  {sortBy}
                </button>
              </div>
              <span className="text-gray-600">14 total</span>
            </div>
            <button className="flex items-center gap-2 text-[#14a800] hover:text-[#14a800]/90">
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="space-y-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-[100px] h-[100px] bg-[#f7f9fc] rounded border border-[#e0e6ef] flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <Link 
                        href={`/buyer/contracts/${contract.id}`}
                        className="text-[#14a800] hover:underline font-medium mb-1 block"
                      >
                        {contract.jobTitle}
                      </Link>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900">{contract.freelancer.name}</span>
                        <span className="text-gray-600">{contract.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                    {contract.status}
                  </span>
                  <span className="text-gray-600">{contract.type}</span>
                  <span className="text-gray-600">{contract.totalEarnings}</span>
                </div>

                <div className="mt-4">
                  <button className="px-6 py-2 border border-[#14a800] text-[#14a800] rounded-lg hover:bg-[#14a800]/5">
                    Rehire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
