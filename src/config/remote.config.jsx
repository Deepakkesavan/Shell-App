export const REMOTE_CONFIG = {
    ems: {
      backendUrl: 'http://localhost:8080',
      dummyJwtAccessToken: null,
    },
    lms: {
      backendUrl: 'http://localhost:8081',
      dummyJwtAccessToken: null,
    },
  };
  
  export function setRemoteRuntimeConfig(appId) {
    if (appId === 'ems') {
      window.MF_RunTime_Config = REMOTE_CONFIG.ems;
    } else if (appId === 'lms') {
      window.MF_RunTime_Config = REMOTE_CONFIG.lms;
    }
  }