'use client';

import { useEffect } from 'react';

/**
 * Hook personnalisé pour synchroniser le state avec localStorage
 * et entre les onglets/fenêtres du navigateur
 */
export function useLocalStorageSync(
  completedPages: Set<number>,
  setCompletedPages: (value: Set<number>) => void
) {
  // 1. Chargement initial depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('completedPages');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          setCompletedPages(new Set(parsed));
        }
      } catch (e) {
        console.error("Erreur de parsing localStorage", e);
      }
    }
  }, [setCompletedPages]);

  // 2. Écoute des changements depuis d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'completedPages' && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setCompletedPages(new Set(newData));
        } catch (e) {
          console.error("Erreur de parsing storage event", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setCompletedPages]);

  // 3. Sauvegarde dans localStorage quand le state change
  useEffect(() => {
    localStorage.setItem('completedPages', JSON.stringify(Array.from(completedPages)));
  }, [completedPages]);
}