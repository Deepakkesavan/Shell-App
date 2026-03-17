export const REMOTE_CONFIG = {
  ems: {
    backendUrl: 'http://localhost:8080',
    dummyJwtAccessToken: null,
  },
  // NEW REMOTE APP CONFIG
  newapp: {
    backendUrl: 'http://localhost:8085', // Update with actual backend URL
    dummyJwtAccessToken: null,
    // Add any other config your remote needs
  },
};

export function setRemoteRuntimeConfig(appId) {
  if (appId === 'ems') {
    window.MF_RunTime_Config = REMOTE_CONFIG.ems;
  } else if (appId === 'newapp') {
    window.MF_RunTime_Config = REMOTE_CONFIG.newapp;
  }
  
  // Alternative: Generic approach
  // if (REMOTE_CONFIG[appId]) {
  //   window.MF_RunTime_Config = REMOTE_CONFIG[appId];
  // }
}