import { Avatar, StatusPill } from '../ui';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-dot" />
        Clarium
      </div>
      <div className="header-right">
        <StatusPill />
        <Avatar />
      </div>
    </header>
  );
}