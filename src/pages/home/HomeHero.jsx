import './HomeHero.css';

export default function HomeHero() {
  return (
    <div className="home-hero">
      <p className="home-eyebrow">Internal Platform</p>
      <h1 className="home-title">
        What would you<br />like to manage?
      </h1>
      <p className="home-sub">
        Select an application below to get started. Each module loads independently.
      </p>
    </div>
  );
}