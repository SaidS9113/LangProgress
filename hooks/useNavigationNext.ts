'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getNextLesson, ContentType } from '@/lib/chapters';
import { ModuleType } from '@/lib/progressTracking';

interface UseNavigationNextOptions {
  currentChapter: number;
  currentType: ContentType;
  currentPage?: number;
  module?: ModuleType;
}

interface NextContent {
  href: string;
  label: string;
  type: 'lesson' | 'quiz' | 'chapter';
}

export function useNavigationNext({
  currentChapter,
  currentType,
  currentPage,
  module = 'A'
}: UseNavigationNextOptions) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const nextContent = useMemo((): NextContent | null => {
    if (currentType === 'quiz') {
      // After quiz, go to next chapter's first lesson
      const nextResult = getNextLesson(currentChapter, 3); // Assume quiz comes after lesson 3
      if (nextResult && typeof nextResult.lesson === 'number') {
        return {
          href: `/chapters/${nextResult.chapter}/${nextResult.lesson}`,
          label: `Cours ${String.fromCharCode(64 + nextResult.chapter)}`,
          type: 'chapter'
        };
      }
      return null;
    }

    if (currentType === 'lesson' && currentPage) {
      const nextResult = getNextLesson(currentChapter, currentPage);
      if (!nextResult) return null;

      if (nextResult.lesson === 'quiz') {
        return {
          href: `/chapters/${nextResult.chapter}/quiz`,
          label: 'Quiz',
          type: 'quiz'
        };
      }

      // Check if moving to next chapter
      if (nextResult.chapter !== currentChapter) {
        return {
          href: `/chapters/${nextResult.chapter}/${nextResult.lesson}`,
          label: `Cours ${String.fromCharCode(64 + nextResult.chapter)}`,
          type: 'chapter'
        };
      }

      return {
        href: `/chapters/${nextResult.chapter}/${nextResult.lesson}`,
        label: `Leçon ${nextResult.lesson}`,
        type: 'lesson'
      };
    }

    return null;
  }, [currentChapter, currentType, currentPage]);

  const handleNext = useCallback(() => {
    if (nextContent) {
      router.push(nextContent.href);
    }
  }, [nextContent, router]);

  return {
    handleNext,
    nextContent,
    showModal,
    setShowModal
  };
}

export default useNavigationNext;
