import AppCard  from '../../components/cards/AppCard'
import HomeHero from './HomeHero';
import './Home.css';

export default function Home({ apps }) {
  const navigate = useNavigate();

  const handleAppSelect = (appId) => {
    // Map app IDs to routes
    const routeMap = {
      ems: '/workforce/ems',
      lms: '/workforce/lms', // ✅ Add LMS route
      avd: '/avd',
      acm: '/acm',
      reports: '/reports',
    };

    const route = routeMap[appId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <main className="home">
      <HomeHero />
      <div className="grid">
        {apps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app} 
            onClick={handleAppSelect} // ✅ Pass function correctly
          />
        ))}
      </div>
    </main>
  );
}