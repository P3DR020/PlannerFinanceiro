import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/transactions', label: 'Transactions', icon: TransactionsIcon },
  { path: '/budgets', label: 'Budgets', icon: BudgetsIcon },
  { path: '/savings', label: 'Savings', icon: SavingsIcon },
  { path: '/reports', label: 'Reports', icon: ReportsIcon },
];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className="w-52 flex-shrink-0 flex flex-col py-8"
        style={{ background: 'var(--surface-container-low)' }}
      >
        {/* Logo */}
        <div className="px-6 mb-10">
          <h1 className="font-display text-xl font-800 tracking-tight" style={{ color: 'var(--on-surface)' }}>
            The Ledger
          </h1>
          <p className="text-label-md mt-0.5" style={{ color: 'var(--secondary)', fontSize: '0.65rem' }}>
            PREMIUM WEALTH MANAGEMENT
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                ${isActive
                  ? 'text-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(0, 64, 161, 0.08)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} active={isActive} />
                  <span className="font-body text-sm font-medium">{label}</span>
                  {isActive && (
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-l"
                      style={{ background: 'var(--primary)' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <SupportIcon size={18} />
            <span>Support</span>
          </button>

          {/* New Entry CTA */}
          <button
            className="w-full mt-4 py-3 rounded-xl text-white text-sm font-semibold font-display gradient-primary transition-all hover:opacity-90 active:scale-95"
          >
            + New Entry
          </button>

          {/* User */}
          {user && (
            <div
              className="flex items-center gap-3 mt-4 px-3 py-2 rounded-xl cursor-pointer transition-all"
              onClick={handleLogout}
              title="Click to logout"
              style={{ color: 'var(--on-surface-variant)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              >
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--on-surface)' }}>{user.name}</p>
                <p className="text-label-md" style={{ color: 'var(--secondary)', fontSize: '0.6rem' }}>
                  {user.plan?.toUpperCase()} MEMBER
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function DashboardIcon({ size = 18, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill={active ? 'var(--primary)' : 'currentColor'} opacity={active ? 1 : 0.6} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill={active ? 'var(--primary)' : 'currentColor'} opacity={active ? 0.5 : 0.4} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill={active ? 'var(--primary)' : 'currentColor'} opacity={active ? 0.5 : 0.4} />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill={active ? 'var(--primary)' : 'currentColor'} opacity={active ? 0.3 : 0.3} />
    </svg>
  );
}

function TransactionsIcon({ size = 18, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function BudgetsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function SavingsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 8.24 5.24L8 5.5v0A5.5 5.5 0 0 0 3 11c0 2.29 1.51 4.04 3 5.5l6 6 7-8.5" />
    </svg>
  );
}

function ReportsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SettingsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SupportIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}