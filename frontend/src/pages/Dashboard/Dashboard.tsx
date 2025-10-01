import styles from './Dashboard.module.css';
import { AppLayout } from 'components/layout/AppLayout';
import { Card } from 'components/ui/Card';
import { useAuth } from 'contexts/AuthContext';

const stats = [
  { label: 'Materias en curso', value: '6', delta: '+2 este cuatrimestre' },
  { label: 'Promedio de asistencia', value: '87%', delta: 'Objetivo: 80%' },
  { label: 'Exámenes programados', value: '3', delta: 'Próximos 30 días' },
];

const timeline = [
  { title: 'Entrega TP integrador - Sistemas Operativos', date: 'Martes 1 Oct · 23:59', type: 'Evaluación' },
  { title: 'Clase de consulta - Matemática III', date: 'Miércoles 2 Oct · 18:00', type: 'Consulta' },
  { title: 'Examen parcial - Bases de Datos II', date: 'Viernes 4 Oct · 09:00', type: 'Examen' },
  { title: 'Cierre de actas - Laboratorio de Software', date: 'Lunes 7 Oct · 12:00', type: 'Administrativo' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout
      title={`Hola ${user?.nombre ?? 'estudiante'}`}
      subtitle="Esto es lo que tenés para hoy en tu recorrido académico"
    >
      <section className={styles.gridStats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statDelta}>{stat.delta}</span>
          </div>
        ))}
      </section>

      <Card title="Resumen académico" subtitle="Visualiza tus cursadas, evolución de notas y próximas entregas.">
        <div className="grid-cards">
          <div>
            <h3 className="page-subheading" style={{ marginBottom: '16px' }}>Progreso de cursadas</h3>
            <div className="timeline">
              {[
                { label: 'Ingeniería de Software II', value: 72 },
                { label: 'Bases de Datos II', value: 55 },
                { label: 'Matemática Discreta', value: 90 },
              ].map((course) => (
                <div key={course.label} className={styles.timelineItem}>
                  <span className={styles.timelineTitle}>{course.label}</span>
                  <span className={styles.timelineDate}>{course.value}% completado</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="page-subheading" style={{ marginBottom: '16px' }}>Últimas calificaciones</h3>
            <div className="timeline">
              {[
                { subject: 'Teoría de la Computación', score: '8.50', note: 'Parcial 1' },
                { subject: 'Sistemas Paralelos', score: '9.00', note: 'Trabajo práctico' },
                { subject: 'Redes de Datos', score: '7.50', note: 'Evaluación continua' },
              ].map((item) => (
                <div key={item.subject} className={styles.timelineItem}>
                  <span className={styles.timelineTitle}>{item.subject}</span>
                  <span className={styles.timelineDate}>{item.note}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid-cards">
        <Card title="Agenda inmediata" subtitle="Organizá tu semana con los hitos más relevantes.">
          <div className={styles.timeline}>
            {timeline.map((item) => (
              <div key={item.title} className={styles.timelineItem}>
                <span className={styles.timelineType}>{item.type}</span>
                <span className={styles.timelineTitle}>{item.title}</span>
                <span className={styles.timelineDate}>{item.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.objectiveCard}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Objetivo académico del mes</h3>
            <p style={{ margin: '8px 0 0', color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.6 }}>
              Preparáte para las mesas de examen final con la guía sugerida por tu departamento.
            </p>
          </div>
          <button
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'rgba(248, 250, 252, 0.9)',
              color: '#312e81',
              fontWeight: 600,
              cursor: 'pointer',
              width: 'fit-content'
            }}
            type="button"
          >
            Ver plan de acompañamiento
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
