export const REMOTE_CONFIG = {
  ems: {
    backendUrl: 'https://workforce-dev.clarium.tech/emsapi',
    dummyJwtAccessToken: null,
  },
};

export function setRemoteRuntimeConfig(appId) {
  if (appId === 'ems') {
    // Set global config for the remote app
    window.__APP_CONFIG__ = {
      modules: [
        {
          key: 'workforce',
          subModules: [
            {
              key: 'ems',
              url: REMOTE_CONFIG.ems.backendUrl,
              remoteEntry: 'http://localhost:4202/remoteEntry.js'
            }
          ]
        }
      ]
    };
    
    // Store in sessionStorage for persistence
    sessionStorage.setItem('module-config', JSON.stringify(window.__APP_CONFIG__));
    
    // Set JWT token if available
    if (REMOTE_CONFIG.ems.dummyJwtAccessToken) {
      window.__JWT_TOKEN__ = REMOTE_CONFIG.ems.dummyJwtAccessToken;
      sessionStorage.setItem('jwtToken', REMOTE_CONFIG.ems.dummyJwtAccessToken);
    }
  }
}