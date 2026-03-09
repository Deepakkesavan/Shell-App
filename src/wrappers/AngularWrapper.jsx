import { useEffect, useRef } from 'react'

/**
 * AngularWrapper - Bootstraps Angular microfrontends inside React
 * 
 * @param {Object} props
 * @param {Function} props.bootstrapFn - Function that returns Angular ApplicationRef
 * @param {string} props.rootSelector - Angular root selector (e.g., 'lms-root')
 */
export default function AngularWrapper({ bootstrapFn, rootSelector }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)

  useEffect(() => {
    let mounted = true 

    async function initAngularApp() {
      if (!containerRef.current) return

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
          console.log('[AngularWrapper] Angular app bootstrapped successfully')
        } else {
          // Component unmounted during bootstrap
          console.log('[AngularWrapper] Component unmounted, destroying app')
          app.destroy()
        }

      } catch (error) {
        console.error('[AngularWrapper] Bootstrap error:', error)
      }
    }

    initAngularApp()

    // Cleanup
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