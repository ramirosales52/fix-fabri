import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from 'contexts/AuthContext';

const highlights = [
  {
    icon: '🎓',
    title: 'Trayectoria Académica',
    description: 'Seguimiento completo de materias, correlativas y evaluaciones.'
  },
  {
    icon: '🗓️',
    title: 'Horarios Inteligentes',
    description: 'Tu agenda académica en un panel claro y siempre actualizado.'
  },
  {
    icon: '🛡️',
    title: 'Seguridad Garantizada',
    description: 'Datos protegidos con autenticación JWT y control de roles.'
  }
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(legajo, password);
      const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <aside className={styles.hero}>
        <div className={styles.badgeRow}>
          <span>UNIVERSIDAD NACIONAL DEL FUTURO</span>
          <span>VERSIÓN 2025</span>
        </div>
        <div className={styles.heroHeadline}>
          <h1 className={styles.heroTitle}>Sistema de Autogestión Académica</h1>
          <p className={styles.heroParagraph}>
            Gestioná tus materias, exámenes y seguimiento académico desde un entorno único, intuitivo y seguro.
          </p>
          <div className={styles.heroHighlights}>
            {highlights.map((item) => (
              <div key={item.title} className={styles.highlight}>
                <span className={styles.highlightIcon}>{item.icon}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={styles.cardChip}>Sistema de Autogestión</span>
            <h2 className={styles.cardTitle}>Bienvenido nuevamente</h2>
            <p className={styles.cardSubtitle}>
              Accedé con tu legajo institucional para continuar con tu autogestión académica.
            </p>
          </header>

          {error && (
            <div className={styles.alert}>
              <strong>¡Ups!</strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="legajo" className={styles.labelRow}>
                Legajo institucional
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="legajo"
                  className={styles.input}
                  type="text"
                  placeholder="Ej: 20231234"
                  value={legajo}
                  onChange={(e) => setLegajo(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <span>Contraseña</span>
                <Link to="#">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleButton}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Validando credenciales…' : 'Iniciar sesión'}
            </button>
          </form>

          <div className={styles.subLinks}>
            ¿No tenés acceso?
            <Link to="#">Solicitar alta administrativa</Link>
          </div>

          <footer className={styles.footer}>
            © {new Date().getFullYear()} Secretaría Académica · Universidad Nacional del Futuro
          </footer>
        </div>
      </main>
    </div>
  );
}
