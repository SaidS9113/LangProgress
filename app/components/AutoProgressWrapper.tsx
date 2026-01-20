'use client';

import { useAutoProgress } from '@/hooks/useAutoProgress';
import { useEffect, useState, useRef } from 'react';
import RealtimeProgressIndicator from './RealtimeProgressIndicator';

interface AutoProgressWrapperProps {
  children: React.ReactNode;
  minTimeOnPage?: number;
}

export default function AutoProgressWrapper({ 
  children, 
  minTimeOnPage = 6000 
}: AutoProgressWrapperProps) {
  
  const [timeOnPage, setTimeOnPage] = useState(0);

  const timeTrackerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    currentPageInfo,
    hasValidated,
    getTimeOnCurrentPage,
  } = useAutoProgress({
    minTimeOnPage,
    enabled: true
  });

  useEffect(() => {
    if (hasValidated) {
      return;
    }

    timeTrackerRef.current = setInterval(() => {
      const elapsed = getTimeOnCurrentPage();
      setTimeOnPage(elapsed);
      
      if (elapsed >= minTimeOnPage) {
        if (timeTrackerRef.current) {
          clearInterval(timeTrackerRef.current);
          timeTrackerRef.current = null;
        }
      }
    }, 100);

    return () => {
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasValidated) {
      setTimeOnPage(0);

      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }

      timeTrackerRef.current = setInterval(() => {
        const elapsed = getTimeOnCurrentPage();
        setTimeOnPage(elapsed);

        if (elapsed >= minTimeOnPage) {
          if (timeTrackerRef.current) {
            clearInterval(timeTrackerRef.current);
            timeTrackerRef.current = null;
          }
        }
      }, 100);

      return () => {
        if (timeTrackerRef.current) {
          clearInterval(timeTrackerRef.current);
        }
      };
    }
  }, [hasValidated, getTimeOnCurrentPage, minTimeOnPage]);

  if (!currentPageInfo) {
    return <>{children}</>;
  }

  return (
<div className="relative">
  {children}

  <RealtimeProgressIndicator isValidated={hasValidated} />
</div>

  );
}