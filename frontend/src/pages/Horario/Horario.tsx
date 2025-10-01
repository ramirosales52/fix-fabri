import styles from './Horario.module.css';
import { AppLayout } from 'components/layout/AppLayout';

const weekSlots = [
  {
    day: 'Lunes',
    date: '30 Sep',
    items: [
      { subject: 'Redes de Datos II', time: '19:00 - 22:00', location: 'Lab 2, Campus Central', type: 'Clase práctica' },
    ],
  },
  {
    day: 'Martes',
    date: '1 Oct',
    items: [
      { subject: 'Ingeniería de Software II', time: '18:00 - 21:00', location: 'Lab 4, Campus Lugones', type: 'Laboratorio' },
      { subject: 'Tutoría académica', time: '21:15 - 22:00', location: 'Sala virtual MS Teams', type: 'Tutoría' },
    ],
  },
  {
    day: 'Miércoles',
    date: '2 Oct',
    items: [
      { subject: 'Gestión de Proyectos Tecnológicos', time: '09:00 - 12:00', location: 'Edificio Innovación · Sala 301', type: 'Clase teórica' },
      { subject: 'Consulta Matemática III', time: '18:00 - 19:30', location: 'Aula 205', type: 'Consulta' },
    ],
  },
  {
    day: 'Jueves',
    date: '3 Oct',
    items: [
      { subject: 'Ingeniería de Software II', time: '18:00 - 20:00', location: 'Aula Magna 2', type: 'Clase teórica' },
    ],
  },
  {
    day: 'Viernes',
    date: '4 Oct',
    items: [
      { subject: 'Examen parcial Bases de Datos II', time: '09:00 - 11:00', location: 'Aula Magna 1', type: 'Evaluación' },
      { subject: 'Teoría de la Computación', time: '17:00 - 20:00', location: 'Aula 305', type: 'Clase teórica' },
    ],
  },
];

export default function HorarioPage() {
  return (
    <AppLayout title="Mi agenda semanal" subtitle="Organizá tus clases, consultas y exámenes con un resumen visual">
      <section className={styles.weekGrid}>
        {weekSlots.map((slot) => (
          <div key={slot.day} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span>{slot.day}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{slot.date}</span>
            </div>
            {slot.items.map((item) => (
              <div key={`${slot.day}-${item.subject}-${item.time}`} className={styles.slot}>
                <span className={styles.slotTitle}>{item.subject}</span>
                <span className={styles.slotMeta}>{item.time}</span>
                <span className={styles.slotMeta}>{item.location}</span>
                <span className={styles.slotMeta}>{item.type}</span>
              </div>
            ))}
            {slot.items.length === 0 && (
              <div className={styles.slot}>
                <span className={styles.slotMeta}>Sin actividades programadas</span>
              </div>
            )}
          </div>
        ))}
      </section>
    </AppLayout>
  );
}
