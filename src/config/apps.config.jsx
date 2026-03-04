export const APPS_CONFIG = [
    {
      id: 'ems',
      label: 'Employee Management',
      description: 'Manage staff records, roles, and organizational hierarchy',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      accent: '#4f8ef7',
      tag: 'HR',
      hasRemote: true,
    },
    {
      id: 'lms',
      label: 'Leave Management System',
      description: 'Leave Tracking Management governed by the Organization',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      ),
      accent: '#a78bfa',
      tag: 'RM',
      hasRemote: true,
      remoteName: 'lmsRemote',
      exposedModule: './Routes'
    },
    {
      id: 'acm',
      label: 'Access Control',
      description: 'Configure permissions, roles, and identity access policies',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      accent: '#34d399',
      tag: 'Security',
      hasRemote: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      description: 'Analytics dashboards, audit trails, and usage summaries',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      accent: '#fb923c',
      tag: 'Analytics',
      hasRemote: false,
    },
  ];