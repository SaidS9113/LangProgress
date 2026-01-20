import { useState } from 'react';

export const useActiveElement = (initialIndex: number = 0) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  const handleClick = (index: number, callback?: () => void) => {
    setActiveIndex(index);
    if (callback) {
      callback();
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    handleClick,
    isActive: (index: number) => activeIndex === index
  };
};
