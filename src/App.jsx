import React, { Suspense, lazy, useState } from 'react'
import clariumLogo from './assets/clarium-logo.png'
import AngularWrapper from './wrappers/AngularWrapper'

const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'))

// ==================== LMS LOADER (CLEAN VERSION) ====================
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

async function loadLmsApp() {
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
// ==================== END LMS LOADER ====================

function setEmsRuntimeConfig() {
  window.MF_RunTime_Config = {
    backendUrl: 'http://localhost:8080',
    dummyJwtAccessToken: '"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzIyMTk5NDUsImV4cCI6MTc3MjIyMzU0NX0.PueesuLEZQu7uHs6sR3K3C1zQtdRp64gvcXq9sQg2c8',
  }
}

// FIND THIS FUNCTION in your shell-app/src/App.jsx:

function setLmsRuntimeConfig() {
  console.log('[Shell] Setting LMS runtime config');
  
  // Set backend URL in sessionStorage
  sessionStorage.setItem('module-config', JSON.stringify({
    modules: [{
      key: 'workforce',
      subModules: [{
        key: 'lms',
        url: 'https://workforce-dev.clarium.tech/lmsapi'
      }]
    }]
  }));

  // Set user info
  const userInfo = {
    empId: '1225',
    designation: 'Trainee Software Engineer'
  };
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

  // ✅ CRITICAL: Set JWT token in sessionStorage so LMS can access it
  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzMxMjE2ODEsImV4cCI6MTc3MzEyNTI4MX0.FYtQ42yCmckB5lHAjke70k6Msm3aImZGTE8pLsRiPYF2YIy-crdeHw1m7diW7LLCq0Pk_G-jVt6SIVDmCW3IfQ';
  
  // Store in multiple keys to cover all possible LMS lookups
  sessionStorage.setItem('jwtToken', token);
  sessionStorage.setItem('accessToken', token);
  sessionStorage.setItem('token', token);
  
  console.log('[Shell] Config and token set successfully');
  console.log('[Shell] Token available:', !!sessionStorage.getItem('jwtToken'));
}

const apps = [
  {
    id: 'ems',
    label: 'Employee Management',
    description: 'Manage staff records, roles, and organizational hierarchy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    accent: '#4f8ef7',
    tag: 'HR',
  },
  {
    id: 'lms',
    label: 'Leave Management',
    description: 'Manage employee leave requests, balances, and approvals',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    accent: '#34d399',
    tag: 'HR',
  },
  {
    id: 'avd',
    label: 'AVD',
    description: 'Azure Virtual Desktop provisioning and session management',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    accent: '#a78bfa',
    tag: 'Infrastructure',
  },
  {
    id: 'acm',
    label: 'Access Control',
    description: 'Configure permissions, roles, and identity access policies',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    accent: '#34d399',
    tag: 'Security',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Analytics dashboards, audit trails, and usage summaries',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    accent: '#fb923c',
    tag: 'Analytics',
  },
]

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0b0f1a;
    color: #e2e8f0;
    min-height: 100vh;
  }

  .shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem;
    height: 64px;
    background: rgba(11,15,26,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.02em;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .clarium-logo {
    width: 130px;
    height: 20px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f8ef7, #a78bfa);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    font-size: 0.75rem;
    color: #34d399;
    font-weight: 500;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .home {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4rem 2.5rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .home-hero {
    margin-bottom: 3rem;
  }

  .home-eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4f8ef7;
    margin-bottom: 0.75rem;
  }

  .home-title {
    font-family: 'Arial', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    color: #fff;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;
  }

  .home-sub {
    font-size: 1rem;
    color: #64748b;
    max-width: 480px;
    line-height: 1.6;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .card {
    position: relative;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.75rem;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: radial-gradient(circle at 30% 30%, var(--accent-rgb, rgba(79,142,247,0.08)), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.05);
  }

  .card:hover::before {
    opacity: 1;
  }

  .card.active {
    border-color: var(--card-accent);
    background: rgba(255,255,255,0.05);
  }

  .card.active::before {
    opacity: 1;
  }

  .card-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    color: var(--card-accent);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .card-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--card-accent);
    background: rgba(255,255,255,0.05);
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 0.6rem;
  }

  .card-label {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;
  }

  .card-desc {
    font-size: 0.83rem;
    color: #64748b;
    line-height: 1.6;
  }

  .card-arrow {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: #334155;
    transition: color 0.2s, transform 0.2s;
  }

  .card:hover .card-arrow {
    color: var(--card-accent);
    transform: translate(2px, -2px);
  }

  .remote-frame {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .remote-topbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.015);
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #94a3b8;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }

  .remote-breadcrumb {
    font-size: 0.82rem;
    color: #475569;
  }

  .remote-breadcrumb span {
    color: #94a3b8;
  }

  .remote-content {
    flex: 1;
    overflow: auto;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1rem;
    color: #334155;
    padding: 4rem;
    text-align: center;
  }

  .placeholder-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .placeholder h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    color: #475569;
    font-weight: 700;
  }

  .placeholder p {
    font-size: 0.82rem;
    color: #334155;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem;
    gap: 0.75rem;
    color: #475569;
    font-size: 0.9rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(79,142,247,0.2);
    border-top-color: #4f8ef7;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`

export default function App() {
  const [activeApp, setActiveApp] = useState(null)
  const [lmsModule, setLmsModule] = useState(null)
  const [lmsLoading, setLmsLoading] = useState(false)

  async function openApp(id) {
    console.log('[Shell] Opening app:', id);
    
    if (id === 'ems') {
      setEmsRuntimeConfig()
      setActiveApp(id)
    } else if (id === 'lms') {
      setLmsRuntimeConfig()
      setActiveApp(id)
      
      if (!lmsModule && !lmsLoading) {
        setLmsLoading(true)
        try {
          const module = await loadLmsApp()
          console.log('[Shell] LMS module loaded:', module)
          setLmsModule(module)
        } catch (error) {
          console.error('[Shell] Failed to load LMS:', error)
        } finally {
          setLmsLoading(false)
        }
      }
    } else {
      setActiveApp(id)
    }
  }

  const activeData = apps.find(a => a.id === activeApp)

  return (
    <>
      <style>{style}</style>
      <div className="shell">
        <header className="header">
          <div className="logo">
            <img className='clarium-logo' src={clariumLogo} alt="Clarium" />
          </div>
          <div className="header-right">
            <div className="status-pill">
              <div className="status-dot" />
              All systems operational
            </div>
            <div className="avatar">DK</div>
          </div>
        </header>

        {!activeApp && (
          <main className="home">
            <div className="home-hero">
              <p className="home-eyebrow">Internal Platform</p>
              <h1 className="home-title">What would you<br />like to manage?</h1>
              <p className="home-sub">Select an application below to get started. Each module loads independently.</p>
            </div>

            <div className="grid">
              {apps.map(app => (
                <div
                  key={app.id}
                  className="card"
                  style={{ '--card-accent': app.accent }}
                  onClick={() => openApp(app.id)}
                >
                  <svg className="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                  <div className="card-icon">
                    {app.icon}
                  </div>
                  <div className="card-tag">{app.tag}</div>
                  <div className="card-label">{app.label}</div>
                  <p className="card-desc">{app.description}</p>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeApp && (
          <div className="remote-frame">
            <div className="remote-topbar">
              <button className="back-btn" onClick={() => setActiveApp(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                </svg>
                Back
              </button>
              <span className="remote-breadcrumb">Home / <span>{activeData?.label}</span></span>
            </div>

            <div className="remote-content">
              {activeApp === 'ems' && (
                <Suspense fallback={
                  <div className="loading">
                    <div className="spinner" />
                    Loading Employee Management…
                  </div>
                }>
                  <EmsApp />
                </Suspense>
              )}

              {activeApp === 'lms' && (
                <>
                  {lmsModule ? (
                    <AngularWrapper 
                      bootstrapFn={async () => {
                        console.log('[Shell] Bootstrapping Angular LMS...');
                        const { bootstrapApplication, AppComponent, appConfig } = lmsModule;
                        return bootstrapApplication(AppComponent, appConfig);
                      }}
                      rootSelector="lms-root"
                    />
                  ) : (
                    <div className="loading">
                      <div className="spinner" />
                      Loading Leave Management…
                    </div>
                  )}
                </>
              )}

              {activeApp !== 'ems' && activeApp !== 'lms' && (
                <div className="placeholder">
                  <div className="placeholder-icon" style={{ color: activeData?.accent }}>
                    {activeData?.icon}
                  </div>
                  <h3>{activeData?.label}</h3>
                  <p>This module is not connected yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}