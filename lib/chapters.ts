// Types for chapter and lesson content
export type ContentType = 'lesson' | 'quiz' | 'video' | 'exercise';

export interface LessonInfo {
  lessonNumber: number; // 1, 2, or 3 within each chapter
  title: string;
  type?: ContentType;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  lessons: LessonInfo[];
  quiz?: QuizQuestion[];
  module?: 'A' | 'B';
}

// Chapter data for the Lecture module
// Each chapter has exactly 3 lessons (Leçon 1, 2, 3)
export const chapters: Chapter[] = [
  {
    chapterNumber: 1,
    title: 'Chapitre 1',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Question 2 du Chapitre 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 2,
    title: 'Chapitre 2',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 3,
    title: 'Chapitre 3',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 4,
    title: 'Chapitre 4',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 5,
    title: 'Chapitre 5',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 6,
    title: 'Chapitre 6',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 6?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 7,
    title: 'Chapitre 7',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 7?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 8,
    title: 'Chapitre 8',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 8?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 9,
    title: 'Chapitre 9',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 9?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
    ],
    module: 'A',
  },
  {
    chapterNumber: 10,
    title: 'Chapitre 10',
    lessons: [
      { lessonNumber: 1, title: 'Leçon 1', type: 'lesson' },
      { lessonNumber: 2, title: 'Leçon 2', type: 'lesson' },
      { lessonNumber: 3, title: 'Leçon 3', type: 'lesson' },
    ],
    quiz: [
      { question: 'Question 1 du Chapitre 10?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
    ],
    module: 'A',
  },
];

// Helper function to get lesson by chapter and lesson numbers
export function getLessonByNumbers(chapterNumber: number, lessonNumber: number): LessonInfo | null {
  const chapter = chapters.find(ch => ch.chapterNumber === chapterNumber);
  if (!chapter) return null;
  
  const lesson = chapter.lessons.find(l => l.lessonNumber === lessonNumber);
  return lesson || null;
}

// Alias for backward compatibility
export function getPageByNumbers(chapterNumber: number, lessonNumber: number): LessonInfo | null {
  return getLessonByNumbers(chapterNumber, lessonNumber);
}

// Helper function to get chapter by number
export function getChapterByNumber(chapterNumber: number): Chapter | null {
  return chapters.find(ch => ch.chapterNumber === chapterNumber) || null;
}

// Generate all static params for Next.js
// URL structure: /chapters/[chapterNumber]/[lessonNumber]
export function generateAllStaticParams(): { chapitres: string; page: string }[] {
  const params: { chapitres: string; page: string }[] = [];
  
  chapters.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      params.push({
        chapitres: chapter.chapterNumber.toString(),
        page: lesson.lessonNumber.toString(),
      });
    });
    
    // Add quiz page if chapter has quiz
    if (chapter.quiz && chapter.quiz.length > 0) {
      params.push({
        chapitres: chapter.chapterNumber.toString(),
        page: 'quiz',
      });
    }
  });
  
  return params;
}

// Get next lesson info
export function getNextLesson(chapterNumber: number, lessonNumber: number): { chapter: number; lesson: number | 'quiz' } | null {
  const chapterIndex = chapters.findIndex(ch => ch.chapterNumber === chapterNumber);
  if (chapterIndex === -1) return null;
  
  const chapter = chapters[chapterIndex];
  const lessonIndex = chapter.lessons.findIndex(l => l.lessonNumber === lessonNumber);
  
  // If there's a next lesson in the same chapter
  if (lessonIndex < chapter.lessons.length - 1) {
    return { chapter: chapterNumber, lesson: chapter.lessons[lessonIndex + 1].lessonNumber };
  }
  
  // If chapter has quiz and we're on the last lesson
  if (chapter.quiz && chapter.quiz.length > 0) {
    return { chapter: chapterNumber, lesson: 'quiz' };
  }
  
  // Move to next chapter
  if (chapterIndex < chapters.length - 1) {
    const nextChapter = chapters[chapterIndex + 1];
    return { chapter: nextChapter.chapterNumber, lesson: nextChapter.lessons[0].lessonNumber };
  }
  
  return null;
}

// Alias for backward compatibility
export function getNextPage(chapterNumber: number, lessonNumber: number): { chapter: number; page: number | 'quiz' } | null {
  const result = getNextLesson(chapterNumber, lessonNumber);
  if (!result) return null;
  return { chapter: result.chapter, page: result.lesson };
}

// Get previous lesson info
export function getPreviousLesson(chapterNumber: number, lessonNumber: number): { chapter: number; lesson: number } | null {
  const chapterIndex = chapters.findIndex(ch => ch.chapterNumber === chapterNumber);
  if (chapterIndex === -1) return null;
  
  const chapter = chapters[chapterIndex];
  const lessonIndex = chapter.lessons.findIndex(l => l.lessonNumber === lessonNumber);
  
  // If there's a previous lesson in the same chapter
  if (lessonIndex > 0) {
    return { chapter: chapterNumber, lesson: chapter.lessons[lessonIndex - 1].lessonNumber };
  }
  
  // Move to previous chapter's last lesson
  if (chapterIndex > 0) {
    const prevChapter = chapters[chapterIndex - 1];
    const lastLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
    return { chapter: prevChapter.chapterNumber, lesson: lastLesson.lessonNumber };
  }
  
  return null;
}

// Alias for backward compatibility
export function getPreviousPage(chapterNumber: number, lessonNumber: number): { chapter: number; page: number } | null {
  const result = getPreviousLesson(chapterNumber, lessonNumber);
  if (!result) return null;
  return { chapter: result.chapter, page: result.lesson };
}

// Calculate total progress
export function calculateTotalProgress(completedLessons: number[], completedQuizzes: number[]): number {
  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const totalQuizzes = chapters.filter(ch => ch.quiz && ch.quiz.length > 0).length;
  const totalItems = totalLessons + totalQuizzes;
  
  const completedItems = completedLessons.length + completedQuizzes.length;
  
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
}

// Convert global page number to chapter/lesson (for backward compatibility)
export function globalPageToChapterLesson(globalPage: number): { chapter: number; lesson: number } | null {
  // Global pages: 1-3 = Chapter 1, 4-6 = Chapter 2, etc.
  const chapterIndex = Math.floor((globalPage - 1) / 3);
  const lessonNumber = ((globalPage - 1) % 3) + 1;
  
  if (chapterIndex >= 0 && chapterIndex < chapters.length) {
    return { chapter: chapters[chapterIndex].chapterNumber, lesson: lessonNumber };
  }
  return null;
}

// Convert chapter/lesson to global page number (for backward compatibility with progress tracking)
export function chapterLessonToGlobalPage(chapterNumber: number, lessonNumber: number): number {
  return (chapterNumber - 1) * 3 + lessonNumber;
}
