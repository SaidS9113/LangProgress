import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Clé secrète pour sécuriser le cron (Vercel envoie ce header)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'autorisation (Vercel Cron ou clé secrète)
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Trouver l'utilisateur démo
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@sandbox.com' },
    });

    if (!demoUser) {
      return NextResponse.json({
        success: false,
        message: 'Utilisateur démo non trouvé',
      });
    }

    // Réinitialiser la progression du compte démo
    await prisma.user.update({
      where: { id: demoUser.id },
      data: {
        completedPages: '[]',
        completedQuizzes: '[]',
        completedPagesB: '[]',
        completedQuizzesB: '[]',
        studyTimeSeconds: 0,
      },
    });

    // Supprimer tous les devoirs envoyés par le compte démo (Module A)
    await prisma.homeworkSend.deleteMany({
      where: { userId: demoUser.id },
    });

    // Supprimer tous les devoirs envoyés par le compte démo (Module B)
    await prisma.moduleB_HomeworkSend.deleteMany({
      where: { userId: demoUser.id },
    });

    // Supprimer les tentatives de quiz
    await prisma.quizAttempt.deleteMany({
      where: { userId: demoUser.id },
    });

    // Supprimer les vidéos regardées
    await prisma.videoWatch.deleteMany({
      where: { userId: demoUser.id },
    });

    // Supprimer les logs de progression
    await prisma.userProgressLog.deleteMany({
      where: { userId: demoUser.id },
    });

    // Supprimer les snapshots quotidiens
    await prisma.dailyProgressSnapshot.deleteMany({
      where: { userId: demoUser.id },
    });

    console.log(`[CRON] Compte démo réinitialisé à ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Compte démo réinitialisé avec succès',
      resetAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON] Erreur réinitialisation compte démo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    );
  }
}
