'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseUserProgressOptions {
  module?: 'A' | 'B';
}

export function useUserProgress(options: UseUserProgressOptions = {}) {
  const { module = 'A' } = options;
  
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        
        if (module === 'B') {
          setCompletedPages(new Set(user.completedPagesB || []));
          setCompletedQuizzes(new Set(user.completedQuizzesB || []));
        } else {
          setCompletedPages(new Set(user.completedPages || []));
          setCompletedQuizzes(new Set(user.completedQuizzes || []));
        }
      }
    } catch (error) {
      console.error('[useUserProgress] Erreur fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }, [module]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const togglePageCompletion = useCallback(async (pageNumber: number) => {
    const isCompleted = completedPages.has(pageNumber);
    const type = isCompleted ? 'remove-page' : 'page';

    try {
      const res = await fetch('/api/progress/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, pageNumber, module }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedPages(new Set(data.completedPages));
        setUpdateTrigger(prev => prev + 1);
        console.log('[useUserProgress] Page mise à jour:', pageNumber, isCompleted ? 'retirée' : 'validée');
      }
    } catch (error) {
      console.error('[useUserProgress] Erreur toggle page:', error);
    }
  }, [completedPages, module]);

  const toggleQuizCompletion = useCallback(async (chapterNumber: number) => {
    const isCompleted = completedQuizzes.has(chapterNumber);
    const type = isCompleted ? 'remove-quiz' : 'quiz';

    try {
      const res = await fetch('/api/progress/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, chapterNumber, module }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedQuizzes(new Set(data.completedQuizzes));
        setUpdateTrigger(prev => prev + 1);
        console.log('[useUserProgress] Quiz mis à jour:', chapterNumber, isCompleted ? 'retiré' : 'validé');
      }
    } catch (error) {
      console.error('[useUserProgress] Erreur toggle quiz:', error);
    }
  }, [completedQuizzes, module]);

  const isChapterCompleted = useCallback((chapterNumber: number) => {
    const chapterPages: Record<number, number[]> = {
      1: [0, 1, 2, 3, 4, 5, 6, 7],
      2: [8, 9, 10, 11],
      3: [12, 13, 14, 15],
      4: [16],
      5: [17],
      6: [18, 19, 20],
      7: [21],
      8: [22, 23],
      9: [24],
      10: [25, 26, 27, 28, 29],
    };

    const pages = chapterPages[chapterNumber] || [];
    const allPagesCompleted = pages.every(p => completedPages.has(p));
    const quizCompleted = completedQuizzes.has(chapterNumber);
    
    return allPagesCompleted && quizCompleted;
  }, [completedPages, completedQuizzes]);

  const triggerHomeworkSend = useCallback(async (chapterNumber: number) => {
    console.log('[useUserProgress] triggerHomeworkSend:', chapterNumber);
  }, []);

  const forceUpdate = useCallback(() => {
    fetchProgress();
    setUpdateTrigger(prev => prev + 1);
  }, [fetchProgress]);

  const updateFromExternal = useCallback((pages: number[], quizzes: number[]) => {
    setCompletedPages(new Set(pages));
    setCompletedQuizzes(new Set(quizzes));
    setUpdateTrigger(prev => prev + 1);
  }, []);

  return {
    completedPages,
    completedQuizzes,
    isLoading,
    isProfessorMode: false,
    updateTrigger,
    forceUpdate,
    updateFromExternal,
    isChapterCompleted,
    togglePageCompletion,
    toggleQuizCompletion,
    triggerHomeworkSend,
  };
}
