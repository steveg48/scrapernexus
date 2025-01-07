'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Pencil, Plus, Link2, Share } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Image
                src="/images/default-avatar.svg"
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200">
                <Pencil className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div>
              <h1 className="text-3xl font-semibold mb-2">Steven G.</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Aventura, FL – 4:45 pm local time</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 border border-[#14a800] text-[#14a800] rounded-full hover:bg-[#14a800]/5">
              See public view
            </button>
            <button className="px-4 py-2 bg-[#14a800] text-white rounded-full hover:bg-[#14a800]/90">
              Profile settings
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-72">
            <div className="mb-8">
              <button className="flex items-center gap-2 text-lg font-medium mb-4">
                <span>View profile</span>
                <Plus className="h-5 w-5" />
                <Pencil className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">Draft</span>
                <span className="text-gray-600">Systems Engineering</span>
              </div>
              <button className="flex items-center justify-between w-full text-gray-700 py-2">
                <span>All work</span>
                <span className="text-gray-400">›</span>
              </button>
            </div>

            <div className="bg-[#f9f9fb] p-4 rounded-lg mb-8">
              <h3 className="text-sm text-gray-500 mb-2">Private to you</h3>
              <p className="text-sm text-[#14a800] mb-2">
                Get Connects and tools to develop new skills, improve your efficiency with AI, and customize your settings to grow your business with Freelancer Plus.{' '}
                <a href="#" className="text-[#14a800] underline">Upgrade plan</a>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <span className="font-medium">Availability badge</span>
                  <p className="text-sm text-gray-500">Off</p>
                </div>
                <Pencil className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <span className="font-medium">Boost your profile</span>
                  <p className="text-sm text-gray-500">Off</p>
                </div>
                <Pencil className="h-5 w-5 text-gray-400" />
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Connects: 71</h3>
                <div className="flex gap-4 text-sm">
                  <button className="text-[#14a800]">View details</button>
                  <span className="text-gray-300">|</span>
                  <button className="text-[#14a800]">Buy Connects</button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium flex items-center gap-2">
                System Engineer, Excel & Excel VBA
                <Pencil className="h-5 w-5" />
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium">$60.00/hr</span>
                <Pencil className="h-5 w-5" />
                <Link2 className="h-5 w-5" />
              </div>
            </div>

            <div className="mb-8 relative">
              <p className="text-gray-700 mb-4">
                I am a retired System Engineer (B.E.E.) that worked in the aerospace industry. In addition to system design of complex electronic systems I wrote hardware and software requirements, technical specifications and test procedures. I used Excel and Excel vba throughout my career and taught it to my colleagues.
              </p>
              <p className="text-gray-700 mb-4">
                Most recently I have been using Power Automate Desktop in webscraping applications. In conjunction with this I have written excel vba macros to perform support functions....
              </p>
              <button className="text-[#14a800]">more</button>
              <button className="absolute top-0 right-0">
                <Pencil className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Portfolio</h2>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Plus className="h-6 w-6" />
                </button>
              </div>

              <div className="border-b border-gray-200 mb-4">
                <button className="px-4 py-2 border-b-2 border-gray-900 font-medium">Published</button>
                <button className="px-4 py-2 text-gray-600">Drafts</button>
              </div>

              <div className="text-center py-12">
                <Image
                  src="/images/portfolio-empty.svg"
                  alt="Empty portfolio"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <p className="text-gray-700 mb-2">
                  Add a project. Talent are hired 9x more often if they've published a portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
