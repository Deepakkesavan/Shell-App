import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Home from './pages/home/Home.jsx';
import RemoteApp from './pages/remoteApp/RemoteApp.jsx';
import { APPS_CONFIG } from './config/apps.config.jsx';
import { setRemoteRuntimeConfig } from './config/remote.config';
import './App.css';

// Inner component so useNavigate is always called inside <BrowserRouter>
function AppRoutes() {
  const navigate = useNavigate();

  function handleAppSelect(appId) {
    setRemoteRuntimeConfig(appId);
    navigate(`/${appId}`);
  }

  function handleBack() {
    navigate('/');
  }

  return (
    <div className="shell">
      <Header />

      <Routes>
        {/* Home — app catalogue */}
        <Route
          path="/"
          element={<Home apps={APPS_CONFIG} onAppSelect={handleAppSelect} />}
        />

        {/* One route per app — /* lets Angular's router handle its child routes */}
        {APPS_CONFIG.map(app => (
          <Route
            key={app.id}
            path={`/${app.id}/*`}
            element={<RemoteApp app={app} onBack={handleBack} />}
          />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}