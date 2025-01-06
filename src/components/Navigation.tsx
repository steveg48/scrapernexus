'use client';

import { Search, Bell, CloudDownload, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ProfileImage from '@/components/ProfileImage';

export default function Navigation() {
  const pathname = usePathname();
  const [hireDropdownOpen, setHireDropdownOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);

  const handleHireClick = () => {
    setHireDropdownOpen(!hireDropdownOpen);
    if (!hireDropdownOpen) {
      setManageDropdownOpen(false);
    }
  };

  const handleManageClick = () => {
    setManageDropdownOpen(!manageDropdownOpen);
    if (!manageDropdownOpen) {
      setHireDropdownOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/buyer/dashboard" className="flex items-center">
              <span className="text-[24px] font-semibold text-[#3c8dd5]">
                ScrapeNexus
              </span>
              <CloudDownload className="ml-1 h-8 w-8 text-[#FF69B4]" />
            </Link>

            {/* Nav Links */}
            <div className="ml-8 flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="flex items-center text-[16px] text-gray-600 hover:text-gray-900"
                  onClick={handleHireClick}
                >
                  <span>Hire talent</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {hireDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Manage jobs and offers</div>
                      <Link href="/buyer/jobs" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Job posts and proposals
                      </Link>
                      <Link href="/buyer/offers" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Pending offers
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Find freelancers</div>
                      <Link href="/buyer/post-job" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Post a job
                      </Link>
                      <Link href="/buyer/suggested" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Search for talent
                      </Link>
                      <Link href="/buyer/hired" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Talent you've hired
                      </Link>
                      <Link href="/buyer/saved" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Talent you've saved
                      </Link>
                      <Link href="/buyer/bring" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Bring talent to Upwork
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  className="flex items-center text-[16px] text-gray-600 hover:text-gray-900"
                  onClick={handleManageClick}
                >
                  <span>Manage work</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {manageDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Active and past work</div>
                      <Link href="/buyer/contracts" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your contracts
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Hourly contract activity</div>
                      <Link href="/buyer/timesheets" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Timesheets
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button className="flex items-center text-[16px] text-gray-600 hover:text-gray-900">
                  <span>Messages</span>
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">1</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-5">
            {/* Search and Talent combined */}
            <div className="flex items-center border border-gray-300 rounded divide-x">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[180px] rounded-l border-0 py-1.5 pl-8 pr-3 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                />
              </div>
              <button className="flex items-center text-[14px] text-gray-600 hover:text-gray-900 px-3 py-1.5">
                <span>Talent</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>

            {/* Notification and other icons */}
            <div className="flex items-center space-x-1">
              <Link href="/help" className="p-2">
                <img src="/question-circle.svg" alt="Help" className="h-7 w-7 text-gray-600" />
              </Link>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-7 w-7" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <Link href="/profile" className="p-2">
                <ProfileImage size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
