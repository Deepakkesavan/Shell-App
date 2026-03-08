import React, { useEffect, useRef } from 'react';

interface AngularWrapperProps {
  bootstrapFn: () => Promise<any>;
  rootSelector: string;
}

/**
 * AngularWrapper - React component that wraps an Angular microfrontend
 * 
 * This component handles:
 * - Creating the Angular root element
 * - Bootstrapping the Angular application
 * - Cleanup on unmount
 * - Setting microfrontend flag to prevent Angular from taking over routing
 */
export const AngularWrapper: React.FC<AngularWrapperProps> = ({ 
  bootstrapFn, 
  rootSelector 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initAngularApp = async () => {
      if (!containerRef.current) return;

      try {
        console.log('[Shell] Initializing Angular app...');
        
        // Create Angular root element
        const angularRoot = document.createElement(rootSelector);
        containerRef.current.appendChild(angularRoot);

        // Set microfrontend flag to prevent Angular from controlling browser URL
        (window as any).__MICROFRONTEND__ = true;

        // Bootstrap Angular app
        appRef.current = await bootstrapFn();
        
        console.log('[Shell] Angular LMS loaded successfully');
      } catch (error) {
        console.error('[Shell] Failed to load Angular LMS:', error);
      }
    };

    if (mounted) {
      initAngularApp();
    }

    // Cleanup function
    return () => {
      mounted = false;
      
      console.log('[Shell] Cleaning up Angular app...');
      
      // Destroy Angular app if it has a destroy method
      if (appRef.current && typeof appRef.current.destroy === 'function') {
        try {
          appRef.current.destroy();
        } catch (error) {
          console.error('[Shell] Error destroying Angular app:', error);
        }
      }

      // Cleanup DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Remove microfrontend flag
      delete (window as any).__MICROFRONTEND__;
    };
  }, [bootstrapFn, rootSelector]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'auto'
      }} 
    />
  );
};

export default AngularWrapper;