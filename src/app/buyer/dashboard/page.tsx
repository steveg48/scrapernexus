'use client';

import { MoreHorizontal, MessageSquare, Users, Mail, Check } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';

interface Job {
  id: number;
  title: string;
  status: 'open' | 'active';
  createdAt: string;
  freelancer?: {
    name: string;
    message?: string;
  };
  stats: {
    invited: number;
    maxInvites: number;
    proposals: number;
    newProposals: number;
    messages: number;
    hired: number;
    maxHired: number;
  };
}

export default function Dashboard() {
  const jobs: Job[] = [
    {
      id: 1,
      title: "Retool Table Modification: Dropdown Implementation",
      status: "open",
      createdAt: "11 days ago",
      freelancer: {
        name: "Shivam Kumar"
      },
      stats: {
        invited: 0,
        maxInvites: 30,
        proposals: 6,
        newProposals: 2,
        messages: 1,
        hired: 0,
        maxHired: 1
      }
    },
    {
      id: 2,
      title: "Automate Execution and Reporting of Cucumber Tests",
      status: "active",
      createdAt: "Started Aug 25",
      freelancer: {
        name: "Shivam Kumar",
        message: "Fund a new milestone for Shivam to keep working"
      },
      stats: {
        invited: 0,
        maxInvites: 30,
        proposals: 0,
        newProposals: 0,
        messages: 0,
        hired: 1,
        maxHired: 1
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-[32px] font-normal text-gray-900">Hi, Steven</h1>
          <Link 
            href="/buyer/post-job/title"
            className="inline-flex items-center px-6 py-2.5 bg-[#14a800] hover:bg-[#14a800]/90 text-white rounded-md text-base font-medium"
          >
            <span className="mr-1">+</span> Post a job
          </Link>
        </div>

        <h2 className="text-[32px] font-normal text-gray-900 mt-8 mb-6">Overview</h2>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <ProfileImage size="md" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      {job.freelancer && (
                        <p className="text-gray-600 mt-1">{job.freelancer.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="px-6 py-2.5 bg-[#14a800] text-white rounded-md hover:bg-[#14a800]/90 font-medium">
                      {job.status === 'open' ? 'Review proposals' : 'Fund & activate milestone'}
                    </button>
                    {job.status === 'active' && (
                      <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 border border-[#039625]">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-[#039625]">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                    job.status === 'open' 
                      ? 'bg-[#0d6efd] text-white' 
                      : 'bg-[#14a800] text-white'
                  }`}>
                    {job.status === 'open' ? 'Open job post' : 'Active contract'}
                  </span>
                  <span className="text-gray-500 text-sm">Created {job.createdAt}</span>
                </div>

                {job.status === 'open' && (
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full border border-[#039625]">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">Invited</span>
                        <span className="text-gray-900">{job.stats.invited}/{job.stats.maxInvites}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full border border-[#039625]">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">Proposals</span>
                        <span className="text-gray-900">
                          {job.stats.proposals} {job.stats.newProposals > 0 && `(${job.stats.newProposals} new)`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full border border-[#039625]">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">Messaged</span>
                        <span className="text-gray-900">{job.stats.messages}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full border border-[#039625]">
                        <Check className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">Hired</span>
                        <span className="text-gray-900">{job.stats.hired}/{job.stats.maxHired}</span>
                      </div>
                    </div>
                  </div>
                )}

                {job.freelancer?.message && (
                  <div className="text-gray-600">{job.freelancer.message}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}