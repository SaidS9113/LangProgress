'use client';

import { useState } from 'react';

export type CourseModule = 'A' | 'B';

export const useModuleContext = () => {
  const [activeModule, setActiveModule] = useState<CourseModule>('A');

  return {
    activeModule,
    hasBAccess: false,
    isLoading: false,
    updateModule: (module: CourseModule) => {
      setActiveModule(module);
      return true;
    },
    getBasePath: () => '/chapters/',
  };
};
