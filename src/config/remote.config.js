export const REMOTE_CONFIG = {
  ems: {
    backendUrl: 'https://workforce-dev.clarium.tech',
    dummyJwtAccessToken: null,
  },
};

export function setRemoteRuntimeConfig(appId) {
  if (appId === 'ems') {
    window.MF_RunTime_Config = REMOTE_CONFIG.ems;
  } 
}