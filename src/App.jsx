import { useState } from 'react';
import { Header } from './components/layout';
import RemoteApp from './pages/remoteApp/RemoteApp';
import Home from './pages/home/Home';

import { APPS_CONFIG } from './config/apps.config';
import { setRemoteRuntimeConfig } from './config/remote.config';
import './App.css';

export default function App() {
  const [activeApp, setActiveApp] = useState(null);

  function handleAppSelect(appId) {
    setRemoteRuntimeConfig(appId);
    setActiveApp(appId);
  }

  function handleBack() {
    setActiveApp(null);
  }

  const activeAppData = APPS_CONFIG.find(app => app.id === activeApp);

  return (
    <div className="shell">
      <Header />
      
      {!activeApp && (
        <Home apps={APPS_CONFIG} onAppSelect={handleAppSelect} />
      )}

      {activeApp && activeAppData && (
        <RemoteApp app={activeAppData} onBack={handleBack} />
      )}
    </div>
  );
}