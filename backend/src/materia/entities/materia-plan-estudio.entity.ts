// Entidad intermedia que permite asociar una materia con un plan de estudio
// y almacenar metadatos adicionales, como el "nivel" (año de cursada) en ese plan.
// Es necesaria porque una relación ManyToMany directa no permite guardar datos extra.
// Esta tabla resuelve el requerimiento de que la misma materia tenga distinto nivel
// en distintos planes de estudio.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Materia } from './materia.entity';
import { PlanEstudio } from '../../plan-estudio/entities/plan-estudio.entity';

@Entity('materia_planes_estudio')
export class MateriaPlanEstudio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'materiaId' })
  materiaId: number;

  @Column({ name: 'planEstudioId' })
  planEstudioId: number;

  @Column({ name: 'nivel', type: 'int' })
  nivel: number;

  @ManyToOne(() => Materia, materia => materia.relacionesConPlanes)
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @ManyToOne(() => PlanEstudio, plan => plan.relacionesConMaterias)
  @JoinColumn({ name: 'planEstudioId' })
  planEstudio: PlanEstudio;
}