'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronRight, Crown, Award, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NotificationPopup from '@/components/NotificationPopup';

interface Profile {
  id?: string;
  display_name: string;
  member_type?: string;
  created_at?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  data_fields: Record<string, any>;
  frequency: string;
}

const carouselItems = [
  {
    title: "Upgrade your profile",
    description: "Add your portfolio and skills to attract\nmore clients and opportunities.",
    buttonText: "Upgrade now",
    icon: UserCircle2,
    bgColor: "#3c8dd5"
  }
];

interface DashboardClientProps {
  initialProfile: Profile;
  initialProjects: Project[];
}

export default function DashboardClient({ 
  initialProfile,
  initialProjects 
}: DashboardClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8">
            {/* Upgrade Profile Card */}
            <div className="bg-[#3c8dd5] rounded-lg p-6 mb-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Upgrade your profile</h2>
                  <p className="mb-4">Add your portfolio and skills to attract<br />more clients and opportunities.</p>
                  <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100">
                    Upgrade now
                  </button>
                </div>
                <div>
                  <UserCircle2 className="h-24 w-24 text-white/80" />
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Jobs you might like</h2>
                <div className="flex space-x-4">
                  <button className="text-blue-600 font-medium">Be the 1st to apply</button>
                  <button className="text-gray-600">Most Recent</button>
                  <button className="text-gray-600">U.S. Only</button>
                  <button className="text-gray-600">Saved Jobs (1)</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.</p>
              
              {/* Job Listings */}
              {initialProjects.map((project) => (
                <div key={project.id} className="border-t py-4">
                  <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(project.data_fields).map(([key, value]) => (
                      <span key={key} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <img
                  src="/avatar-placeholder.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="font-semibold">{initialProfile.display_name}</h2>
                  <p className="text-gray-600">System Engineer, Sr.</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Profile Completion</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <Link href="/profile" className="text-green-600 hover:underline text-sm">
                Complete your profile
              </Link>
            </div>

            {/* Additional Profile Sections */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Availability badge</span>
                  <span className="text-gray-400">Off</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Boost your profile</span>
                  <span className="text-gray-400">Off</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Connects: 71</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Preferences</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Payments</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
