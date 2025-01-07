'use client';

import { useState } from 'react';
import { Search, Plus, Menu } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProfileImage from '@/components/ProfileImage';
import Link from 'next/link';

interface Message {
  id: number;
  user: {
    name: string;
    avatar?: string;
    status?: 'Available' | 'Offline' | 'Away';
  };
  lastMessage: string;
  date: string;
  responseTime?: string;
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(1); // Set first chat as selected

  const messages: Message[] = [
    {
      id: 1,
      user: {
        name: 'Atef Bahri',
        status: 'Available'
      },
      lastMessage: 'Hi',
      date: '12/27/24',
      responseTime: '2h response time'
    },
    {
      id: 2,
      user: {
        name: 'Prince Ezra'
      },
      lastMessage: 'Debugging Login Function ...',
      date: '12/25/24'
    },
    {
      id: 3,
      user: {
        name: 'Zhanial Salki'
      },
      lastMessage: 'Debugging Login Function ...',
      date: '12/24/24'
    }
  ];

  const selectedChatMessages = [
    {
      id: 1,
      sender: 'Atef Bahri',
      time: '6:07 PM',
      content: `Hi,
      
I am a skilled and experienced Retool developer with over 3 years of experience in building internal tools for various clients and industries. I am proficient in creating user-friendly, efficient, and scalable solutions that solve business problems and improve workflows.

Working on Retool for the past 2 years, I have built and maintained over 20 internal tools using Retool, JavaScript, SQL, and RESTful APIs for various departments, such as sales, marketing, finance, and operations.

I am very confident about your job and I am available full time in EST/EST timezone. (40 hours per week)

Best regards,
Alex`
    },
    {
      id: 2,
      sender: 'Steven Greenbaum',
      time: '6:07 PM',
      content: 'Are you available tomorrow, Tuesday, @ 9am EST?'
    },
    {
      id: 3,
      sender: 'Steven Greenbaum',
      time: '8:43 AM',
      content: 'are you there?'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Chat List */}
          <div className="w-80 border-r border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-medium">Messages</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Messages List */}
            <div className="space-y-1">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedChat(message.id)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 ${
                    selectedChat === message.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="relative">
                    <ProfileImage size="mlg" />
                    <div className="absolute top-[3px] right-[3px] w-3.5 h-3.5 rounded-full bg-[#14a800] border-[2.5px] border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{message.user.name}</span>
                      <span className="text-xs text-gray-500">{message.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
                    {message.responseTime && (
                      <p className="text-xs text-gray-500 mt-1">{message.responseTime}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ProfileImage size="mlg" />
                      <div className="absolute top-[3px] right-[3px] w-3.5 h-3.5 rounded-full bg-[#14a800] border-[2.5px] border-white"></div>
                    </div>
                    <div>
                      <h2 className="font-medium">Atef Bahri</h2>
                      <p className="text-sm text-gray-500">Available • 2h response time</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {selectedChatMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="text-sm text-gray-500">{msg.time}</span>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-800">{msg.content}</div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="relative">
                    <textarea
                      placeholder="Send a message..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      className="absolute bottom-3 right-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-5 h-5"
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
