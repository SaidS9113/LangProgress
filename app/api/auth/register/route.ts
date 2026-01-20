import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, sendNewRegistrationEmail } from '@/lib/email';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Parser le User-Agent pour extraire les infos de l'appareil
function parseUserAgent(userAgent: string | null) {
  if (!userAgent) return {};
  
  const ua = userAgent.toLowerCase();
  
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  }
  
  let deviceBrand = 'Inconnu';
  let deviceModel = 'Inconnu';
  
  if (/iphone/i.test(ua)) { deviceBrand = 'Apple'; deviceModel = 'iPhone'; }
  else if (/ipad/i.test(ua)) { deviceBrand = 'Apple'; deviceModel = 'iPad'; }
  else if (/macintosh|mac os/i.test(ua)) { deviceBrand = 'Apple'; deviceModel = 'Mac'; }
  else if (/samsung/i.test(ua)) { deviceBrand = 'Samsung'; deviceModel = 'Galaxy'; }
  else if (/huawei/i.test(ua)) { deviceBrand = 'Huawei'; }
  else if (/xiaomi|redmi|poco/i.test(ua)) { deviceBrand = 'Xiaomi'; }
  else if (/windows/i.test(ua)) { deviceBrand = 'PC Windows'; deviceModel = 'Ordinateur'; }
  else if (/linux/i.test(ua) && !/android/i.test(ua)) { deviceBrand = 'PC Linux'; deviceModel = 'Ordinateur'; }
  
  let osName = 'Inconnu';
  let osVersion = '';
  
  if (/windows nt 10/i.test(ua)) { osName = 'Windows'; osVersion = '10/11'; }
  else if (/mac os x/i.test(ua)) { osName = 'macOS'; }
  else if (/iphone os|ios/i.test(ua)) { osName = 'iOS'; }
  else if (/android/i.test(ua)) { osName = 'Android'; const m = ua.match(/android (\d+\.?\d*)/i); osVersion = m ? m[1] : ''; }
  
  let browserName = 'Inconnu';
  let browserVersion = '';
  if (/edg\//i.test(ua)) { browserName = 'Edge'; const m = ua.match(/edg\/([\d.]+)/i); browserVersion = m ? m[1] : ''; }
  else if (/chrome\//i.test(ua)) { browserName = 'Chrome'; const m = ua.match(/chrome\/([\d.]+)/i); browserVersion = m ? m[1] : ''; }
  else if (/firefox\//i.test(ua)) { browserName = 'Firefox'; const m = ua.match(/firefox\/([\d.]+)/i); browserVersion = m ? m[1] : ''; }
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) { browserName = 'Safari'; const m = ua.match(/version\/([\d.]+)/i); browserVersion = m ? m[1] : ''; }
  
  return { deviceType, deviceBrand, deviceModel, osName, osVersion, browserName, browserVersion };
}

// Obtenir les infos de géolocalisation via IP avec plusieurs services
async function getGeoInfo(ip: string) {
  // Ignorer les IPs locales
  if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'Local',
      countryCode: 'LC',
      city: 'Localhost',
      region: 'Dev',
      timezone: 'Europe/Paris',
      isp: 'Local Network',
    };
  }

  // Essayer ipapi.co (HTTPS, gratuit, pas de clé)
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'LangProgress/1.0' },
    });
    const data = await response.json();
    
    if (!data.error) {
      return {
        country: data.country_name || 'Inconnu',
        countryCode: data.country_code || '',
        city: data.city || 'Inconnue',
        region: data.region || 'Inconnue',
        timezone: data.timezone || '',
        isp: data.org || 'Inconnu',
      };
    }
  } catch (error) {
    console.error('Erreur ipapi.co:', error);
  }

  // Fallback: ip-api.com (HTTP)
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,isp`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Inconnu',
        countryCode: data.countryCode || '',
        city: data.city || 'Inconnue',
        region: data.regionName || 'Inconnue',
        timezone: data.timezone || '',
        isp: data.isp || 'Inconnu',
      };
    }
  } catch (error) {
    console.error('Erreur ip-api.com:', error);
  }
  
  return {};
}

// Obtenir la date/heure en France
function getFranceDateTime() {
  return new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, selectedModule } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (!selectedModule || !['A', 'B'].includes(selectedModule)) {
      return NextResponse.json(
        { error: 'Module requis (A ou B)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Ce pseudo est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    const subscriptionPlan = selectedModule === 'B' ? 'COACHING' : 'SOLO';
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        username: username || null,
        isActive: true,
        accountType: 'ACTIVE',
        subscriptionPlan: subscriptionPlan,
        completedPages: '[]',
        completedQuizzes: '[]',
        completedPagesB: '[]',
        completedQuizzesB: '[]',
        studyTimeSeconds: 0,
        welcomeEmailSent: false,
      },
    });

    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const ipAddress = cfIp || forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Collecter les infos de tracking pour l'email d'inscription
    const deviceInfo = parseUserAgent(userAgent || null);
    const geoInfo = await getGeoInfo(ipAddress);
    const registeredAtFrance = getFranceDateTime();

    // Créer une nouvelle entrée Visitor pour chaque inscription (incrémente toujours)
    try {
      await prisma.visitor.create({
        data: {
          ipAddress,
          userAgent,
          source: 'register',
          ...deviceInfo,
          ...geoInfo,
          visitedAtFrance: registeredAtFrance,
        }
      });
      console.log('[REGISTER] Visitor créé:', ipAddress, geoInfo.country, geoInfo.city);
    } catch (visitorError) {
      console.error('[REGISTER] Erreur création visitor:', visitorError);
    }

    // Créer une nouvelle entrée dans Registration (chaque inscription = nouvelle entrée, même IP)
    let registrationPayload = {
      email: newUser.email,
      username: newUser.username || undefined,
      ipAddress,
      userAgent,
      selectedModule,
      ...deviceInfo,
      ...geoInfo,
      registeredAtFrance,
    };

    try {
      await prisma.registration.create({
        data: {
          email: newUser.email,
          ipAddress,
          userAgent,
          selectedModule,
          ...deviceInfo,
          ...geoInfo,
          registeredAtFrance,
        }
      });
      console.log('[REGISTER] Nouvelle inscription enregistrée:', newUser.email, ipAddress);
    } catch (regError) {
      console.error('[REGISTER] Erreur enregistrement inscription:', regError);
    }

    // Envoyer l'email de bienvenue à l'utilisateur
    try {
      await sendWelcomeEmail(newUser.email, newUser.username || undefined);
      await prisma.user.update({
        where: { id: newUser.id },
        data: { welcomeEmailSent: true }
      });
    } catch (emailError) {
      console.error('[REGISTER] Erreur envoi email bienvenue:', emailError);
    }

    // Envoyer l'email de notification d'inscription à l'admin (à chaque inscription, même même IP)
    try {
      await sendNewRegistrationEmail(registrationPayload);
    } catch (emailError) {
      console.error('[REGISTER] Erreur envoi email notification inscription:', emailError);
    }

    const token = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      accountType: newUser.accountType,
      subscriptionPlan: newUser.subscriptionPlan,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      message: 'Inscription réussie',
      selectedModule: selectedModule,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        accountType: newUser.accountType,
        subscriptionPlan: newUser.subscriptionPlan,
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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
