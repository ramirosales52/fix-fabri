// src/plan-estudio/entities/plan-estudio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
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

  @Column({ nullable: true })
  año: number;

  // ✅ CORRECCIÓN: La relación debe apuntar a 'planesEstudio' en Carrera, no a 'planes'
  @ManyToOne(() => Carrera, (carrera) => carrera.planesEstudio) // ✅ Cambiado de 'planes' a 'planesEstudio'
  @JoinColumn({ name: 'carreraId' })
  carrera: Carrera;

  // Relación muchos a muchos con Materia
  @ManyToMany(() => Materia, (materia) => materia.planesEstudio)
  @JoinTable({
    name: 'materia_planes_estudio',
    joinColumn: { name: 'planEstudioId' },
    inverseJoinColumn: { name: 'materiaId' }
  })
  materias: Materia[];

  // 👇 Relación inversa: estudiantes que tienen este plan
  @OneToMany(() => User, (user) => user.planEstudio)
  estudiantes: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}