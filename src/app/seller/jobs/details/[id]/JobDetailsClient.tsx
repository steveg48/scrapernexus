'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Star, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface JobDetailsClientProps {
  job: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    budget_min?: number;
    budget_max?: number;
    buyer_name: string;
    project_type?: string;
    project_location?: string;
    skills: string[];
    payment_verified: boolean;
    rating: number;
    reviews_count: number;
    total_spent: number;
    hire_rate: number;
    jobs_posted: number;
    hours_billed: number;
    connects_required: number;
  };
}

export default function JobDetailsClient({ job }: JobDetailsClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number | undefined) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_posting_id: job.id
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleDislikeClick = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Posted {formatDate(job.created_at)}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full ${
                isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-100 hover:text-red-600 transition-colors`}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={handleDislikeClick}
              className={`p-2 rounded-full ${
                isDisliked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-100 hover:text-red-600 transition-colors`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left column - Job details */}
        <div className="col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Client info and activity */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">
                  {formatBudget(job.budget_min)} - {formatBudget(job.budget_max)}
                </p>
              </div>

              {job.project_type && (
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="font-medium">{job.project_type}</p>
                </div>
              )}

              {job.project_location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                  <p className="font-medium">{job.project_location}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Connects Required</p>
                <p className="font-medium">{job.connects_required}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <p className="font-medium">{job.buyer_name}</p>
                {job.payment_verified && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Payment Verified
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{job.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({job.reviews_count} reviews)
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(job.total_spent)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Hire Rate</p>
                <p className="font-medium">{job.hire_rate}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Jobs Posted</p>
                <p className="font-medium">{job.jobs_posted}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Hours Billed</p>
                <p className="font-medium">{job.hours_billed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
