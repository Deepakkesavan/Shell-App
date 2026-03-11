import { Suspense, lazy } from 'react';
import { BackButton, Breadcrumb } from '../../components/navigation';
import { LoadingSpinner, Placeholder } from '../../components/feedback';
import  LmsRemote  from '../../components/remotes/LmsRemote';
import './RemoteApp.css';

const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'));

function RemoteApp({ app, onBack }) {
  return (
    <div className="remote-frame">
      <div className="remote-topbar">
        <BackButton onClick={onBack} />
        <Breadcrumb appLabel={app.label} />
      </div>

      <div className="remote-content">
        {/* EMS React App */}
        {app.id === 'ems' && app.hasRemote && app.type === 'react' && (
          <Suspense fallback={<LoadingSpinner message="Loading Employee Management…" />}>
            <EmsApp />
          </Suspense>
        )}

        {/* LMS Angular App */}
        {app.id === 'lms' && app.hasRemote && app.type === 'angular' && (
          <LmsRemote />
        )}

        {/* Placeholder for apps without remotes */}
        {!app.hasRemote && (
          <Placeholder app={app} />
        )}
      </div>
    </div>
  );
}
export default RemoteApp;