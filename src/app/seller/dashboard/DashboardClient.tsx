'use client';

import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, Crown, Award, UserCircle2 } from 'lucide-react';
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
    title: "Freelancer Plus with new perks",
    description: "100 monthly Connects and full access to\nUma, Upwork's Mindful AI.",
    buttonText: "Learn more",
    icon: Crown,
    bgColor: "#1d4354"
  },
  {
    title: "Boost your earning potential",
    description: "Get certified in top skills to stand out\nand win more projects.",
    buttonText: "Get certified",
    icon: Award,
    bgColor: "#108a00"
  },
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {initialProfile.display_name}!</h1>
            <p className="text-gray-600">Here's what's happening with your projects.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            {showNotificationPopup && <NotificationPopup onClose={() => setShowNotificationPopup(false)} />}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-lg shadow">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: index === currentSlide ? 'block' : 'none',
                  backgroundColor: item.bgColor,
                }}
                className="p-6 text-white"
              >
                <item.icon className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm mb-4 whitespace-pre-line">{item.description}</p>
                <button className="text-sm font-semibold px-4 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100">
                  {item.buttonText}
                </button>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Active Projects</h2>
            <Link
              href="/seller/projects/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Find New Projects
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {initialProjects.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>You don't have any active projects yet.</p>
                <p className="mt-2">Start by browsing available projects!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {initialProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4">Status: {project.status}</span>
                          <span>Frequency: {project.frequency}</span>
                        </div>
                      </div>
                      <Link
                        href={`/seller/projects/${project.id}`}
                        className="ml-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
