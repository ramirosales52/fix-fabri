// src/departamento/entities/departamento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
import { Carrera } from '../../carrera/entities/carrera.entity';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // Relación con carrera (opcional)
  @ManyToOne(() => Carrera, carrera => carrera.departamentos, { nullable: true })
  @JoinColumn({ name: 'carreraId' })
  carrera?: Carrera;

  // Relación con materias
  @OneToMany(() => Materia, materia => materia.departamento)
  materias: Materia[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}