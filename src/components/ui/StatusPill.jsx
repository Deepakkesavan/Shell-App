import './StatusPill.css';

export default function StatusPill({ status = 'All systems operational' }) {
  return (
    <div className="status-pill">
      <div className="status-dot" />
      {status}
    </div>
  );
}