import { AppCard } from '../../components/cards';
import HomeHero from './HomeHero';
import './Home.css';

export default function Home({ apps, onAppSelect }) {
  return (
    <main className="home">
      <HomeHero />
      <div className="grid">
        {apps.map(app => (
          <AppCard key={app.id} app={app} onClick={onAppSelect} />
        ))}
      </div>
    </main>
  );
}