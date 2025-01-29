'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import supabaseClient from '@/lib/supabaseClient';

interface OnlineStatusContextType {
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = async () => {
      const client = supabaseClient;
      const { data: { session } } = await client.auth.getSession();
      
      if (session) {
        // Update the online status in the profiles table
        await client
          .from('profiles')
          .update({ last_seen: new Date().toISOString(), is_online: true })
          .eq('id', session.user.id);
      }
    };

    // Update status when component mounts
    updateOnlineStatus();

    // Set up interval to update status periodically
    const interval = setInterval(updateOnlineStatus, 60000); // Every minute

    // Set up visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsOnline(true);
        updateOnlineStatus();
      } else {
        setIsOnline(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up online/offline handlers
    const handleOnline = () => {
      setIsOnline(true);
      updateOnlineStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setOnlineStatus = (status: boolean) => {
    setIsOnline(status);
  };

  return (
    <OnlineStatusContext.Provider value={{ isOnline, setOnlineStatus }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  return context;
}
