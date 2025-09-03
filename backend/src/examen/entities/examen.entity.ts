// src/examen/entities/examen.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ExamenFinal {
  @PrimaryGeneratedColumn()
  id: number;

  // Corregida la relación con Materia
  @ManyToOne(() => Materia, materia => materia.examenes) 
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  // Corregida la relación con User
  @ManyToOne(() => User, user => user.examenes)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  @Column({ nullable: true })
  nota?: number;

  @Column({ default: 'inscripto' })
  estado: string; // inscripto, ausente, aprobado, desaprobado
}