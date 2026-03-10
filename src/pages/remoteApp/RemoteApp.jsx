import { Suspense, lazy } from 'react';
import { BackButton, Breadcrumb } from '../../components/navigation';
import { LoadingSpinner, Placeholder } from '../../components/feedback';
import './RemoteApp.css';

const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'));

export default function RemoteApp({ app, onBack }) {
  return (
    <div className="remote-frame">
      <div className="remote-topbar">
        <BackButton onClick={onBack} />
        <Breadcrumb appLabel={app.label} />
      </div>

      <div className="remote-content">
        {app.id === 'ems' && app.hasRemote && (
          <Suspense fallback={<LoadingSpinner message="Loading Employee Management…" />}>
            <EmsApp />
          </Suspense>
        )}

        {(!app.hasRemote || app.id !== 'ems') && (
          <Placeholder app={app} />
        )}
      </div>
    </div>
  );
}