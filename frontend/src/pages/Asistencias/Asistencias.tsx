import { useMemo, useState } from 'react';
import styles from './Asistencias.module.css';
import { AppLayout } from 'components/layout/AppLayout';

interface RegistroAsistencia {
  materia: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'justificada';
  docente: string;
  observaciones?: string;
}

const registros: RegistroAsistencia[] = [
  {
    materia: 'Redes de Datos II',
    fecha: '27 Sep 2025 · Clase práctica',
    estado: 'presente',
    docente: 'Ing. Rodrigo Silva',
    observaciones: 'Participación destacada en laboratorio.',
  },
  {
    materia: 'Ingeniería de Software II',
    fecha: '26 Sep 2025 · Teórica',
    estado: 'ausente',
    docente: 'Dra. Cecilia Pereyra',
    observaciones: 'Se requiere justificar la inasistencia dentro de los próximos 5 días.',
  },
  {
    materia: 'Teoría de la Computación',
    fecha: '25 Sep 2025 · Teórica',
    estado: 'justificada',
    docente: 'Dr. Mariano Paz',
    observaciones: 'Justificación aprobada por consulta médica.',
  },
];

const resumen = {
  total: 48,
  presentes: 40,
  ausentes: 4,
  justificadas: 4,
};

const badgeByStatus: Record<RegistroAsistencia['estado'], string> = {
  presente: styles.badgePresente,
  ausente: styles.badgeAusente,
  justificada: styles.badgeJustificada,
};

export default function AsistenciasPage() {
  const [tab, setTab] = useState<'todas' | 'presente' | 'ausente' | 'justificada'>('todas');

  const filtered = useMemo(() => {
    if (tab === 'todas') return registros;
    return registros.filter((registro) => registro.estado === tab);
  }, [tab]);

  const porcentajeAsistencia = Math.round((resumen.presentes / resumen.total) * 100);

  return (
    <AppLayout title="Registro de asistencias" subtitle="Controlá tus asistencias por materia y gestioná tus justificativos">
      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Clases asistidas</span>
          <span className={styles.summaryValue}>{resumen.presentes}</span>
          <span className={styles.summaryLabel}>{resumen.presentes} de {resumen.total} clases dictadas</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Porcentaje general</span>
          <span className={styles.summaryValue}>{porcentajeAsistencia}%</span>
          <span className={styles.summaryLabel}>Mínimo requerido: 80%</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Ausencias pendientes</span>
          <span className={styles.summaryValue}>{resumen.ausentes}</span>
          <span className={styles.summaryLabel}>Recordá justificar en la semana</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Justificaciones aprobadas</span>
          <span className={styles.summaryValue}>{resumen.justificadas}</span>
          <span className={styles.summaryLabel}>Último mes habilitado</span>
        </div>
      </section>

      <div className={styles.tabs}>
        {(['todas', 'presente', 'ausente', 'justificada'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={[styles.tabButton, tab === option ? styles.tabActive : undefined].filter(Boolean).join(' ')}
          >
            {option === 'todas' ? 'Todas' : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.recordList}>
        {filtered.map((registro) => (
          <div key={`${registro.materia}-${registro.fecha}`} className={styles.recordItem}>
            <div className={styles.recordHeader}>
              <div>
                <div style={{ fontWeight: 600 }}>{registro.materia}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{registro.docente}</div>
              </div>
              <span className={[styles.badge, badgeByStatus[registro.estado]].join(' ')}>
                {registro.estado}
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>{registro.fecha}</div>
            {registro.observaciones && (
              <p style={{ color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.6 }}>{registro.observaciones}</p>
            )}
            {registro.estado === 'ausente' && (
              <div className={styles.recordFooter}>
                <button type="button" className={styles.secondaryAction}>Subir justificativo</button>
                <button type="button" className={styles.primaryAction}>Solicitar revisión</button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.recordItem}>
            <div style={{ fontWeight: 600 }}>No hay registros para el filtro seleccionado.</div>
            <div style={{ color: 'var(--text-muted)' }}>Probá cambiar de pestaña para ver otros estados.</div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
