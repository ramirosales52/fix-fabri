<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Materia } from '../../materia/entities/materia.entity';
=======
// src/inscripcion/entities/inscripcion.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { Comision } from '../../comision/entities/comision.entity';
>>>>>>> 47a0884 (segundo commit)
import { Evaluacion } from '../../evaluacion/entities/evaluacion.entity';

@Entity()
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

<<<<<<< HEAD
  @ManyToOne(() => User, user => user.id)
  estudiante: User;

  @ManyToOne(() => Materia, materia => materia.inscripciones)
  materia: Materia;

=======
  // Relación con el estudiante
  @ManyToOne(() => User, estudiante => estudiante.inscripciones)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  // Relación con la materia
  @ManyToOne(() => Materia, materia => materia.inscripciones)
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  // Relación con la comisión (opcional)
  @ManyToOne(() => Comision, comision => comision.inscripciones, { nullable: true })
  @JoinColumn({ name: 'comisionId' })
  comision?: Comision;

>>>>>>> 47a0884 (segundo commit)
  @Column({ default: 0 })
  faltas: number;

  @Column({ nullable: true })
  notaFinal: number;

  @Column({ nullable: true })
  stc: string; // Estado de la materia: sin cursar, cursando, cursada, aprobada, etc.
  
<<<<<<< HEAD
  @OneToMany(() => Evaluacion, evaluacion => evaluacion.materia)
  evaluaciones: Evaluacion[];
  
=======
  // Añadido: Fecha de inscripción para rastrear múltiples cursadas
  @CreateDateColumn()
  fechaInscripcion: Date;
  
  // Añadido: Fecha de finalización (para cursos repetidos)
  @UpdateDateColumn()
  fechaFinalizacion: Date;

  // Corregida la relación inversa
  @OneToMany(() => Evaluacion, evaluacion => evaluacion.inscripcion) 
  evaluaciones: Evaluacion[];
>>>>>>> 47a0884 (segundo commit)
}