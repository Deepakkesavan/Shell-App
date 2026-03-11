// EXACT COPY of LMS rendering logic from your working App.jsx

import { useState } from 'react';
import { loadLmsApp, setLmsRuntimeConfig } from '../../config/lms.config';
import AngularWrapper from '../../wrappers/AngularWrapper';
import { LoadingSpinner } from '../feedback';

/**
 * EXACT COPY from working App.jsx - handles LMS state and rendering
 */
export default function LmsRemote() {
  const [lmsModule, setLmsModule] = useState(null);
  const [lmsLoading, setLmsLoading] = useState(false);

  // This mirrors the openApp logic from your original App.jsx
  async function initializeLms() {
    if (!lmsModule && !lmsLoading) {
      setLmsLoading(true);
      try {
        const module = await loadLmsApp();
        console.log('[Shell] LMS module loaded:', module);
        setLmsModule(module);
      } catch (error) {
        console.error('[Shell] Failed to load LMS:', error);
      } finally {
        setLmsLoading(false);
      }
    }
  }

  // Load on mount
  if (!lmsModule && !lmsLoading) {
    initializeLms();
  }

  // Show loading
  if (!lmsModule) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading Leave Management…
      </div>
    );
  }

  // Render Angular app - EXACT SAME as your working App.jsx
  return (
    <AngularWrapper 
      bootstrapFn={async () => {
        console.log('[Shell] Bootstrapping Angular LMS...');
        const { bootstrapApplication, AppComponent, appConfig } = lmsModule;
        return bootstrapApplication(AppComponent, appConfig);
      }}
      rootSelector="lms-root"
    />
  );
}