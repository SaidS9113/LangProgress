"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigationNext } from '@/hooks/useNavigationNext';
import { ContentType } from '@/lib/chapters';
import { ModuleType } from '@/lib/progressTracking';

interface UniversalNavigationProps {
  currentChapter: number;
  currentType: ContentType;
  currentPage?: number;
  className?: string;
  module?: ModuleType;
}

const UniversalNavigation: React.FC<UniversalNavigationProps> = ({
  currentChapter,
  currentType,
  currentPage,
  className = "",
  module = 'A'
}) => {
  const {
    handleNext,
    nextContent,
    showModal,
    setShowModal
  } = useNavigationNext({
    currentChapter,
    currentType,
    currentPage,
    module
  });

  if (!nextContent) {
    return null;
  }

  return (
    <div className={`flex justify-end items-center ${className}`}>
      <button
        onClick={handleNext}
        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        aria-label={nextContent.label}
      >
        <span className="text-base md:text-lg">{nextContent.label}</span>
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default UniversalNavigation;
