import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import  Header  from './components/layout/Header';
import  Home  from './pages/Home/Home';
import  LoadingSpinner  from './components/feedback/LoadingSpinner';
import  { APPS_CONFIG } from './config/apps.config';
import './App.css';

// Lazy load remote modules
const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'));

// ✅ For Angular apps that expose routes, we import the routes directly
const LmsRoutes = lazy(() => import(/* @vite-ignore */ 'lmsRemote/Routes'));

export default function App() {
  return (
    <div className="shell">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home apps={APPS_CONFIG} />} />
        <Route path="/home" element={<Home apps={APPS_CONFIG} />} />

        {/* Workforce routes */}
        <Route path="/workforce">
          <Route index element={<Navigate to="ems" replace />} />
          
          <Route
            path="ems/*"
            element={
              <Suspense fallback={<LoadingSpinner message="Loading EMS..." />}>
                <EmsApp />
              </Suspense>
            }
          />
          
          {/* ✅ LMS Routes */}
          <Route
            path="lms/*"
            element={
              <Suspense fallback={<LoadingSpinner message="Loading LMS..." />}>
                <LmsRoutes />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}