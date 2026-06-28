'use client';

import { useEffect, useState } from 'react';
import { getQueue, processQueue, isOnline } from '@/lib/offline-queue';
import { toast } from 'sonner';

export function useOfflineSync() {
  useEffect(() => {
    const handleOnline = async () => {
      const queue = getQueue();
      if (queue.length > 0) {
        await processQueue();
        toast.success('SYNCED', {
          description: `${queue.length} actions synchronized.`,
        });
      }
    };

    window.addEventListener('online', handleOnline);
    
    // Check on mount in case we missed the event
    if (isOnline() && getQueue().length > 0) {
      handleOnline();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, []);
}

export function OfflineIndicator() {
  useOfflineSync();

  const [isOffline, setIsOffline] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setIsOffline(!navigator.onLine);
      setQueueCount(getQueue().length);
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    // Listen for storage changes (other tabs)
    const handleStorage = () => setQueueCount(getQueue().length);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!isOffline && queueCount === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#1A1A1A] border-b border-[#C41E1E] py-2 px-4 text-center">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C41E1E]">
        {isOffline ? `OFFLINE — ${queueCount} ACTIONS QUEUED` : `${queueCount} ACTIONS PENDING SYNC`}
      </p>
    </div>
  );
}
