import './AppCard.css';

export default function AppCard({ app, onClick }) {
  return (
    <div
      className="card"
      style={{ 
        '--card-accent': app.accent,
        '--accent-rgb': `${app.accent}14` 
      }}
      onClick={() => onClick(app.id)}
    >
      <svg className="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
      <div className="card-icon">
        {app.icon}
      </div>
      <div className="card-tag">{app.tag}</div>
      <div className="card-label">{app.label}</div>
      <p className="card-desc">{app.description}</p>
    </div>
  );
}