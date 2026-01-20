import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook pour ouvrir la sidebar cours automatiquement quand on arrive sur une page chapitre
 * @returns {boolean} sidebarOpen - état d'ouverture de la sidebar
 * @returns {function} setSidebarOpen - fonction pour modifier l'état
 */
export function useAutoOpenSidebar() {
  const pathname = usePathname();
  
  // Ouvrir par défaut si on est sur une page chapitre
  const isChapterPage = pathname?.startsWith('/chapters/') || pathname?.startsWith('/chapters-B/');
  const [sidebarOpen, setSidebarOpen] = useState(isChapterPage);

  useEffect(() => {
    // Vérifier le localStorage (pour compatibilité avec le dashboard)
    try {
      const shouldAutoOpen = localStorage.getItem('autoOpenCourseSidebar');
      if (shouldAutoOpen === 'true') {
        console.log('📂 Auto-ouverture sidebar via localStorage');
        setSidebarOpen(true);
        localStorage.removeItem('autoOpenCourseSidebar');
      }
    } catch (e) {
      // Ignore
    }
  }, [pathname]);

  return { sidebarOpen, setSidebarOpen };
}
