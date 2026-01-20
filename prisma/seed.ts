// ============================================
// SANDBOX E-LEARNING - Seed Data
// Données fictives pour démonstration
// ============================================

// @ts-ignore - Prisma client import for ESM
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sandbox database...');

  // -------------------------
  // Créer des utilisateurs de démo
  // -------------------------
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@sandbox.com' },
    update: {},
    create: {
      id: 'demo-user-001',
      email: 'demo@sandbox.com',
      username: 'demo_user',
      password: '$2b$10$demohashedpassword', // "demo123"
      isActive: true,
      accountType: 'ACTIVE',
      subscriptionPlan: 'SOLO',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      completedPages: JSON.stringify([0, 1, 2, 3, 4, 5]),
      completedQuizzes: JSON.stringify([1, 2]),
      completedPagesB: JSON.stringify([0, 1]),
      completedQuizzesB: JSON.stringify([]),
      studyTimeSeconds: 7200, // 2 heures
      welcomeEmailSent: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sandbox.com' },
    update: {},
    create: {
      id: 'admin-user-001',
      email: 'admin@sandbox.com',
      username: 'admin',
      password: '$2b$10$adminhashedpassword', // "admin123"
      isActive: true,
      accountType: 'ACTIVE',
      subscriptionPlan: 'COACHING',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      completedPages: JSON.stringify([]),
      completedQuizzes: JSON.stringify([]),
      completedPagesB: JSON.stringify([]),
      completedQuizzesB: JSON.stringify([]),
      studyTimeSeconds: 0,
      welcomeEmailSent: true,
    },
  });

  console.log('✅ Created users:', demoUser.email, adminUser.email);

  // -------------------------
  // Créer des niveaux
  // -------------------------
  const level1 = await prisma.level.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Module A - Niveau 1',
      price: 89,
      module: 'A',
      isActive: true,
    },
  });

  const level2 = await prisma.level.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Module A - Niveau 2',
      price: 89,
      module: 'A',
      isActive: true,
    },
  });

  const levelB = await prisma.level.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: 'Module B - Niveau 1',
      price: 99,
      module: 'B',
      isActive: true,
    },
  });

  console.log('✅ Created levels');

  // -------------------------
  // Créer des chapitres
  // -------------------------
  const chapters = [
    { chapterNumber: 1, title: 'Chapitre 1 - Introduction', levelId: 1 },
    { chapterNumber: 2, title: 'Chapitre 2 - Les bases', levelId: 1 },
    { chapterNumber: 3, title: 'Chapitre 3 - Exercices pratiques', levelId: 1 },
    { chapterNumber: 4, title: 'Chapitre 4 - Approfondissement', levelId: 1 },
    { chapterNumber: 5, title: 'Chapitre 5 - Révisions', levelId: 1 },
    { chapterNumber: 6, title: 'Chapitre 6 - Niveau intermédiaire', levelId: 2 },
    { chapterNumber: 7, title: 'Chapitre 7 - Techniques avancées', levelId: 2 },
    { chapterNumber: 8, title: 'Chapitre 8 - Cas pratiques', levelId: 2 },
    { chapterNumber: 9, title: 'Chapitre 9 - Perfectionnement', levelId: 2 },
    { chapterNumber: 10, title: 'Chapitre 10 - Maîtrise', levelId: 2 },
    { chapterNumber: 11, title: 'Chapitre 11 - Conclusion', levelId: 2 },
  ];

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { chapterNumber: chapter.chapterNumber },
      update: {},
      create: chapter,
    });
  }

  console.log('✅ Created chapters');

  // -------------------------
  // Créer des vidéos de chapitre
  // -------------------------
  const videos = [
    { chapterId: 1, title: 'Vidéo 1.1 - Présentation', cloudflareVideoId: 'demo-video-001' },
    { chapterId: 1, title: 'Vidéo 1.2 - Premiers pas', cloudflareVideoId: 'demo-video-002' },
    { chapterId: 2, title: 'Vidéo 2.1 - Fondamentaux', cloudflareVideoId: 'demo-video-003' },
    { chapterId: 2, title: 'Vidéo 2.2 - Exercice guidé', cloudflareVideoId: 'demo-video-004' },
    { chapterId: 3, title: 'Vidéo 3.1 - Pratique', cloudflareVideoId: 'demo-video-005' },
  ];

  for (const video of videos) {
    await prisma.chapterVideo.upsert({
      where: { cloudflareVideoId: video.cloudflareVideoId },
      update: {},
      create: {
        ...video,
        duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
        isActive: true,
      },
    });
  }

  console.log('✅ Created chapter videos');

  // -------------------------
  // Créer des vidéos Module B
  // -------------------------
  for (let i = 1; i <= 5; i++) {
    await prisma.moduleB_ChapterVideo.upsert({
      where: { chapterNumber: i },
      update: {},
      create: {
        chapterNumber: i,
        title: `Module B - Vidéo ${i}`,
        cloudflareVideoId: `demo-moduleb-video-${i.toString().padStart(3, '0')}`,
        duration: Math.floor(Math.random() * 600) + 120,
        isActive: true,
      },
    });
  }

  console.log('✅ Created Module B videos');

  // -------------------------
  // Créer des quiz
  // -------------------------
  const quizQuestions = JSON.stringify([
    {
      question: 'Question de démonstration 1 ?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
    },
    {
      question: 'Question de démonstration 2 ?',
      options: ['Réponse 1', 'Réponse 2', 'Réponse 3', 'Réponse 4'],
      correctAnswer: 1,
    },
    {
      question: 'Question de démonstration 3 ?',
      options: ['Choix A', 'Choix B', 'Choix C', 'Choix D'],
      correctAnswer: 2,
    },
  ]);

  for (let i = 1; i <= 5; i++) {
    await prisma.quiz.upsert({
      where: { id: `quiz-chapter-${i}` },
      update: {},
      create: {
        id: `quiz-chapter-${i}`,
        chapterId: i,
        title: `Quiz Chapitre ${i}`,
        questions: quizQuestions,
        isActive: true,
      },
    });
  }

  console.log('✅ Created quizzes');

  // -------------------------
  // Créer des devoirs
  // -------------------------
  for (let i = 1; i <= 5; i++) {
    await prisma.homework.upsert({
      where: { id: `homework-chapter-${i}` },
      update: {},
      create: {
        id: `homework-chapter-${i}`,
        chapterId: i,
        title: `Devoir Chapitre ${i}`,
        content: `Instructions du devoir pour le chapitre ${i}. Ceci est un contenu de démonstration.`,
        isActive: true,
      },
    });
  }

  console.log('✅ Created homeworks');

  // -------------------------
  // Créer des devoirs Module B
  // -------------------------
  for (let i = 1; i <= 5; i++) {
    await prisma.moduleB_Homework.upsert({
      where: { chapterId: i },
      update: {},
      create: {
        chapterId: i,
        title: `Devoir Module B - Chapitre ${i}`,
        content: `Instructions du devoir Module B pour le chapitre ${i}.`,
        isActive: true,
      },
    });
  }

  console.log('✅ Created Module B homeworks');

  // -------------------------
  // Créer un achat de niveau pour l'utilisateur démo
  // -------------------------
  await prisma.levelPurchase.upsert({
    where: { userId_levelId: { userId: demoUser.id, levelId: 1 } },
    update: {},
    create: {
      userId: demoUser.id,
      levelId: 1,
    },
  });

  console.log('✅ Created level purchase');

  // -------------------------
  // Créer des logs de progression
  // -------------------------
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.userProgressLog.create({
      data: {
        userId: demoUser.id,
        actionType: 'PAGE_COMPLETED',
        pageNumber: i,
        chapterId: 1,
        completedAt: date,
      },
    });
  }

  console.log('✅ Created progress logs');

  // -------------------------
  // Créer des snapshots quotidiens
  // -------------------------
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyProgressSnapshot.upsert({
      where: {
        userId_snapshotDate_module: {
          userId: demoUser.id,
          snapshotDate: date,
          module: 'A',
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        module: 'A',
        pagesCompletedCount: Math.floor(Math.random() * 5) + 1,
        quizzesCompletedCount: Math.floor(Math.random() * 2),
        progressPercentage: Math.min(100, (7 - i) * 10),
        snapshotDate: date,
      },
    });
  }

  console.log('✅ Created daily snapshots');

  console.log('\n🎉 Sandbox database seeded successfully!');
  console.log('📧 Demo user: demo@sandbox.com');
  console.log('📧 Admin user: admin@sandbox.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
