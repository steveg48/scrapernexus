'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import supabaseClient from '@/lib/supabaseClient';

interface OnlineStatusContextType {
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateLastSeen = async () => {
      const client = supabaseClient;
      const { data: { session } } = await client.auth.getSession();
      
      if (session) {
        await client
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', session.user.id);

        // Fetch current status from the view
        const { data } = await client
          .from('user_status')
          .select('is_online')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setIsOnline(data.is_online);
        }
      }
    };

    // Update status when component mounts
    updateLastSeen();

    // Set up interval to update status periodically
    const interval = setInterval(updateLastSeen, 60000); // Every minute

    // Set up visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateLastSeen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up online/offline handlers
    const handleOnline = () => {
      updateLastSeen();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
