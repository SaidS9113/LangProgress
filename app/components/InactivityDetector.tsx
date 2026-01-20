'use client';

import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function InactivityDetector() {
  const [isClient, setIsClient] = useState(false);
  const { showWarning, remainingTime, resetTimer } = useInactivityLogout();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Session bientôt expirée
        </h2>
        
        <p className="text-gray-600 text-center mb-4">
          Vous allez être déconnecté pour inactivité dans
        </p>
        
        <div className="text-center mb-6">
          <span className="text-5xl font-bold text-amber-600">
            {remainingTime}
          </span>
          <span className="text-gray-500 ml-2">secondes</span>
        </div>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Cliquez sur le bouton ci-dessous ou effectuez une action pour rester connecté.
        </p>
        
        <button
          onClick={resetTimer}
          className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Rester connecté
        </button>
      </div>
    </div>
  );
}