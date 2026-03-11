// EXACT COPY from your working App.jsx - NO CHANGES

const LMS_REMOTE_URL = 'http://localhost:4205/remoteEntry.js'
const LMS_SCOPE_NAME = 'leave_management_system'

let lmsRemoteLoaded = false
let lmsRemoteLoading = null

async function loadAngularRemote() {
  if (lmsRemoteLoading) return lmsRemoteLoading
  if (lmsRemoteLoaded && window[LMS_SCOPE_NAME]) {
    console.log('[loadAngularRemote] Already loaded')
    return window[LMS_SCOPE_NAME]
  }

  console.log('[loadAngularRemote] Loading Angular remote from:', LMS_REMOTE_URL)

  lmsRemoteLoading = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${LMS_REMOTE_URL}"]`)

    if (existingScript && window[LMS_SCOPE_NAME]) {
      lmsRemoteLoaded = true
      resolve(window[LMS_SCOPE_NAME])
      return
    }

    const script = document.createElement('script')
    script.src = LMS_REMOTE_URL
    script.type = 'text/javascript'

    script.onload = () => {
      console.log('[loadAngularRemote] Script loaded')
      setTimeout(() => {
        if (window[LMS_SCOPE_NAME]) {
          lmsRemoteLoaded = true
          console.log('[loadAngularRemote] Remote loaded successfully')
          resolve(window[LMS_SCOPE_NAME])
        } else {
          reject(new Error(`${LMS_SCOPE_NAME} not found on window`))
        }
      }, 100)
    }

    script.onerror = () => {
      lmsRemoteLoading = null
      reject(new Error(`Failed to load ${LMS_REMOTE_URL}`))
    }

    document.head.appendChild(script)
  })

  return lmsRemoteLoading
}

async function getAngularModule(modulePath) {
  const remote = await loadAngularRemote()
  if (!remote || !remote.get) {
    throw new Error('Angular remote not available')
  }

  if (remote.init) {
    try {
      await remote.init({})
    } catch (error) {
      console.warn('[getAngularModule] Init failed:', error)
    }
  }

  const factory = await remote.get(modulePath)
  return factory()
}

export async function loadLmsApp() {
  try {
    console.log('[loadLmsApp] Loading LMS App module...')
    const module = await getAngularModule('./App')
    console.log('[loadLmsApp] LMS App loaded successfully')
    return module
  } catch (error) {
    console.error('[loadLmsApp] Failed to load LMS App:', error)
    throw error
  }
}

export function setLmsRuntimeConfig() {
  console.log('[Shell] Setting LMS runtime config');
  
  sessionStorage.setItem('module-config', JSON.stringify({
    modules: [{
      key: 'workforce',
      subModules: [{
        key: 'lms',
        url: 'https://workforce-dev.clarium.tech/lmsapi'
      }]
    }]
  }));

  const userInfo = {
    empId: '1225',
    designation: 'Trainee Software Engineer'
  };
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzMyMTM5OTYsImV4cCI6MTc3MzIxNzU5Nn0.3YMnMs69na6SCzj1UMvW1OHwYtea5iWIijlXSc7eqOmhiE27eBXNJmjK3F19c_nth0coc0hC7XxmXWl_563qpg';
  console.log('=== TOKEN CHECK ===');
  console.log('sessionStorage.accessToken:', sessionStorage.getItem('accessToken'));
  console.log('sessionStorage.token:', sessionStorage.getItem('token'));
  console.log('localStorage.accessToken:', localStorage.getItem('accessToken'));
  console.log('localStorage.token:', localStorage.getItem('token'));
  
  // Nuclear option: Set EVERYWHERE
  const allKeys = ['accessToken', 'token', 'jwtToken', 'authToken', 'JWT', 'bearerToken', 'auth_token', 'access_token'];
  
  allKeys.forEach(key => {
    sessionStorage.setItem(key, token);
    localStorage.setItem(key, token);
  });
  
  // Also on window
  window.AUTH_TOKEN = token;
  window.JWT_TOKEN = token;
  
  console.log('[Shell] ✅ Token set in ALL locations');
  console.log('[Shell] Verify sessionStorage.accessToken:', sessionStorage.getItem('accessToken')?.substring(0, 30));
}