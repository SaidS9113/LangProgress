export type ModuleType = 'A' | 'B';

export async function logPageCompletion(userId: string, pageNumber: number, chapterId: number) {
  console.log('[SANDBOX] logPageCompletion:', userId, pageNumber, chapterId);
}

export async function logQuizCompletion(userId: string, chapterId: number) {
  console.log('[SANDBOX] logQuizCompletion:', userId, chapterId);
}

export async function logPageCompletionB(userId: string, pageNumber: number, chapterId: number) {
  console.log('[SANDBOX] logPageCompletionB:', userId, pageNumber, chapterId);
}

export async function logQuizCompletionB(userId: string, chapterId: number) {
  console.log('[SANDBOX] logQuizCompletionB:', userId, chapterId);
}

export async function updateDailySnapshot(userId: string, module: ModuleType) {
  console.log('[SANDBOX] updateDailySnapshot:', userId, module);
}

export async function getUserProgressHistory(userId: string, days: number = 30, module: ModuleType = 'A') {
  return [];
}

export async function getDailyProgressStats(userId: string, module: ModuleType = 'A') {
  return { pagesCompleted: 2, quizzesCompleted: 1 };
}
