'use client';

import { Heart, Flag, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface JobDetails {
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
}

interface JobDetailsClientProps {
  job: JobDetails;
}

export default function JobDetailsClient({ job }: JobDetailsClientProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Heart className="h-5 w-5" />
                Save job
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Flag className="h-5 w-5" />
                Flag as inappropriate
              </button>
            </div>
          </div>

          {/* Post Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>Posted {formatDate(job.created_at)}</span>
            {job.project_location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.project_location}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p>{job.description}</p>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Skills and Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Activity on this job</h3>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">Connects required: </span>
                {job.connects_required}
              </div>
              <div>
                <span className="font-medium text-gray-900">Available Connects: </span>
                81
              </div>
            </div>
          </div>

          {/* About the client */}
          <div className="border-t mt-8 pt-6">
            <h3 className="font-medium mb-4">About the client</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                {job.payment_verified && (
                  <span className="text-green-600">✓ Payment method verified</span>
                )}
              </div>
              <div>
                <span className="text-yellow-400">{'★'.repeat(Math.round(job.rating))}</span>
                <span className="text-gray-400">{'★'.repeat(5 - Math.round(job.rating))}</span>
                <span className="ml-2">{job.rating} of {job.reviews_count} reviews</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Total spent: </span>
                ${job.total_spent.toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-gray-900">Jobs posted: </span>
                {job.jobs_posted}
              </div>
              <div>
                <span className="font-medium text-gray-900">Hire rate: </span>
                {job.hire_rate}%
              </div>
              <div>
                <span className="font-medium text-gray-900">Hours billed: </span>
                {job.hours_billed}
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6">
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
            Apply Now
          </button>
        </div>
      </main>
    </div>
  );
}
