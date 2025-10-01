import { useMemo, useState } from 'react';
import styles from './Materias.module.css';
import { AppLayout } from 'components/layout/AppLayout';

interface MateriaPreview {
  name: string;
  department: string;
  profesores: string[];
  horarios: { dia: string; hora: string; aula: string }[];
  correlativas: string[];
  cupo: { total: number; disponible: number };
  modalidad: 'Presencial' | 'Virtual' | 'Híbrida';
}

const sampleMaterias: MateriaPreview[] = [
  {
    name: 'Ingeniería de Software II',
    department: 'Departamento de Sistemas de Información',
    profesores: ['Dra. Cecilia Pereyra', 'Ing. Matías Aguirre'],
    horarios: [
      { dia: 'Martes', hora: '18:00 - 21:00', aula: 'Lab 4 | Campus Lugones' },
      { dia: 'Jueves', hora: '18:00 - 20:00', aula: 'Aula Magna 2' },
    ],
    correlativas: ['Ingeniería de Software I', 'Bases de Datos'],
    cupo: { total: 80, disponible: 12 },
    modalidad: 'Híbrida',
  },
  {
    name: 'Teoría de la Computación',
    department: 'Departamento de Ciencias de la Computación',
    profesores: ['Dr. Mariano Paz'],
    horarios: [
      { dia: 'Miércoles', hora: '17:00 - 20:00', aula: 'Aula 305' },
      { dia: 'Viernes', hora: '17:30 - 19:30', aula: 'Aula 305' },
    ],
    correlativas: ['Matemática Discreta'],
    cupo: { total: 60, disponible: 25 },
    modalidad: 'Presencial',
  },
  {
    name: 'Gestión de Proyectos Tecnológicos',
    department: 'Departamento de Gestión',
    profesores: ['Lic. Patricia Bruzzone'],
    horarios: [
      { dia: 'Miércoles', hora: '09:00 - 12:00', aula: 'Edificio Innovación · Sala 301' },
    ],
    correlativas: ['Ingeniería de Software II'],
    cupo: { total: 45, disponible: 9 },
    modalidad: 'Virtual',
  },
];

export default function MateriasPage() {
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState<'Todas' | MateriaPreview['modalidad']>('Todas');

  const materias = useMemo(() => {
    return sampleMaterias.filter((materia) => {
      const matchesQuery = materia.name.toLowerCase().includes(query.toLowerCase()) ||
        materia.department.toLowerCase().includes(query.toLowerCase());
      const matchesModality = modality === 'Todas' || materia.modalidad === modality;
      return matchesQuery && matchesModality;
    });
  }, [query, modality]);

  return (
    <AppLayout title="Oferta de materias" subtitle="Seleccioná la cursada que mejor se adapte a tu plan de estudio.">
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Buscar por nombre, cátedra o departamento"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{
            flex: '1 1 260px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            background: 'rgba(15, 23, 42, 0.55)',
            color: 'var(--text-primary)'
          }}
        />
        {(['Todas', 'Presencial', 'Virtual', 'Híbrida'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setModality(option === 'Todas' ? 'Todas' : option)}
            className={[
              styles.filterButton,
              modality === option ? styles.filterButtonActive : undefined,
            ].filter(Boolean).join(' ')}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid-cards">
        {materias.map((materia) => (
          <div key={materia.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>{materia.name}</h3>
                <p className={styles.cardDepartment}>{materia.department}</p>
              </div>
              <span className={styles.chip}>{materia.modalidad}</span>
            </div>

            <div className={styles.detailRow}>
              <span>👩‍🏫</span>
              <span>{materia.profesores.join(' · ')}</span>
            </div>

            <div className={styles.detailRow}>
              <span>⏰</span>
              <span>{materia.horarios.map((slot) => `${slot.dia} ${slot.hora} (${slot.aula})`).join(' · ')}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correlativas</span>
              <div className={styles.correlativas}>
                {materia.correlativas.map((correlativa) => (
                  <span key={correlativa} className={styles.correlativaChip}>{correlativa}</span>
                ))}
              </div>
            </div>

            <div className={styles.detailRow}>
              <span>🎟️</span>
              <span>Cupo disponible {materia.cupo.disponible} / {materia.cupo.total}</span>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryAction}>Inscribirme</button>
              <button type="button" className={styles.secondaryAction}>Ver comisión y plan</button>
            </div>
          </div>
        ))}

        {materias.length === 0 && (
          <div className={styles.card}>
            <h3>No hay materias que coincidan con la búsqueda</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Ajustá el filtro o probá con otra palabra clave.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
