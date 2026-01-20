'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: {
    name: string;
    language_name: string;
  };
}

interface ReciterListProps {
  reciters: Reciter[];
  selectedReciterId: number | null;
  onSelectReciter: (reciterId: number) => void;
  isLoading?: boolean;
}

const ReciterList: React.FC<ReciterListProps> = ({
  reciters,
  selectedReciterId,
  onSelectReciter,
  isLoading = false,
}) => {
  const selectedReciter = reciters.find(r => r.id === selectedReciterId);

  if (isLoading) {
    return (
      <div className="w-full max-w-xs mx-auto">
        <div className="h-12 bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <select
        value={selectedReciterId || ''}
        onChange={(e) => onSelectReciter(Number(e.target.value))}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg text-sm md:text-base font-medium 
                   border-2 border-gray-600 focus:border-amber-500 focus:outline-none
                   transition-all duration-300 cursor-pointer
                   hover:bg-gray-600 hover:border-amber-400
                   appearance-none bg-no-repeat bg-right pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem'
        }}
      >
        {reciters.map((reciter) => (
          <option 
            key={reciter.id} 
            value={reciter.id}
            className="bg-gray-800 text-white py-2"
          >
            {reciter.reciter_name}
            {reciter.style && ` (${reciter.style})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReciterList;
