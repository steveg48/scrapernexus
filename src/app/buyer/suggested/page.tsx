'use client';

import { useState } from 'react';
import { Zap, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import ProfileImage from '@/components/ProfileImage';

interface Freelancer {
  id: number;
  name: string;
  title: string;
  location: string;
  rate: string;
  jobSuccess: string;
  skills: string[];
  boosted: boolean;
  earned?: string;
}

export default function SuggestedPage() {
  const [likedFreelancers, setLikedFreelancers] = useState<number[]>([]);
  const router = useRouter();

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent card click when clicking heart
    setLikedFreelancers(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const navigateToProfile = (id: number) => {
    router.push(`/freelancer/${id}`);
  };

  const freelancers: Freelancer[] = [
    {
      id: 1,
      name: 'Eliana I.',
      title: 'Expert Visual Designer | Branding Identity Design | Creative Ad Design',
      location: 'Buenos Aires, Buenos Aires F.D',
      rate: '$50.00/hr',
      jobSuccess: '92%',
      skills: ['Web Design', 'Graphic Design'],
      boosted: true
    },
    {
      id: 2,
      name: 'Rizwan S.',
      title: 'White Paper | Company profile | Pitch Deck | eBook | Annual Report',
      location: 'Faisalabad, Punjab',
      rate: '$35.00/hr',
      jobSuccess: '100%',
      skills: ['Graphic Design'],
      boosted: true
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
      earned: '$1K+'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-medium text-gray-900">Suggested Freelancers</h1>
        <p className="text-sm text-gray-500 mt-1">3 invites left</p>

        <div className="space-y-4 mt-6">
          {freelancers.map((freelancer) => (
            <div 
              key={freelancer.id} 
              className="bg-white rounded-lg border border-[#e0e6ef] p-6 transition-colors duration-200 hover:bg-gray-50 cursor-pointer" 
              onClick={() => navigateToProfile(freelancer.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-start gap-4">
                  {/* Logo Image */}
                  <div className="w-[100px] h-[100px] bg-[#f7f9fc] rounded border border-[#e0e6ef] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Profile Avatar */}
                  <div className="-ml-2 mt-1 relative">
                    <ProfileImage size="mlg" />
                    <div className="absolute top-[3px] right-[3px] w-3.5 h-3.5 rounded-full bg-[#14a800] border-[2.5px] border-white"></div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-medium text-gray-900 hover:underline cursor-pointer">
                          {freelancer.name}
                        </h2>
                        {freelancer.boosted && (
                          <span className="text-[#0d6efd] text-xs flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            Boosted
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2 hover:underline cursor-pointer">{freelancer.title}</p>
                      <div className="text-gray-500 text-xs mt-1">
                        {freelancer.location}
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-2">
                        <span className="text-gray-900 font-semibold">{freelancer.rate}</span>
                        <span className="text-[#0d6efd] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          {freelancer.jobSuccess} Job Success
                        </span>
                        {freelancer.earned && (
                          <span className="text-gray-700">{freelancer.earned} earned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        className={`w-8 h-8 flex items-center justify-center rounded-full border border-[#14a800] transition-colors duration-200 hover:bg-gray-500 group ${likedFreelancers.includes(freelancer.id) ? 'bg-white' : ''}`}
                        onClick={(e) => toggleLike(e, freelancer.id)}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={likedFreelancers.includes(freelancer.id) ? "#ff0000" : "none"} 
                          className="transition-colors duration-200 group-hover:stroke-white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M19.5 12.5719L12 19.9999L4.5 12.5719C4.0053 12.0905 3.61564 11.5119 3.35554 10.8726C3.09545 10.2332 2.97056 9.54688 2.98873 8.85687C3.00691 8.16685 3.16776 7.48812 3.46115 6.86333C3.75455 6.23854 4.17413 5.68126 4.69348 5.22721C5.21283 4.77316 5.82092 4.43073 6.47721 4.21994C7.13349 4.00914 7.82327 3.93483 8.50476 4.00168C9.18625 4.06853 9.84651 4.27503 10.4425 4.60973C11.0384 4.94443 11.5566 5.39897 11.9625 5.94589L12 5.99989L12.0375 5.94589C12.4434 5.39897 12.9616 4.94443 13.5575 4.60973C14.1535 4.27503 14.8137 4.06853 15.4952 4.00168C16.1767 3.93483 16.8665 4.00914 17.5228 4.21994C18.1791 4.43073 18.7872 4.77316 19.3065 5.22721C19.8259 5.68126 20.2455 6.23854 20.5389 6.86333C20.8322 7.48812 20.9931 8.16685 21.0113 8.85687C21.0294 9.54688 20.9046 10.2332 20.6445 10.8726C20.3844 11.5119 19.9947 12.0905 19.5 12.5719Z" 
                            stroke={likedFreelancers.includes(freelancer.id) ? "#14a800" : "#94A3B8"} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="group-hover:stroke-white"
                          />
                        </svg>
                      </button>
                      <button className="h-8 px-4 text-[#14a800] border border-[#14a800] rounded-[4px] text-sm hover:bg-[#14a800]/5">
                        Hire
                      </button>
                      <button className="h-8 px-4 bg-[#14a800] text-white rounded-[4px] text-sm hover:bg-[#14a800]/90">
                        Invite to Job
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1.5">
                      Here are their top {freelancer.skills.length} relevant skills to your job
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#a9effc] rounded-full text-gray-700 text-xs"
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
      </main>
    </div>
  );
}
