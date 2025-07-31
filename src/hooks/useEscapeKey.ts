import { useEffect } from 'react';

export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [callback, isActive]);
}; 