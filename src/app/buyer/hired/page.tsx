'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, Heart, ChevronDown, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import ProfileImage from '@/components/ProfileImage';

interface FreelancerHired {
  id: string;
  name: string;
  title: string;
  avatar: string | null;
  rate: string;
  earned: string;
  jobSuccess?: number;
  isTopRated?: boolean;
  description: string;
  contracts: {
    title: string;
    status: 'Ended' | 'Active';
    type: 'Fixed-price';
  }[];
}

export default function HiredTalentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState('Your hires');

  const freelancers: FreelancerHired[] = [
    {
      id: '1',
      name: 'Shivam K.',
      title: 'Senior Software Engineer',
      avatar: null,
      rate: '$30.00',
      earned: '$5K+',
      description: 'I am carrying extensive expertise in: API Integrations Google Sheet, Gmail Api Integrations Web Scraping Database Integration API, UI end to end Automation Google Analytics api integration Result oriented professional with 4+ years of experience working as Senior Software Engineer in Test. Experienced in designing, implementing and managing automation framework for large scale distributed system...',
      contracts: [
        {
          title: 'Automate Execution and Reporting of Cucumber Tests',
          status: 'Ended',
          type: 'Fixed-price'
        },
        {
          title: 'Automate Execution and Reporting of Cucumber Tests',
          status: 'Active',
          type: 'Fixed-price'
        }
      ]
    },
    {
      id: '2',
      name: 'Prince E.',
      title: 'Web / Software Developer',
      avatar: null,
      rate: '$17.00',
      earned: '$30K+',
      jobSuccess: 100,
      isTopRated: true,
      description: "I'm a versatile software developer and web designer skilled in Next.js, HTML, CSS, PHP, JavaScript, WordPress, and more. I specialize in crafting engaging websites, troubleshooting technical issues, and developing mobile and USSD apps. I also provide expertise in UI and",
      contracts: []
    }
  ];

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span>{selectedList}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 bg-[#14a800] text-white rounded-lg hover:bg-[#14a800]/90">
              Share list
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder='Search in "Your hires"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#14a800] focus:border-[#14a800]"
            />
          </div>

          <div className="space-y-8">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="border-b border-gray-200 pb-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-start gap-4">
                      {/* Logo Image */}
                      <div className="w-[100px] h-[100px] bg-[#f7f9fc] rounded border border-[#e0e6ef] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {/* Profile Avatar */}
                      <div className="-ml-2 mt-1">
                        <ProfileImage size="md" src={freelancer.avatar} />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-gray-900 mb-1">
                        {freelancer.name}
                      </h2>
                      <p className="text-gray-900 mb-2">{freelancer.title}</p>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>{freelancer.rate}/hr</span>
                        <span>{freelancer.earned} earned</span>
                        {freelancer.jobSuccess && (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs">
                              ★
                            </span>
                            <span>{freelancer.jobSuccess}% Job Success</span>
                          </div>
                        )}
                        {freelancer.isTopRated && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-600">TOP RATED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-[#14a800] font-medium hover:text-[#14a800]/90">
                      Message
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Heart className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 line-clamp-2">
                    {freelancer.description}
                  </p>
                  {freelancer.description.length > 150 && (
                    <button className="text-[#14a800] hover:text-[#14a800]/90 mt-1">
                      View More
                    </button>
                  )}
                </div>

                {freelancer.contracts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {freelancer.contracts.map((contract, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <h3 className="text-gray-900">{contract.title}</h3>
                          <p className="text-gray-600">{contract.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          contract.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
