'use client';

import { useState } from 'react';
import { MoreHorizontal, RotateCcw, Upload } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';
import MilestoneTimeline from '@/components/MilestoneTimeline';

interface ProjectStats {
  projectPrice: number;
  inEscrow: number;
  milestonesPaid: number;
  milestonesRemaining: number;
  totalCharges: number;
}

export default function MilestonePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const projectStats: ProjectStats = {
    projectPrice: 250.00,
    inEscrow: 0.00,
    milestonesPaid: 250.00,
    milestonesRemaining: 0.00,
    totalCharges: 260.00
  };

  const milestones = [
    {
      title: 'Automate Execution and Reporting of Cucumber Tests',
      amount: 25.00,
      status: 'paid' as const
    },
    {
      title: 'Google Sheet Report',
      amount: 225.00,
      description: 'As discussed',
      status: 'paid' as const
    }
  ];

  const recentFiles = [
    {
      name: 'loginfail.png',
      size: '28.02 kB',
      uploadedBy: 'Steven Greenbaum',
      uploadTime: '7:31 AM',
      message: 'all failed in login step in scheduled run last night'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Project Header */}
      <div className="bg-[#1C4532] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold mb-4">
                Automate Execution and Reporting of Cucumber Tests
              </h1>
              <div className="flex items-center gap-3">
                <ProfileImage size="lg" />
                <div>
                  <h2 className="font-medium">Shivam Kumar</h2>
                  <p className="text-sm opacity-80">India · Wed 3:56 AM</p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-5 gap-8">
            <div>
              <p className="text-sm text-gray-600">Project price</p>
              <p className="text-xl font-medium">${projectStats.projectPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Fixed-price</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">In escrow</p>
              <p className="text-xl font-medium">${projectStats.inEscrow.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones paid (2)</p>
              <p className="text-xl font-medium">${projectStats.milestonesPaid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones remaining (0)</p>
              <p className="text-xl font-medium">${projectStats.milestonesRemaining.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total charges</p>
              <p className="text-xl font-medium">${projectStats.totalCharges.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {['Overview', 'Messages', 'Contract details'].map((tab) => (
              <button
                key={tab}
                className={`py-4 ${
                  activeTab === tab.toLowerCase()
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2">
            <MilestoneTimeline milestones={milestones} />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent files</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#14A800] text-white rounded-full hover:bg-[#14A800]/90">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
              </div>

              {recentFiles.map((file, index) => (
                <div key={index} className="mt-4">
                  <div className="flex items-start gap-3">
                    <ProfileImage size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{file.uploadedBy}</p>
                        <span className="text-sm text-gray-500">{file.uploadTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{file.message}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-500">{file.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
