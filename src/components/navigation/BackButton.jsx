import './BackButton.css';

export default function BackButton({ onClick }) {
  return (
    <button className="back-btn" onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
      </svg>
      Back
    </button>
  );
}