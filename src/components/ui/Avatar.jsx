import './Avatar.css';

export default function Avatar({ initials = 'DK' }) {
  return (
    <div className="avatar">
      {initials}
    </div>
  );
}