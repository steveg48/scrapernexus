'use client';

import { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';

interface SavedFreelancer {
  id: string;
  name: string;
  title: string;
  rate: string;
  description: string;
}

export default function SavedTalentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState('Saved talent');

  const savedFreelancers: SavedFreelancer[] = [
    {
      id: '1',
      name: 'Rylan C.',
      title: 'Web Scraper',
      rate: '$50.00',
      description: "I'm a web scraper specialist skilled in extracting valuable data from various online sources. Whether you're aiming to gather insights, analyze competitors, or acquire specific online content, I'm here to assist. Proficient in Python, Scrapy, BeautifulSoup, and Playwright. Knowledgeable in handling CAPTCHAs, dynamic websites, and rate limits. Full scraping pipeline management from data acquisition to storage..."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* List Selector */}
        <div className="relative mb-6">
          <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-gray-900">{selectedList}</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder='Search in "Saved talent"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#14a800] focus:border-[#14a800]"
          />
        </div>

        {/* Freelancer List */}
        <div className="space-y-6">
          {savedFreelancers.map((freelancer) => (
            <div key={freelancer.id} className="border-b border-gray-200 pb-6">
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
                    <div className="relative">
                      <ProfileImage size="mlg" />
                      <div className="absolute top-[3px] right-[3px] w-3.5 h-3.5 rounded-full bg-[#14a800] border-[2.5px] border-white"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-1">
                      {freelancer.name}
                    </h2>
                    <p className="text-gray-900 mb-2">{freelancer.title}</p>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span>{freelancer.rate}/hr</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-[#14a800] font-medium hover:text-[#14a800]/90">
                    Message
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="h-5 w-5 text-gray-400 fill-current" />
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
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 mt-6">
          <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg">
            1
          </button>
          <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
