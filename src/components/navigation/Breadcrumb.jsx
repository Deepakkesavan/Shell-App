import './Breadcrumb.css';

export default function Breadcrumb({ appLabel }) {
  return (
    <span className="breadcrumb">
      Home / <span className="breadcrumb-current">{appLabel}</span>
    </span>
  );
}