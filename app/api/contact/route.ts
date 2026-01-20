import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSupportEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message || message.length < 5) {
      return NextResponse.json({ error: 'Message trop court' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    // Optionnel: enregistrer le message pour suivi
    let username: string | undefined = undefined;
    const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (user) {
      username = user.username || undefined;
      try {
        await prisma.whatsAppMessage.create({
          data: {
            userId: user.id,
            message,
            sentByUser: true,
          },
        });
      } catch (logErr) {
        console.warn('[CONTACT] Impossible d\'enregistrer le message:', logErr);
      }
    }

    // Envoyer l\'email au support
    await sendSupportEmail(email, message, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CONTACT] Erreur API contact:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
