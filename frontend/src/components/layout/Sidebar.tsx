import { NavLink } from 'react-router-dom';
import styles from './AppLayout.module.css';
import type { User, UserRole } from 'types';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  roles?: UserRole[];
}

const baseNav: NavItem[] = [
  { label: 'Panel', to: '/dashboard', icon: '📊' },
  { label: 'Materias', to: '/materias', icon: '📚' },
  { label: 'Inscripciones', to: '/inscripciones', icon: '📝' },
  { label: 'Mi horario', to: '/mi-horario', icon: '🗓️' },
  { label: 'Asistencias', to: '/asistencias', icon: '✅', roles: ['estudiante'] },
];

interface SidebarProps {
  role: UserRole;
  user: User | null;
  onLogout: () => void;
}

export function Sidebar({ role, user, onLogout }: SidebarProps) {
  const items = baseNav.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  const initials = user ? `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.trim().toUpperCase() : 'UN';

  return (
    <aside className={styles.sidebar}>
      <div>
        <span className={styles.brand}>Universidad Nacional del Futuro</span>
        <h2 className={styles.sidebarTitle}>Autogestión</h2>
      </div>

      <div className={styles.navSection}>
        <p className={styles.navLabel}>Menú</p>
        <nav className={styles.navList}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : undefined]
                  .filter(Boolean)
                  .join(' ')
              }
              end
            >
              <span className={styles.navIcon} aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.accountCard}>
        <div className={styles.accountSummary}>
          <span className={styles.accountAvatar}>{initials}</span>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.nombre} {user?.apellido}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)' }}>Legajo {user?.legajo}</div>
          </div>
        </div>
        <button type="button" className={styles.logoutButton} onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
