'use client';

import { AlertTriangle, Clock } from 'lucide-react';

interface InactivityWarningProps {
  onContinue: () => void;
}

export default function InactivityWarning({ onContinue }: InactivityWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Êtes-vous toujours là ?
          </h3>
          
          <p className="text-slate-300 mb-6 leading-relaxed">
            Nous avons remarqué que vous n'avez pas interagi avec la page depuis un moment. 
            Le compteur de temps sera mis en pause dans 2 minutes si vous ne répondez pas.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-6">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Temps de réponse : 2 minutes</span>
          </div>
          
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Oui, je continue l'apprentissage
          </button>
          
          <p className="text-slate-400 text-xs mt-4">
            Cette fonctionnalité permet un suivi précis de votre temps d'étude effectif.
          </p>
        </div>
      </div>
    </div>
  );
}

