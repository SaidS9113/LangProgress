'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUserProgress } from './useUserProgress';
import { useSimpleTimer } from './useSimpleTimer';
import { chapterLessonToGlobalPage } from '@/lib/chapters';

interface UseAutoProgressOptions {
  minTimeOnPage?: number;
  enabled?: boolean;
}

function parsePagePath(pathname: string): { chapterNumber: number; lessonNumber: number; globalPageNumber: number } | null {
  const match = pathname.match(/\/chapters\/(\d+)\/(\d+)/);
  if (match) {
    const chapterNumber = parseInt(match[1], 10);
    const lessonNumber = parseInt(match[2], 10);
    return {
      chapterNumber,
      lessonNumber,
      globalPageNumber: chapterLessonToGlobalPage(chapterNumber, lessonNumber),
    };
  }
  return null;
}

export function useAutoProgress(options: UseAutoProgressOptions = {}) {
  const { minTimeOnPage = 6000, enabled = true } = options;
  
  const pathname = usePathname();
  const { completedPages, togglePageCompletion } = useUserProgress();
  const { startTimer, stopTimer, isRunning } = useSimpleTimer();
  
  const [hasValidated, setHasValidated] = useState(false);
  const [currentPageInfo, setCurrentPageInfo] = useState<{ chapterNumber: number; lessonNumber: number; globalPageNumber: number } | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const hasStartedTimerRef = useRef(false);

  useEffect(() => {
    const info = parsePagePath(pathname);
    setCurrentPageInfo(info);
    
    if (info) {
      // Use global page number for progress tracking
      const isAlreadyCompleted = completedPages.has(info.globalPageNumber);
      setHasValidated(isAlreadyCompleted);
      
      pageStartTimeRef.current = Date.now();
      
      if (!hasStartedTimerRef.current && !isRunning) {
        startTimer();
        hasStartedTimerRef.current = true;
        console.log('[useAutoProgress] Timer global démarré');
      }
    }
  }, [pathname, completedPages, isRunning, startTimer]);

  const getTimeOnCurrentPage = useCallback(() => {
    return Date.now() - pageStartTimeRef.current;
  }, []);

  const validateCurrentPage = useCallback(async () => {
    if (!currentPageInfo || hasValidated) return;
    
    const timeOnPage = getTimeOnCurrentPage();
    
    if (timeOnPage >= minTimeOnPage) {
      // Use global page number for progress tracking
      await togglePageCompletion(currentPageInfo.globalPageNumber);
      setHasValidated(true);
      console.log('[useAutoProgress] Page validée:', currentPageInfo.globalPageNumber, '(Chapitre', currentPageInfo.chapterNumber, 'Leçon', currentPageInfo.lessonNumber, ')');
    }
  }, [currentPageInfo, hasValidated, getTimeOnCurrentPage, minTimeOnPage, togglePageCompletion]);

  useEffect(() => {
    if (!enabled || hasValidated || !currentPageInfo) return;

    const checkTime = setInterval(() => {
      const elapsed = getTimeOnCurrentPage();
      if (elapsed >= minTimeOnPage) {
        validateCurrentPage();
        clearInterval(checkTime);
      }
    }, 500);

    return () => clearInterval(checkTime);
  }, [enabled, hasValidated, currentPageInfo, minTimeOnPage, getTimeOnCurrentPage, validateCurrentPage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasStartedTimerRef.current) {
        stopTimer();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stopTimer]);

  return {
    hasValidated,
    setHasValidated,
    currentPageInfo,
    validateCurrentPage,
    getTimeOnCurrentPage,
    startTimer,
    stopTimer,
  };
}
