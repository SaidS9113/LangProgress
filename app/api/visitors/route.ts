import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewVisitorEmail } from '@/lib/email';

// Parser le User-Agent pour extraire les infos de l'appareil
function parseUserAgent(userAgent: string | null) {
  if (!userAgent) return {};
  
  const ua = userAgent.toLowerCase();
  
  // Détection du type d'appareil
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  }
  
  // Détection de la marque et modèle
  let deviceBrand = 'Inconnu';
  let deviceModel = 'Inconnu';
  
  if (/iphone/i.test(ua)) {
    deviceBrand = 'Apple';
    deviceModel = 'iPhone';
  } else if (/ipad/i.test(ua)) {
    deviceBrand = 'Apple';
    deviceModel = 'iPad';
  } else if (/macintosh|mac os/i.test(ua)) {
    deviceBrand = 'Apple';
    deviceModel = 'Mac';
  } else if (/samsung/i.test(ua)) {
    deviceBrand = 'Samsung';
    const match = ua.match(/samsung[- ]?([\w-]+)/i);
    deviceModel = match ? match[1].toUpperCase() : 'Galaxy';
  } else if (/huawei/i.test(ua)) {
    deviceBrand = 'Huawei';
  } else if (/xiaomi|redmi|poco/i.test(ua)) {
    deviceBrand = 'Xiaomi';
  } else if (/oppo/i.test(ua)) {
    deviceBrand = 'Oppo';
  } else if (/vivo/i.test(ua)) {
    deviceBrand = 'Vivo';
  } else if (/oneplus/i.test(ua)) {
    deviceBrand = 'OnePlus';
  } else if (/pixel/i.test(ua)) {
    deviceBrand = 'Google';
    deviceModel = 'Pixel';
  } else if (/windows/i.test(ua)) {
    deviceBrand = 'PC Windows';
    deviceModel = 'Ordinateur';
  } else if (/linux/i.test(ua) && !/android/i.test(ua)) {
    deviceBrand = 'PC Linux';
    deviceModel = 'Ordinateur';
  }
  
  // Détection de l'OS
  let osName = 'Inconnu';
  let osVersion = '';
  
  if (/windows nt 10/i.test(ua)) {
    osName = 'Windows';
    osVersion = '10/11';
  } else if (/windows nt 6\.3/i.test(ua)) {
    osName = 'Windows';
    osVersion = '8.1';
  } else if (/windows nt 6\.2/i.test(ua)) {
    osName = 'Windows';
    osVersion = '8';
  } else if (/windows nt 6\.1/i.test(ua)) {
    osName = 'Windows';
    osVersion = '7';
  } else if (/mac os x/i.test(ua)) {
    osName = 'macOS';
    const match = ua.match(/mac os x (\d+[._]\d+)/i);
    osVersion = match ? match[1].replace('_', '.') : '';
  } else if (/iphone os|ios/i.test(ua)) {
    osName = 'iOS';
    const match = ua.match(/os (\d+[._]\d+)/i);
    osVersion = match ? match[1].replace('_', '.') : '';
  } else if (/android/i.test(ua)) {
    osName = 'Android';
    const match = ua.match(/android (\d+\.?\d*)/i);
    osVersion = match ? match[1] : '';
  } else if (/linux/i.test(ua)) {
    osName = 'Linux';
  }
  
  // Détection du navigateur
  let browserName = 'Inconnu';
  let browserVersion = '';
  
    if (/edg\//i.test(ua)) {
    browserName = 'Edge';
      const match = ua.match(/edg\/([\d.]+)/i);
    browserVersion = match ? match[1] : '';
  } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
      browserName = 'Chrome';
      const match = ua.match(/chrome\/([\d.]+)/i);
    browserVersion = match ? match[1] : '';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
      browserName = 'Safari';
      const match = ua.match(/version\/([\d.]+)/i);
    browserVersion = match ? match[1] : '';
  } else if (/firefox/i.test(ua)) {
    browserName = 'Firefox';
      const match = ua.match(/firefox\/([\d.]+)/i);
    browserVersion = match ? match[1] : '';
  } else if (/opera|opr/i.test(ua)) {
    browserName = 'Opera';
  }
  
  return {
    deviceType,
    deviceBrand,
    deviceModel,
    osName,
    osVersion,
    browserName,
    browserVersion,
  };
}

// Obtenir les infos de géolocalisation via IP
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

  return {
    country: 'Inconnu',
    countryCode: '',
    city: 'Inconnue',
    region: 'Inconnue',
    timezone: '',
    isp: 'Inconnu',
  };
}

// Obtenir la date/heure en France
function getFranceDateTime() {
  const now = new Date();
  return now.toLocaleString('fr-FR', {
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
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const ipAddress = cfIp || forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Vérifier si c'est un nouveau visiteur
    const existingVisitor = await prisma.visitor.findFirst({
      where: { ipAddress }
    });

    if (!existingVisitor) {
      // Nouveau visiteur - collecter toutes les infos
      const deviceInfo = parseUserAgent(userAgent || null);
      const geoInfo = await getGeoInfo(ipAddress);
      const visitedAtFrance = getFranceDateTime();

      const visitorData = {
        ipAddress,
        userAgent,
        ...deviceInfo,
        ...geoInfo,
        visitedAtFrance,
      };

      await prisma.visitor.create({
        data: visitorData
      });

      // Envoyer un email de notification
      try {
        await sendNewVisitorEmail(visitorData);
      } catch (emailError) {
        console.error('Erreur envoi email nouveau visiteur:', emailError);
      }
    }

    const totalVisitors = await prisma.visitor.count();
    return NextResponse.json({ count: totalVisitors });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ count: 0 });
  }
}

export async function GET() {
  try {
    const totalVisitors = await prisma.visitor.count();
    return NextResponse.json({ count: totalVisitors });
  } catch (error) {
    console.error('Visitor count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
