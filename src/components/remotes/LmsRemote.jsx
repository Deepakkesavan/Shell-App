import { useEffect, useRef } from 'react'

/**
 * AngularWrapper
 *
 * Mounts an Angular microfrontend by calling a bootstrap function provided
 * by the remote.  The shell never imports @angular/* — all Angular code
 * lives inside the remote bundle.
 *
 * Props:
 *   bootstrapFn   {() => Promise<ApplicationRef>}  from remote ./Bootstrap
 *   rootSelector  {string}  e.g. 'lms-root'
 */
export default function AngularWrapper({ bootstrapFn, rootSelector }) {
  const containerRef    = useRef(null)
  const appRef          = useRef(null)
  const initializingRef = useRef(false)

  useEffect(() => {
    if (!bootstrapFn || !containerRef.current) return
    if (initializingRef.current || appRef.current)  return

    initializingRef.current = true
    let mounted = true

    async function init() {
      try {
        // Create the Angular host element before bootstrapping
        const host = document.createElement(rootSelector)
        containerRef.current.appendChild(host)

        window.__MICROFRONTEND__ = true

        // bootstrapFn comes entirely from the remote — no @angular/* in shell
        const app = await bootstrapFn()

        if (mounted) {
          appRef.current = app
        } else {
          app.destroy()
        }
      } catch (err) {
        console.error('[AngularWrapper] Bootstrap error:', err)
      } finally {
        initializingRef.current = false
      }
    }

    init()

    return () => {
      mounted = false
      if (appRef.current) {
        try { appRef.current.destroy() } catch (_) {}
        appRef.current = null
      }
      if (containerRef.current) containerRef.current.innerHTML = ''
      delete window.__MICROFRONTEND__
      initializingRef.current = false
    }
  }, [bootstrapFn, rootSelector])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    />
  )
}