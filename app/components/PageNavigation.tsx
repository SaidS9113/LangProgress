import React from 'react';
import UniversalNavigation from './UniversalNavigation';
import { ModuleType } from '@/lib/progressTracking';

interface PageNavigationProps {
  currentChapter: number;
  currentPage: number;
  className?: string;
  module: ModuleType;  // Obligatoire pour éviter les bugs
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentChapter,
  currentPage,
  className = "",
  module
}) => {
  return (
    <UniversalNavigation
      currentChapter={currentChapter}
      currentType="lesson"
      currentPage={currentPage}
      className={className}
      module={module}
    />
  );
};

export default PageNavigation;