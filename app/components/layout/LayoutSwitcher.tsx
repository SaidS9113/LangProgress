'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DesktopLayout from "./DesktopLayout";
// import DesktopLayoutB from "./DesktopLayoutB"; // Module B - désactivé pour l'instant
import MobileLayout from "./MobileLayout";
// import MobileLayoutB from "./MobileLayoutB"; // Module B - désactivé pour l'instant
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
   useInactivityLogout()
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  // const [sidebarType, setSidebarType] = useState<'default' | 'b'>('default'); // Module B - désactivé
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  console.log('🎛️ LAYOUT SWITCHER - pathname:', pathname, 'isMobile:', isMobile, 'showSidebar:', showSidebar, 'isHydrated:', isHydrated);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    const getCookie = (name: string) => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      } catch (e) {
        console.warn('Erreur lecture cookie:', e);
        return null;
      }
    };

    const safeGetLocalStorage = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage non disponible:', e);
        return null;
      }
    };

    const hasStartedCourse = safeGetLocalStorage('courseStarted') === 'true';
    const isProfessorAccess = !!getCookie('professor-course-token');

    console.log('?? LAYOUT - Course started check:', hasStartedCourse, 'for path:', pathname);
    console.log('????? LAYOUT - Professor access check:', isProfessorAccess);

    let shouldShowSidebar = false;
    // let type: 'default' | 'b' = 'default'; // Module B - désactivé

    // Module B - désactivé pour l'instant
    // if (pathname.startsWith('/chapters-b/')) {
    //   shouldShowSidebar = true;
    //   type = 'b';
    //   
    //   if (isProfessorAccess) {
    //     console.log('👨‍🏫 SIDEBAR B PROFESSEUR activée');
    //   } else if (hasStartedCourse) {
    //     console.log('👨‍🎓 SIDEBAR B ÉLÈVE activée');
    //   } else {
    //     console.log('📁 SIDEBAR B activée (utilisateur sur page chapitre)');
    //   }
    // } else 
    if (pathname.startsWith('/chapters/')) {
      shouldShowSidebar = true;
      
      if (isProfessorAccess) {
        console.log('👨‍🏫 SIDEBAR PROFESSEUR activée');
      } else if (hasStartedCourse) {
        console.log('👨‍🎓 SIDEBAR ÉLÈVE activée');
      } else {
        console.log('📁 SIDEBAR activée (utilisateur sur page chapitre)');
      }
    }

    console.log('✅ DÉCISION FINALE - Show sidebar:', shouldShowSidebar);
    setShowSidebar(shouldShowSidebar);
    // setSidebarType(type); // Module B - désactivé
    setIsHydrated(true);
  }, [pathname]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  if (!showSidebar) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Module B - désactivé pour l'instant
  // if (sidebarType === 'b') {
  //   return isMobile ? (
  //     <MobileLayoutB>{children}</MobileLayoutB>
  //   ) : (
  //     <DesktopLayoutB>{children}</DesktopLayoutB>
  //   );
  // }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}
