import { useState } from 'react';
import Header from './components/layout/Header.jsx';
import  Home from './pages/home/Home.jsx';
import  RemoteApp   from './pages/remoteApp/RemoteApp.jsx';
import { APPS_CONFIG } from './config/apps.config.jsx'; 
import { setRemoteRuntimeConfig } from './config/remote.config';
import './App.css';

export default function App() {
  const [activeApp, setActiveApp] = useState(null);

  function handleAppSelect(appId) {
    console.log('[App] App selected:', appId);
    
    // Set runtime configuration for the selected app
    setRemoteRuntimeConfig(appId);
    
    // Set active app to display it
    setActiveApp(appId);
  }

  function handleBack() {
    console.log('[App] Navigating back to home');
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