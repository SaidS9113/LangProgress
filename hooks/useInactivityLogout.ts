'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes en millisecondes
const WARNING_BEFORE = 60 * 1000; // Avertissement 1 minute avant

export function useInactivityLogout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erreur logout:', error);
    }
    // Rediriger vers la page de connexion avec un message
    router.push('/login?reason=inactivity');
  }, [router]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timeout (9 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingTime(60);
      
      // Countdown
      const countdownInterval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Store interval for cleanup
      (warningTimeoutRef.current as any).countdownInterval = countdownInterval;
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    // Set logout timeout (10 minutes)
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  const handleActivity = useCallback(() => {
    // Vérifier si suffisamment de temps s'est écoulé depuis la dernière activité
    // pour éviter trop d'appels
    const now = Date.now();
    if (now - lastActivityRef.current > 1000) { // Au moins 1 seconde entre les resets
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Événements à écouter pour détecter l'activité
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel',
    ];

    // Ajouter les listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Écouter aussi les changements de visibilité de la page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Vérifier si le timeout a expiré pendant que la page était cachée
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= INACTIVITY_TIMEOUT) {
          logout();
        } else if (elapsed >= INACTIVITY_TIMEOUT - WARNING_BEFORE) {
          setShowWarning(true);
          setRemainingTime(Math.ceil((INACTIVITY_TIMEOUT - elapsed) / 1000));
        } else {
          resetTimer();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Démarrer le timer initial
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        if ((warningTimeoutRef.current as any).countdownInterval) {
          clearInterval((warningTimeoutRef.current as any).countdownInterval);
        }
      }
    };
  }, [handleActivity, logout, resetTimer]);

  return { showWarning, remainingTime, resetTimer };
}
