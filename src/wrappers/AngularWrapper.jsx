import { useEffect, useRef } from 'react'

/**
 * AngularWrapper - Bootstraps Angular microfrontends inside React
 * 
 * FIXES:
 * - Prevents double rendering caused by React StrictMode
 * - Properly manages Angular app lifecycle
 * 
 * @param {Object} props
 * @param {Function} props.bootstrapFn - Function that returns Angular ApplicationRef
 * @param {string} props.rootSelector - Angular root selector (e.g., 'lms-root')
 */
export default function AngularWrapper({ bootstrapFn, rootSelector }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const initializingRef = useRef(false)  // ✅ FIX: Prevent double initialization

  useEffect(() => {
    let mounted = true

    async function initAngularApp() {
      if (!containerRef.current) {
        console.log('[AngularWrapper] No container ref, skipping init')
        return
      }

      // ✅ FIX: Prevent double initialization from React StrictMode
      if (initializingRef.current) {
        console.log('[AngularWrapper] Already initializing, skipping')
        return
      }

      // ✅ FIX: If app already exists, don't recreate it
      if (appRef.current) {
        console.log('[AngularWrapper] App already exists, skipping init')
        return
      }

      initializingRef.current = true

      try {
        console.log('[AngularWrapper] Initializing Angular app with selector:', rootSelector)

        // CRITICAL: Create the Angular root element FIRST
        const angularRoot = document.createElement(rootSelector)
        containerRef.current.appendChild(angularRoot)
        console.log('[AngularWrapper] Created Angular root element:', rootSelector)

        // Set microfrontend flag
        window.__MICROFRONTEND__ = true

        // Bootstrap Angular
        console.log('[AngularWrapper] Calling bootstrap function...')
        const app = await bootstrapFn()
        
        if (mounted) {
          appRef.current = app
          console.log('[AngularWrapper] ✅ Angular app bootstrapped successfully')
        } else {
          // Component unmounted during bootstrap
          console.log('[AngularWrapper] Component unmounted during bootstrap, destroying app')
          app.destroy()
        }

      } catch (error) {
        console.error('[AngularWrapper] ❌ Bootstrap error:', error)
      } finally {
        initializingRef.current = false
      }
    }

    initAngularApp()

    // Cleanup function
    return () => {
      mounted = false
      
      if (appRef.current) {
        console.log('[AngularWrapper] Destroying Angular app')
        try {
          appRef.current.destroy()
        } catch (error) {
          console.error('[AngularWrapper] Error destroying app:', error)
        }
        appRef.current = null
      }

      // Clean up the DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      // Clean up global flag
      delete window.__MICROFRONTEND__
      
      // Reset initialization flag
      initializingRef.current = false
    }
  }, [bootstrapFn, rootSelector])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    />
  )
}