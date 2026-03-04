import { Suspense, lazy } from 'react';
import { BackButton, Breadcrumb } from '../../components/navigation';
import  LoadingSpinner  from '../../components/feedback/LoadingSpinner';
import Placeholder  from '../../components/feedback/Placeholder';

import './RemoteApp.css';

const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'));
const LmsApp = lazy(() => import(/* @vite-ignore */ 'lmsRemote/App'))

export default function RemoteApp({ app, onBack }) {
  const renderRemoteApp = () => {
    switch (app.id) {
      case 'ems':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading Employee Management…" />}>
            <EmsApp />
          </Suspense>
        );
      
      case 'lms':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading New Application…" />}>
            <LmsApp />
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