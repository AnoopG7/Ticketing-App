import { useEffect } from 'react';

// Extend the Window interface to include frameworkReady
declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Signal that the framework is ready
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
  }, []);
}