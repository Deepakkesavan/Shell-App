import './Placeholder.css';

export default function Placeholder({ app }) {
  return (
    <div className="placeholder">
      <div className="placeholder-icon" style={{ color: app?.accent }}>
        {app?.icon}
      </div>
      <h3>{app?.label}</h3>
      <p>This module is not connected yet.</p>
    </div>
  );
}