// plan-estudio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Carrera } from '../../carrera/entities/carrera.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PlanEstudio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Carrera, (carrera) => carrera.planes)
  carrera: Carrera;

  @OneToMany(() => Materia, (materia) => materia.planEstudio)
  materias: Materia[];

  // 👇 Relación inversa: estudiantes que tienen este plan
  @OneToMany(() => User, (user) => user.planEstudio)
  estudiantes: User[];
}