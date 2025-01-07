'use client';

import { Search, Bell, CloudDownload, ChevronDown, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ProfileImage from '@/components/ProfileImage';

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

export default function Navigation() {
  const pathname = usePathname();
  const [hireDropdownOpen, setHireDropdownOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'A payment of $686.18 has been applied to your financial account.',
      time: '11:47 AM',
      isRead: false
    },
    {
      id: 2,
      message: 'Steven, you can view transaction history for OnPlan as Finance Admin.',
      time: '8:24 AM',
      isRead: false
    },
    {
      id: 3,
      message: 'Don\'t forget to post your saved job draft "U.u7tg79 to8y8y 0978ty 8oy"',
      time: '7:15 AM',
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleHireClick = () => {
    setHireDropdownOpen(!hireDropdownOpen);
    if (!hireDropdownOpen) {
      setManageDropdownOpen(false);
    }
  };

  const handleManageClick = () => {
    setManageDropdownOpen(!manageDropdownOpen);
    if (!manageDropdownOpen) {
      setHireDropdownOpen(false);
    }
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/buyer/dashboard" className="flex items-center">
              <span className="text-[24px] font-semibold text-[#3c8dd5]">
                ScrapeNexus
              </span>
              <CloudDownload className="ml-1 h-10 w-10 text-[#FF69B4]" />
            </Link>

            {/* Nav Links */}
            <div className="ml-8 flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="flex items-center text-[16px] text-gray-600 hover:text-gray-900"
                  onClick={handleHireClick}
                >
                  <span>Hire talent</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {hireDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Manage jobs and offers</div>
                      <Link href="/buyer/jobs" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Job posts and proposals
                      </Link>
                      <Link href="/buyer/offers" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Pending offers
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Find freelancers</div>
                      <Link href="/buyer/post-job" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Post a job
                      </Link>
                      <Link href="/buyer/suggested" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Search for talent
                      </Link>
                      <Link href="/buyer/hired" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Talent you've hired
                      </Link>
                      <Link href="/buyer/saved" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Talent you've saved
                      </Link>
                      <Link href="/buyer/bring" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Bring talent to Upwork
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  className="flex items-center text-[16px] text-gray-600 hover:text-gray-900"
                  onClick={handleManageClick}
                >
                  <span>Manage work</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {manageDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Active and past work</div>
                      <Link href="/buyer/contracts" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your contracts
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-bold text-[#3c8dd5]">Hourly contract activity</div>
                      <Link href="/buyer/timesheets" className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Timesheets
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Link href="/messages" className="relative">
                  <button className="flex items-center text-[16px] text-gray-600 hover:text-gray-900">
                    <span>Messages</span>
                    <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                      <span className="text-sm font-medium text-white">1</span>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-5">
            {/* Search */}
            <div className="flex-1 max-w-3xl px-4">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="border-l border-gray-200">
                  <button className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900">
                    <span className="text-[14px]">Talent</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              {/* Help icon */}
              <Link href="/help" className="p-2 hover:bg-gray-100 rounded-full">
                <span className="text-2xl font-['Inter'] text-gray-600 hover:text-gray-900">?</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-[#14a800]' : 'text-gray-600'}`} />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full">
                      {unreadCount}
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="flex flex-col max-h-[480px]">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[360px] p-4">
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg relative group">
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              <button 
                                onClick={() => dismissNotification(notification.id)}
                                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full"
                              >
                                <X className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 border-t border-gray-200 text-center">
                        <Link 
                          href="/notifications"
                          className="text-[#14a800] hover:text-[#14a800]/90 text-sm font-medium"
                        >
                          See all alerts
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link href="/profile" className="p-2">
                <ProfileImage size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
