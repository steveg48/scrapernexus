'use client';

import { Search, Bell, CloudDownload, MessageSquare, X, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ProfileImage from '@/components/ProfileImage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

export default function SellerNavigation() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const notifications = [
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
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const handleProfileMenuClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const dismissNotification = (id: number) => {
    console.log('Dismissing notification:', id);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowNotifications(false);
      setShowProfileMenu(false);
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check notifications menu
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      
      // Check profile menu independently
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50">
      <nav className="bg-white border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/seller/dashboard" className="flex items-center">
                <span className="text-[24px] font-semibold text-[#3c8dd5]">
                  ScrapeNexus
                </span>
                <CloudDownload className="ml-1 h-6 w-6 text-[#FF69B4]" />
              </Link>

              {/* Nav Links */}
              <div className="ml-10 flex items-center space-x-8">
                <button
                  onClick={() => {
                    router.push('/seller/jobs');
                  }}
                  className={`text-[15px] text-gray-600 hover:text-[#14a800] font-medium ${pathname.startsWith('/seller/jobs') ? 'text-[#14a800]' : ''}`}
                >
                  Find work
                </button>

                <button
                  onClick={() => {
                    router.push('/seller/contracts');
                  }}
                  className={`text-[15px] text-gray-600 hover:text-[#14a800] font-medium ${pathname.startsWith('/seller/contracts') ? 'text-[#14a800]' : ''}`}
                >
                  Deliver work
                </button>

                <button
                  onClick={() => {
                    router.push('/seller/finances');
                  }}
                  className={`text-[15px] text-gray-600 hover:text-[#14a800] font-medium ${pathname.startsWith('/seller/finances') ? 'text-[#14a800]' : ''}`}
                >
                  Manage finances
                </button>

                <button
                  onClick={() => {
                    router.push('/messages');
                  }}
                  className="inline-flex items-center text-[15px] text-gray-600 hover:text-[#14a800] font-medium"
                >
                  Messages
                  <span className="inline-flex items-center justify-center ml-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4">
                    1
                  </span>
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Help */}
              <button className="text-gray-600 hover:text-[#14a800]">
                <span className="text-xl">?</span>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={handleNotificationsClick}
                  className="text-gray-600 hover:text-[#14a800]"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      <div className="mt-2 space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                            </div>
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="ml-4 text-gray-400 hover:text-gray-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative z-50" ref={profileMenuRef}>
                <button
                  onClick={handleProfileMenuClick}
                  className="flex items-center space-x-2"
                >
                  <div className="relative">
                    <img
                      src="/images/default-avatar.svg"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    {user && (
                      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center pointer-events-auto"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
