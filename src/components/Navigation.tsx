'use client';

import { Search, Bell, CloudDownload, ChevronDown, MessageSquare, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ProfileImage from '@/components/ProfileImage';
import { getBrowserClient } from '@/lib/supabase';

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

interface UserProfile {
  id: string;
  display_name: string;
  member_type: string;
  avatar_url?: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const supabase = getBrowserClient();
  
  const hireDropdownRef = useRef<HTMLDivElement>(null);
  const manageDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const getProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        router.push('/auth/login');
      } else if (session) {
        getProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hireDropdownRef.current &&
        !hireDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        manageDropdownRef.current &&
        !manageDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      isRead: true
    }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-blue-600 text-xl font-bold">
                ScrapeNexus
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'hire' ? null : 'hire')}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Hire talent
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'hire' && (
                  <div
                    ref={hireDropdownRef}
                    className="absolute z-10 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <Link
                      href="/hire/post-job"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Post a Job
                    </Link>
                    <Link
                      href="/hire/talent"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Find Talent
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'manage' ? null : 'manage')}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Manage work
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'manage' && (
                  <div
                    ref={manageDropdownRef}
                    className="absolute z-10 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <Link
                      href="/manage/jobs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      All Jobs
                    </Link>
                    <Link
                      href="/manage/contracts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      All Contracts
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <MessageSquare className="h-6 w-6" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                </button>
                {showNotifications && (
                  <div
                    ref={notificationsRef}
                    className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2"
                >
                  <ProfileImage
                    src={profile?.avatar_url}
                    alt={profile?.display_name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                {showProfileMenu && (
                  <div
                    ref={profileMenuRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {profile?.member_type === 'seller' ? (
                      <Link
                        href="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Seller Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/buyer/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Buyer Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
