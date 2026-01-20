import { NextRequest } from 'next/server';

export async function isAdminUser(request: NextRequest): Promise<boolean> {
  return true;
}

export async function requireAdmin(request: NextRequest) {
  return true;
}
