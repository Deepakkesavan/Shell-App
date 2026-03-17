import { Suspense, lazy } from 'react';
import { BackButton, Breadcrumb } from '../../components/navigation';
import { LoadingSpinner, Placeholder } from '../../components/feedback';
import './RemoteApp.css';

// Lazy load remote apps
const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App')); // NEW IMPORT

export default function RemoteApp({ app, onBack }) {
  // Helper function to render the correct remote
  const renderRemoteApp = () => {
    switch (app.id) {
      case 'ems':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading Employee Management…" />}>
            <EmsApp />
          </Suspense>
        );
      
      case 'newapp': // NEW CASE
        return (
          <Suspense fallback={<LoadingSpinner message="Loading New Application…" />}>
            <NewApp />
          </Suspense>
        );
      
      default:
        return <Placeholder app={app} />;
    }
  };

  return (
    <div className="remote-frame">
      <div className="remote-topbar">
        <BackButton onClick={onBack} />
        <Breadcrumb appLabel={app.label} />
      </div>

      <div className="remote-content">
        {app.hasRemote ? renderRemoteApp() : <Placeholder app={app} />}
      </div>
    </div>
  );
}