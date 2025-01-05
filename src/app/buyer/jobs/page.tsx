'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Freelancer {
  id: number;
  name: string;
  title: string;
  location: string;
  rate: string;
  jobSuccess: string;
  skills: string[];
  boosted: boolean;
  portfolioCount: number;
  earned?: string;
}

export default function JobsPage() {
  const [invitesLeft] = useState(30);
  const router = useRouter();

  const freelancers: Freelancer[] = [
    {
      id: 1,
      name: 'Eliana I.',
      title: 'Expert Visual Designer | Branding Identity Design | Creative Ad Design',
      location: 'Buenos Aires, Buenos Aires F.D',
      rate: '$50.00/hr',
      jobSuccess: '92%',
      skills: ['Web Design', 'Graphic Design'],
      boosted: true,
      portfolioCount: 20
    },
    {
      id: 2,
      name: 'Rizwan S.',
      title: 'White Paper | Company profile | Pitch Deck | eBook | Annual Report',
      location: 'Faisalabad, Punjab',
      rate: '$35.00/hr',
      jobSuccess: '100%',
      skills: ['Graphic Design'],
      boosted: true,
      portfolioCount: 33
    },
    {
      id: 3,
      name: 'Asher Wall M.',
      title: 'UI/UX Designer | SaaS | Figma | Branding | Pitch Deck | Web Design',
      location: 'Dallas, TX',
      rate: '$30.00/hr',
      jobSuccess: '81%',
      skills: ['Web Design', 'Graphic Design'],
      boosted: true,
      portfolioCount: 15,
      earned: '$1K+'
    }
  ];

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Scrape Product Data from E-commerce Websites with Price and Availability Tracking
            </h1>
          </div>
          <p className="text-gray-600 mb-8">{invitesLeft} invites left</p>

          {/* Freelancer List */}
          <div className="space-y-4">
            {freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-300"
              >
                <div className="flex gap-6">
                  {/* Portfolio Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <div className="text-gray-400">No portfolio image yet</div>
                    <div className="absolute bottom-2 left-2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded">
                      {freelancer.portfolioCount} of {freelancer.portfolioCount}
                    </div>
                  </div>

                  {/* Freelancer Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-medium text-gray-900">
                            {freelancer.name}
                          </h2>
                          {freelancer.boosted && (
                            <span className="text-blue-600 text-sm">★ Boosted</span>
                          )}
                        </div>
                        <p className="text-gray-900 mb-2">{freelancer.title}</p>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4" />
                          {freelancer.location}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{freelancer.rate}</span>
                          <span className="text-blue-600">{freelancer.jobSuccess} Job Success</span>
                          {freelancer.earned && (
                            <span>{freelancer.earned} earned</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="px-4 py-2 text-custom-green border border-custom-green rounded-lg hover:bg-custom-green/5">
                          Hire
                        </button>
                        <button className="px-4 py-2 bg-custom-green text-white rounded-lg hover:bg-custom-green/90">
                          Invite to Job
                        </button>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Here are their top {freelancer.skills.length} relevant skills to your job
                      </p>
                      <div className="flex gap-2">
                        {freelancer.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
