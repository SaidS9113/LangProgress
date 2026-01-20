// hooks/useSimpleTimer.ts
// ============================================
// SANDBOX - Simple Timer Hook (LocalStorage)
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY_TOTAL = 'sandbox_study_time_total';
const STORAGE_KEY_START = 'sandbox_study_time_start';

export function useSimpleTimer() {
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le temps total depuis localStorage
  const loadTotalTime = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    
    const stored = localStorage.getItem(STORAGE_KEY_TOTAL);
    const time = stored ? parseInt(stored, 10) : 0;
    setTotalTime(time);
    return time;
  }, []);

  // Démarrer le timer
  const startTimer = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (isRunning) return;
    
    // Stocker le timestamp de début
    const startTime = Date.now();
    localStorage.setItem(STORAGE_KEY_START, startTime.toString());
    
    setIsRunning(true);
    setCurrentSession(0);
    
    // Timer local pour affichage en temps réel
    intervalRef.current = setInterval(() => {
      const start = localStorage.getItem(STORAGE_KEY_START);
      if (start) {
        const elapsed = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
        setCurrentSession(elapsed);
      }
    }, 1000);
    
    console.log('[useSimpleTimer] Timer démarré à', new Date(startTime).toLocaleTimeString());
  }, [isRunning]);

  // Arrêter le timer et sauvegarder
  const stopTimer = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Arrêter le timer local
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRunning(false);
    
    // Calculer le temps écoulé
    const startTimeStr = localStorage.getItem(STORAGE_KEY_START);
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      // Limiter à 12 heures max
      const validElapsed = Math.min(elapsedSeconds, 43200);
      
      if (validElapsed > 0) {
        // Ajouter au temps total
        const currentTotal = parseInt(localStorage.getItem(STORAGE_KEY_TOTAL) || '0', 10);
        const newTotal = currentTotal + validElapsed;
        localStorage.setItem(STORAGE_KEY_TOTAL, newTotal.toString());
        setTotalTime(newTotal);
        
        console.log('[useSimpleTimer] Timer arrêté. +' + validElapsed + 's. Total: ' + newTotal + 's');
      }
      
      // Supprimer le timestamp de début
      localStorage.removeItem(STORAGE_KEY_START);
    }
    
    setCurrentSession(0);
  }, []);

  // Sauvegarder du temps manuellement
  const saveTime = useCallback((timeToAdd: number) => {
    if (typeof window === 'undefined') return false;
    
    const currentTotal = parseInt(localStorage.getItem(STORAGE_KEY_TOTAL) || '0', 10);
    const newTotal = currentTotal + timeToAdd;
    localStorage.setItem(STORAGE_KEY_TOTAL, newTotal.toString());
    setTotalTime(newTotal);
    return true;
  }, []);

  // Formater le temps en heures/minutes/secondes
  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  }, []);

  // Charger le temps au montage et vérifier si un timer était en cours
  useEffect(() => {
    loadTotalTime();
    
    // Vérifier si un timer était en cours (page refresh pendant les cours)
    const startTimeStr = localStorage.getItem(STORAGE_KEY_START);
    if (startTimeStr) {
      setIsRunning(true);
      
      // Reprendre le timer
      intervalRef.current = setInterval(() => {
        const start = localStorage.getItem(STORAGE_KEY_START);
        if (start) {
          const elapsed = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
          setCurrentSession(elapsed);
        }
      }, 1000);
    }
  }, [loadTotalTime]);

  // Cleanup à la désinstallation
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    totalTime,
    isRunning,
    currentSession,
    isProfessorMode: false,
    startTimer,
    stopTimer,
    loadTotalTime,
    saveTime,
    formatTime,
  };
}
