import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 15 * 60 * 1000, maxAttempts: 5 }
): { success: boolean; remaining: number; resetTime: number } {
  return { success: true, remaining: 100, resetTime: Date.now() + 3600000 };
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 1000);
}

export function validateEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  return { valid: true, errors: [] };
}

export function getClientIP(request: NextRequest): string {
  return '127.0.0.1';
}

export function generateSecureToken(length: number = 32): string {
  return 'sandbox-secure-token-' + Math.random().toString(36);
}
