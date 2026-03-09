// src/utils/loadAngularRemote.js

/**
 * Manually load Angular webpack-based Module Federation remote
 * This bypasses Vite's Module Federation and loads directly via script tag
 */

const LMS_REMOTE_URL = 'http://localhost:4205/remoteEntry.js'
const LMS_SCOPE_NAME = 'leave_management_system' // Must match webpack.config.js name

let lmsRemoteLoaded = false
let lmsRemoteLoading = null

export async function loadAngularRemote() {
  // Return existing promise if already loading
  if (lmsRemoteLoading) {
    return lmsRemoteLoading
  }

  // Return immediately if already loaded
  if (lmsRemoteLoaded && window[LMS_SCOPE_NAME]) {
    console.log('[loadAngularRemote] Already loaded')
    return window[LMS_SCOPE_NAME]
  }

  // Start loading
  console.log('[loadAngularRemote] Loading Angular remote from:', LMS_REMOTE_URL)

  lmsRemoteLoading = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src="${LMS_REMOTE_URL}"]`
    )

    if (existingScript) {
      console.log('[loadAngularRemote] Script tag already exists')
      
      if (window[LMS_SCOPE_NAME]) {
        lmsRemoteLoaded = true
        resolve(window[LMS_SCOPE_NAME])
        return
      }

      // Wait for it to load
      existingScript.addEventListener('load', () => {
        if (window[LMS_SCOPE_NAME]) {
          lmsRemoteLoaded = true
          console.log('[loadAngularRemote] Remote loaded successfully')
          resolve(window[LMS_SCOPE_NAME])
        } else {
          reject(new Error(`Remote loaded but ${LMS_SCOPE_NAME} not found on window`))
        }
      })

      existingScript.addEventListener('error', (err) => {
        reject(new Error(`Failed to load remote script: ${err.message}`))
      })

      return
    }

    // Create new script tag
    const script = document.createElement('script')
    script.src = LMS_REMOTE_URL
    script.type = 'text/javascript'

    script.onload = () => {
      console.log('[loadAngularRemote] Script loaded, checking for remote...')

      // Give it a moment for the remote to initialize
      setTimeout(() => {
        if (window[LMS_SCOPE_NAME]) {
          lmsRemoteLoaded = true
          console.log('[loadAngularRemote] Remote loaded successfully')
          console.log('[loadAngularRemote] Available methods:', Object.keys(window[LMS_SCOPE_NAME]))
          resolve(window[LMS_SCOPE_NAME])
        } else {
          console.error('[loadAngularRemote] Available on window:', Object.keys(window))
          reject(new Error(
            `Remote script loaded but ${LMS_SCOPE_NAME} not found on window. ` +
            `Check that Angular webpack.config.js has name: "${LMS_SCOPE_NAME}" and ` +
            `library: { type: "var", name: "${LMS_SCOPE_NAME}" }`
          ))
        }
      }, 100)
    }

    script.onerror = (err) => {
      lmsRemoteLoading = null
      reject(new Error(`Failed to load script from ${LMS_REMOTE_URL}: ${err.message}`))
    }

    document.head.appendChild(script)
    console.log('[loadAngularRemote] Script tag appended to head')
  })

  return lmsRemoteLoading
}

/**
 * Get a module from the loaded Angular remote
 * FIXED: Don't use webpack share scopes
 */
export async function getAngularModule(modulePath) {
  console.log('[getAngularModule] Getting module:', modulePath)

  // Ensure remote is loaded
  const remote = await loadAngularRemote()

  if (!remote) {
    throw new Error('Angular remote not loaded')
  }

  if (!remote.get) {
    throw new Error('Angular remote does not have a "get" method. ' +
      'Make sure webpack Module Federation is configured correctly.')
  }

  // Initialize the remote if it has an init method
  // Pass an empty shared scope since we're not sharing anything
  if (remote.init) {
    console.log('[getAngularModule] Initializing remote with empty shared scope')
    try {
      await remote.init({})
    } catch (error) {
      console.warn('[getAngularModule] Init failed, continuing anyway:', error)
      // Continue even if init fails - some remotes don't need it
    }
  }

  // Get the module
  console.log('[getAngularModule] Calling remote.get for:', modulePath)
  
  try {
    const factory = await remote.get(modulePath)
    console.log('[getAngularModule] Got factory:', typeof factory)
    
    // Call the factory to get the actual module
    const module = factory()
    console.log('[getAngularModule] Module loaded:', module)
    
    return module
  } catch (error) {
    console.error('[getAngularModule] Failed to get module:', error)
    throw new Error(`Failed to get module "${modulePath}": ${error.message}`)
  }
}

/**
 * Load the Angular LMS App module
 */
export async function loadLmsApp() {
  try {
    console.log('[loadLmsApp] Loading LMS App module...')
    const module = await getAngularModule('./App')
    console.log('[loadLmsApp] LMS App module loaded successfully')
    console.log('[loadLmsApp] Module contents:', Object.keys(module))
    return module
  } catch (error) {
    console.error('[loadLmsApp] Failed to load LMS App:', error)
    throw error
  }
}