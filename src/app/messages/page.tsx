'use client';

import { useState } from 'react';
import { Search, Plus, LayoutList, UserCircle2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

interface Message {
  id: number;
  sender: string;
  preview: string;
  date: string;
  avatar?: string;
  messages?: {
    time: string;
    content: string;
    sender: string;
  }[];
}

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const messages: Message[] = [
    {
      id: 1,
      sender: 'Atef Bahri',
      preview: 'Retool Table Modification: D...',
      date: '01/27/24',
      messages: [
        {
          time: '4:07 PM',
          content: `Hi\n\nI am a skilled and experienced Retool developer with over 3 years of experience in building internal tools for various clients and industries. I am proficient in creating user-friendly, efficient, and scalable solutions that solve business problems and improve workflows.\n\nWorking on Retool for the past 2 years, I have built and maintained over 70 internal tools using React, JavaScript, SQL, and RESTful APIs for various departments, such as sales, marketing, finance, and operations.\n\nI am very confident about your job and I am available full time in CET/EST timezone. (40 hours per week)\n\nBest regards,\nAlex`,
          sender: 'Atef Bahri'
        }
      ]
    },
    {
      id: 2,
      sender: 'Prince Ezra',
      preview: 'Debugging Login Function i...',
      date: '01/25/24'
    },
    {
      id: 3,
      sender: 'Zhenaf Salik',
      preview: 'Debugging Login Function i...',
      date: '01/24/24'
    },
    {
      id: 4,
      sender: 'Ryan Katayi',
      preview: 'You: Hi, how do we do this. W...',
      date: '01/24/24'
    },
    {
      id: 5,
      sender: 'Prayesh Jain',
      preview: 'Need Help Getting Articule ...',
      date: '7/4/24'
    },
    {
      id: 6,
      sender: 'Vandana Mehta',
      preview: 'Need Help Getting Articule ...',
      date: '10/23/23'
    },
    {
      id: 7,
      sender: 'Andrii Beresiuk',
      preview: 'Need Help Getting Art...',
      date: '10/22/23'
    }
  ];

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex h-[calc(100vh-64px)]">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-semibold text-[#206b31] hover:text-[#039625]">
                    Messages
                  </h1>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                      <Plus className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                      <LayoutList className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Message List */}
                <div className="space-y-1">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full p-3 flex items-start gap-3 rounded-lg hover:bg-gray-50 ${
                        selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {message.avatar ? (
                          <Image
                            src={message.avatar}
                            alt={message.sender}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <UserCircle2 className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.sender}
                          </p>
                          <p className="text-xs text-gray-500">{message.date}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {message.preview}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <UserCircle2 className="h-10 w-10 text-gray-400" />
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedMessage.sender}
                      </h2>
                      <p className="text-sm text-gray-500">Available • 2h response time</p>
                    </div>
                  </div>
                  {selectedMessage.messages?.map((msg, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{msg.sender}</span>
                        <span className="text-sm text-gray-500">{msg.time}</span>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-600">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {/* Message Input */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Send a message..."
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a message to view the conversation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
