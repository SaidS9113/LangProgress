import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe (demo123 pour le compte démo, sinon bcrypt compare)
    let validPassword = false;
    if (password === 'demo123' && email.toLowerCase() === 'demo@sandbox.com') {
      validPassword = true;
    } else if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      validPassword = Boolean(isMatch);
    }
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    if (email.toLowerCase() === 'demo@sandbox.com') {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ipAddress = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
      const userAgent = request.headers.get('user-agent') || undefined;

      try {
        // Vérifier si le visiteur existe déjà
        const existingVisitor = await prisma.visitor.findFirst({
          where: { ipAddress }
        });
        
        if (!existingVisitor) {
          await prisma.visitor.create({
            data: { ipAddress, userAgent }
          });
        }
      } catch {}
    }

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
      subscriptionPlan: user.subscriptionPlan,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        accountType: user.accountType,
        subscriptionPlan: user.subscriptionPlan,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
