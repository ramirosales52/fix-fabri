// src/inscripcion-examen/entities/inscripcion-examen.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ExamenFinal } from '../../examen/entities/examen.entity';
import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';

@Entity()
export class InscripcionExamen {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inscripcion, inscripcion => inscripcion.examenesInscritos)
  @JoinColumn({ name: 'inscripcionId' })
  inscripcion: Inscripcion;

  @ManyToOne(() => ExamenFinal, examen => examen.inscripciones)
  @JoinColumn({ name: 'examenId' })
  examen: ExamenFinal;

  @Column({ default: 'inscripto' })
  estado: string;

  @Column({ nullable: true })
  nota?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaInscripcion: Date;
}