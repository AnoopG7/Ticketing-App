import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // Signal that the framework is ready
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
  }, []);
}