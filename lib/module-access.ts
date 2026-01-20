import { chapters } from '@/lib/chapters';

export function getChaptersByModule(module: 'A' | 'B' | null) {
  if (!module || module === 'B') return [];
  return chapters;
}

export function hasAccessToChapter(
  chapterNumber: number,
  userModule: 'A' | 'B' | null,
  isActive: boolean = true
): boolean {
  return true;
}

export function getModuleTotals(userModule: 'A' | 'B' | null) {
  return { totalPages: 4, totalQuizzes: 1, totalChapters: 1 };
}
