'use client';

import React from 'react';

interface LeconProps {
  onNext?: () => void;
}

export default function Lecon3({ onNext }: LeconProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <div className="text-center">
          <div className="inline-block px-4 py-1 bg-blue-600/20 rounded-full mb-4">
            <span className="text-blue-400 text-sm font-medium">Module A - Chapitre 7</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Lecon 3</h1>
          <p className="text-gray-400 mt-4">Contenu pedagogique de la lecon</p>
          
          <div className="mt-8 p-6 bg-gray-700/30 rounded-xl text-left">
            <p className="text-gray-300 leading-relaxed">
              Bienvenue dans la troisieme lecon du Chapitre 7. Terminez ce chapitre avec succes.
            </p>
          </div>
          
          {onNext && (
            <button
              onClick={onNext}
              className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
