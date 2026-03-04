import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Wrapper for Angular apps that expose routes instead of a component
 * @param {Object} props
 * @param {Function} props.loadRoutes - Function that returns Angular routes module
 */
export default function AngularRoutesWrapper({ loadRoutes }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const angularAppRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadAngularApp() {
      try {
        const routesModule = await loadRoutes();
        
        if (!mounted || !containerRef.current) return;

        // For Angular apps, we need to bootstrap the entire app
        // This is handled by the Angular router internally
        console.log('[Shell] Angular routes loaded:', routesModule);
        
        // Store reference to prevent re-initialization
        angularAppRef.current = routesModule;
      } catch (error) {
        console.error('[Shell] Failed to load Angular routes:', error);
      }
    }

    loadAngularApp();

    return () => {
      mounted = false;
      // Angular cleanup would go here if needed
    };
  }, [loadRoutes]);

  // Notify Angular of route changes
  useEffect(() => {
    if (angularAppRef.current) {
      // Dispatch a popstate event to notify Angular router
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [location]);

  return <div ref={containerRef} id="lms-root" style={{ width: '100%', height: '100%' }} />;
}