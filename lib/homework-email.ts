interface HomeworkData {
  id: string;
  chapterId: number;
  title: string;
  content: string;
}

interface UserData {
  id: string;
  email: string;
  username: string | null;
}

export async function generateHomeworkPDF(homework: HomeworkData): Promise<Uint8Array> {
  console.log('[SANDBOX] generateHomeworkPDF:', homework.title);
  return new Uint8Array([]);
}

export async function sendHomeworkToUsers(homeworkId: string, userIds: string[]) {
  console.log('[SANDBOX] sendHomeworkToUsers:', homeworkId, userIds.length);
  return { sent: userIds.length, failed: 0 };
}

export async function sendHomeworkToAllActiveUsers(homeworkId: string) {
  console.log('[SANDBOX] sendHomeworkToAllActiveUsers:', homeworkId);
  return { sent: 10, failed: 0 };
}
