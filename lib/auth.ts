import { NextRequest } from 'next/server';

const SANDBOX_USER = {
  id: 'sandbox-user-001',
  email: 'demo@example.com',
  username: 'DemoUser',
  isActive: true,
  accountType: 'ACTIVE',
  subscriptionPlan: 'SOLO',
  subscriptionStartDate: new Date('2025-01-01'),
  subscriptionEndDate: new Date('2099-12-31'),
  stripeCustomerId: 'cus_sandbox',
  completedPages: [1, 2, 3],
  completedQuizzes: [1],
  completedPagesB: [],
  completedQuizzesB: [],
  studyTimeSeconds: 3600,
  createdAt: new Date('2025-01-01'),
};

export async function verifyToken(token: string) {
  return { userId: SANDBOX_USER.id, email: SANDBOX_USER.email };
}

export async function generateAuthToken(user: {
  id: string;
  email: string;
  accountType: string;
  subscriptionPlan?: string | null;
  subscriptionEndDate?: Date | null;
}): Promise<string> {
  return 'sandbox-jwt-token-demo';
}

export async function getAuthUserFromRequest(request: NextRequest) {
  return SANDBOX_USER;
}

export function hasActiveSubscription(user: {
  accountType: string;
  subscriptionEndDate?: Date | null;
}): boolean {
  return true;
}

export async function hashPassword(password: string): Promise<string> {
  return 'sandbox-hashed-password';
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return true;
}

export async function createUser(userData: {
  email: string;
  password?: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
  subscriptionPlan?: 'SOLO' | 'COACHING';
  stripeSubscriptionId?: string;
}) {
  return { ...SANDBOX_USER, email: userData.email };
}

export async function getUserByEmail(email: string) {
  return { ...SANDBOX_USER, email };
}

export async function createPasswordResetRequest(email: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: 'Sandbox: Password reset email would be sent.' };
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: 'Sandbox: Password reset successful.' };
}
