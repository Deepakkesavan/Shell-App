const LMS_REMOTE_URL = 'http://localhost:4205/remoteEntry.js'
const LMS_SCOPE_NAME = 'leave_management_system'

let _loadPromise = null

function _injectModuleScript(url) {
  return new Promise((resolve, reject) => {
    if (window[LMS_SCOPE_NAME]) return resolve(window[LMS_SCOPE_NAME])

    if (document.querySelector(`script[src="${url}"]`)) {
      return _pollForScope(resolve, reject)
    }

    const script = document.createElement('script')
    script.src  = url
    script.type = 'module'   // Angular output uses import.meta — must be type="module"

    script.onload  = () => _pollForScope(resolve, reject)
    script.onerror = () => {
      _loadPromise = null
      reject(new Error(`[LMS] Failed to load remoteEntry from ${url}`))
    }

    document.head.appendChild(script)
  })
}

function _pollForScope(resolve, reject, attempts = 0) {
  if (window[LMS_SCOPE_NAME]) return resolve(window[LMS_SCOPE_NAME])
  if (attempts >= 50) return reject(new Error(`[LMS] Timed out — window.${LMS_SCOPE_NAME} never appeared`))
  setTimeout(() => _pollForScope(resolve, reject, attempts + 1), 100)
}

function loadLmsRemote() {
  if (!_loadPromise) {
    _loadPromise = _injectModuleScript(LMS_REMOTE_URL).then(async remote => {
      if (remote.init) {
        try { await remote.init({}) } catch (_) {}
      }
      return remote
    })
  }
  return _loadPromise
}

async function getModule(exposedPath) {
  const remote  = await loadLmsRemote()
  const factory = await remote.get(exposedPath)
  return factory()
}

// Returns the bootstrap() function from the LMS remote.
// The shell calls this — zero @angular/* imports required in the shell.
export async function loadLmsBootstrap() {
  const mod = await getModule('./Bootstrap')
  // bootstrap.ts exports:  export async function bootstrap() { ... }
  return mod.bootstrap
}

// ── Runtime config ────────────────────────────────────────────────────────────

export function setLmsRuntimeConfig() {
  sessionStorage.setItem('module-config', JSON.stringify({
    modules: [{
      key: 'workforce',
      subModules: [{ key: 'lms', url: 'https://workforce-dev.clarium.tech/lmsapi' }]
    }]
  }))

  sessionStorage.setItem('userInfo', JSON.stringify({
    empId: '1225',
    designation: 'Trainee Software Engineer'
  }))

  const token = sessionStorage.getItem('accessToken') || _devToken()
  const keys  = ['accessToken','token','jwtToken','authToken','JWT','bearerToken','auth_token','access_token']
  keys.forEach(k => { sessionStorage.setItem(k, token); localStorage.setItem(k, token) })
  window.AUTH_TOKEN = token
  window.JWT_TOKEN  = token
}

function _devToken() {
  return 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzMxMjU4NjUsImV4cCI6MTc3MzEyOTQ2NX0.3Xfw41IKBL1Q56vLrkNk2cZ9fMGfISgq5Jg_Hek16xtcViH50_jNVgwJvzhrRqx7d0TmRjHzeHdKnF80qMbeXA'
}