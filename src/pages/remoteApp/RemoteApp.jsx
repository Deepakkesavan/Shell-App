import { Suspense, lazy } from 'react';
import { LoadingSpinner, Placeholder } from '../../components/feedback';
import './RemoteApp.css';

const EmsApp = lazy(() => import(/* @vite-ignore */ 'empRemote/App'));

export default function RemoteApp({ app, onBack }) {
  const renderRemoteApp = () => {
    switch (app.id) {
      case 'ems':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading Employee Management…" />}>
            <EmsApp />
          </Suspense>
        );
      
      default:
        return <Placeholder app={app} />;
    }
  };

  return (
    <div className="remote-frame">
      <div className="remote-content">
        {app.hasRemote ? renderRemoteApp() : <Placeholder app={app} />}
      </div>
    </div>
  );
}