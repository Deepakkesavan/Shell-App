import { setLmsRuntimeConfig } from './lms.config';

export const REMOTE_CONFIG = {
  ems: {
    backendUrl: 'http://localhost:8080',
    dummyJwtAccessToken: '"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzIyMTk5NDUsImV4cCI6MTc3MjIyMzU0NX0.PueesuLEZQu7uHs6sR3K3C1zQtdRp64gvcXq9sQg2c8',
  },
};

export function setRemoteRuntimeConfig(appId) {
  console.log('[setRemoteRuntimeConfig] Setting config for:', appId);
  
  if (appId === 'ems') {
    window.MF_RunTime_Config = REMOTE_CONFIG.ems;
    console.log('[setRemoteRuntimeConfig] EMS config set');
  } else if (appId === 'lms') {
    setLmsRuntimeConfig();
    console.log('[setRemoteRuntimeConfig] LMS config set');
  }
}