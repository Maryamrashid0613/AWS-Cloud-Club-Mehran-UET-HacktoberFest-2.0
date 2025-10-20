import { useEffect } from 'react';

export const usePageTransitions = () => {
  useEffect(() => {
    // Add a class to trigger page-wide animations
    document.body.classList.add('animate-in');
    return () => {
      document.body.classList.remove('animate-in');
    };
  }, []);
};