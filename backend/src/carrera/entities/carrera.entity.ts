import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PlanEstudio } from '../../plan-estudio/entities/plan-estudio.entity';

@Entity()
export class Carrera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => PlanEstudio, (plan) => plan.carrera)
  planes: PlanEstudio[];
}