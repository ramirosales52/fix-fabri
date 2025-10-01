import { useMemo, useState } from 'react';
import styles from './Inscripciones.module.css';
import { AppLayout } from 'components/layout/AppLayout';

interface InscripcionStage {
  id: string;
  materia: string;
  comision: string;
  estado: 'pendiente' | 'confirmada' | 'rechazada';
  fechaSolicitud: string;
  fechaResolucion?: string;
  detalles: string;
}

const stages: InscripcionStage[] = [
  {
    id: 'INS-1023',
    materia: 'Sistemas Distribuidos',
    comision: 'Comisión 02 · Noche',
    estado: 'pendiente',
    fechaSolicitud: '20 Sep 2025 · 10:45',
    detalles: 'En revisión por el departamento de Sistemas de Información.',
  },
  {
    id: 'INS-1008',
    materia: 'Programación Concurrente',
    comision: 'Comisión 01 · Mañana',
    estado: 'confirmada',
    fechaSolicitud: '18 Sep 2025 · 08:12',
    fechaResolucion: '19 Sep 2025 · 15:30',
    detalles: 'Confirmada. Recordá asistir a la clase inaugural el 23/09.',
  },
  {
    id: 'INS-0991',
    materia: 'Historia de la Tecnología',
    comision: 'Comisión 03 · Virtual',
    estado: 'rechazada',
    fechaSolicitud: '15 Sep 2025 · 12:02',
    fechaResolucion: '16 Sep 2025 · 09:30',
    detalles: 'No cumple condición de correlativas. Requiere aprobar "Introducción a la Tecnología".',
  },
];

const badgeStyles: Record<InscripcionStage['estado'], string> = {
  pendiente: styles.badgePending,
  confirmada: styles.badgeConfirmed,
  rechazada: styles.badgeRejected,
};

export default function InscripcionesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return stages.filter((stage) => stage.materia.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <AppLayout
      title="Mis inscripciones"
      subtitle="Seguimiento en tiempo real de tus solicitudes y exámenes finales"
      actions={
        <input
          type="search"
          placeholder="Buscar materia"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            background: 'rgba(15, 23, 42, 0.55)',
            color: 'var(--text-primary)'
          }}
        />
      }
    >
      <div className="grid-cards">
        {filtered.map((stage) => (
          <div key={stage.id} className={styles.stageCard}>
            <div className={styles.stageHeader}>
              <div>
                <div className={styles.stageTitle}>{stage.materia}</div>
                <div className={styles.stageSubtitle}>Solicitud #{stage.id} · {stage.comision}</div>
              </div>
              <span className={[styles.badge, badgeStyles[stage.estado]].join(' ')}>{stage.estado}</span>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoTile}>
                <span className={styles.infoLabel}>Fecha solicitud</span>
                <span>{stage.fechaSolicitud}</span>
              </div>
              <div className={styles.infoTile}>
                <span className={styles.infoLabel}>Resolución</span>
                <span>{stage.fechaResolucion ?? 'En proceso'}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{stage.detalles}</p>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryAction}>Ver detalle de requisitos</button>
              {stage.estado === 'pendiente' && (
                <button type="button" className={styles.secondaryAction}>Retirar solicitud</button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.stageCard}>
            <div className={styles.stageTitle}>No hay inscripciones que coincidan</div>
            <p className={styles.stageSubtitle}>Ajustá el filtro o iniciá una nueva solicitud de cursada.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
