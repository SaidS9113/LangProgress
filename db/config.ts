// ============================================
// SANDBOX - Database Config
// Using SQLite for local demonstration
// ============================================

export const config = {
  // SQLite database (no external connection needed)
  dbUrl: 'file:./prisma/sandbox.db',
  
  // Sandbox mode flag
  isSandbox: true,
};
