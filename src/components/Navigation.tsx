'use client';

import { Search, Bell, CloudDownload, ChevronDown, MessageSquare, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileImage from '@/components/ProfileImage';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

export default function Navigation() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

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

  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const dismissNotification = (id: number) => {
    console.log('Dismissing notification:', id);
  };

  const handleLogout = async () => {
    try {
      setActiveDropdown(null);
      setShowNotifications(false);
      setShowProfileMenu(false);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      router.push('/auth');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-button')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
              {pathname?.includes('/buyer') ? (
                <>
                  <div className="relative">
                    <button 
                      className={`dropdown-button flex items-center text-[16px] ${
                        (pathname?.includes('/post-job') || pathname?.includes('/suggested'))
                          ? 'text-selected-green' 
                          : 'text-gray-600 hover:text-hover-green'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick('hire-talent');
                      }}
                    >
                      <span>Hire talent</span>
                      <ChevronDown className={`ml-1 h-4 w-4`} />
                    </button>
                    {activeDropdown === 'hire-talent' && (
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
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button 
                      className={`dropdown-button flex items-center text-[16px] ${
                        (pathname?.includes('/jobs') || pathname?.includes('/offers') || pathname?.includes('/contracts'))
                          ? 'text-selected-green' 
                          : 'text-gray-600 hover:text-hover-green'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick('manage-work');
                      }}
                    >
                      <span>Manage work</span>
                      <ChevronDown className={`ml-1 h-4 w-4`} />
                    </button>
                    {activeDropdown === 'manage-work' && (
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
                </>
              ) : (
                <>
                  <div className="relative">
                    <button 
                      className={`dropdown-button flex items-center text-[16px] ${
                        pathname?.includes('/find-work')
                          ? 'text-[#14a800]' 
                          : 'text-gray-600 hover:text-[#14a800]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick('find-work');
                      }}
                    >
                      <span>Find work</span>
                      <ChevronDown className={`ml-1 h-4 w-4`} />
                    </button>
                    {activeDropdown === 'find-work' && (
                      <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <Link href="/seller/find-work" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Find Work
                          </Link>
                          <Link href="/seller/saved-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Saved Jobs
                          </Link>
                          <Link href="/seller/proposals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Proposals
                          </Link>
                          <Link href="/seller/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button 
                      className={`dropdown-button flex items-center text-[16px] ${
                        pathname?.includes('/deliver-work')
                          ? 'text-[#14a800]' 
                          : 'text-gray-600 hover:text-[#14a800]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick('deliver-work');
                      }}
                    >
                      <span>Deliver work</span>
                      <ChevronDown className={`ml-1 h-4 w-4`} />
                    </button>
                    {activeDropdown === 'deliver-work' && (
                      <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <Link href="/seller/active-contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Your active contracts
                          </Link>
                          <Link href="/seller/contract-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Contract history
                          </Link>
                          <Link href="/seller/work-diary" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Hourly work diary
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button 
                      className={`dropdown-button flex items-center text-[16px] ${
                        pathname?.includes('/manage-finances')
                          ? 'text-[#14a800]' 
                          : 'text-gray-600 hover:text-[#14a800]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick('manage-finances');
                      }}
                    >
                      <span>Manage finances</span>
                      <ChevronDown className={`ml-1 h-4 w-4`} />
                    </button>
                    {activeDropdown === 'manage-finances' && (
                      <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <Link href="/seller/financial-overview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Financial overview
                          </Link>
                          <Link href="/seller/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Your reports
                          </Link>
                          <Link href="/seller/billings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Billings and earnings
                          </Link>
                          <Link href="/seller/transactions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Transactions and invoices
                          </Link>
                          <Link href="/seller/payments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Payments
                          </Link>
                          <Link href="/seller/withdraw" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Withdraw earnings
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="relative">
                <Link href="/messages" className="relative">
                  <button className="flex items-center text-[16px] text-gray-600 hover:text-[#039625]">
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
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Help icon */}
            <Link href="/help" className="p-2 hover:bg-gray-100 rounded-full">
              <span className="text-2xl font-['Inter'] text-gray-600 hover:text-gray-900">?</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-10">
                  <div className="px-4 py-2 font-semibold border-b">
                    Notifications
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 flex justify-between items-start"
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <div 
                onMouseEnter={() => {
                  setShowProfileMenu(true);
                  setShowNotifications(false);
                }}
                onMouseLeave={() => setShowProfileMenu(false)}
                className="p-2 cursor-pointer"
              >
                <ProfileImage size="sm" isMenuIcon />
                
                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute -right-36 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
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
