export const REMOTE_CONFIG = {
    ems: {
      backendUrl: 'http://localhost:8080',
      dummyJwtAccessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZWVwYWtrQGNsYXJpdW0udGVjaCIsImVtcElkIjoxMjI1LCJkZXNpZ25hdGlvbiI6IlRyYWluZWUgU29mdHdhcmUgRW5naW5lZXIiLCJpYXQiOjE3NzMxMTc5NTgsImV4cCI6MTc3MzEyMTU1OH0.mtA3Swyc8hN61ThOBKeSTnQ-6cyBhyH1ubmTFomV7C3kMuJJo28Ie4kJmzdTTgrwCXhQcDgzw-Epx5mij4GUiA",
    },
  };
  
  export function setRemoteRuntimeConfig(appId) {
    if (appId === 'ems') {
      window.MF_RunTime_Config = REMOTE_CONFIG.ems;
    }
  }