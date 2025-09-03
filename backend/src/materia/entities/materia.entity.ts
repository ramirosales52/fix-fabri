// src/materia/entities/materia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { PlanEstudio } from '../../plan-estudio/entities/plan-estudio.entity';
import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';
import { User } from '../../user/entities/user.entity';
import { Evaluacion } from '../../evaluacion/entities/evaluacion.entity';
import { Horario } from '../../horario/entities/horario.entity';
import { Clase } from '../../clase/entities/clase.entity';
import { ExamenFinal } from '../../examen/entities/examen.entity';
import { Comision } from '../../comision/entities/comision.entity'; // ✅ Importar Comision

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // Relación con PlanEstudio - Verificada
  @ManyToOne(() => PlanEstudio, (plan) => plan.materias)
  @JoinColumn({ name: 'planEstudioId' })
  planEstudio: PlanEstudio;

  // Relación con Inscripciones - Verificada
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.materia)
  inscripciones: Inscripcion[];

  // Relación con Profesores - Verificada
  @ManyToMany(() => User, (user) => user.materiasDictadas)
  @JoinTable({
    name: 'materia_profesores',
    joinColumn: { name: 'materiaId' },
    inverseJoinColumn: { name: 'userId' },
  })
  profesores: User[];

  // Relación con Jefe de Cátedra - Verificada
  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jefeCatedraId' })
  jefeCatedra?: User;

  // Relaciones de Correlativas - Verificadas
  @ManyToMany(() => Materia, { cascade: true })
  @JoinTable({ name: 'correlativas_cursada' })
  correlativasCursada: Materia[];

  @ManyToMany(() => Materia, { cascade: true })
  @JoinTable({ name: 'correlativas_final' })
  correlativasFinal: Materia[];

  // Relación con Evaluaciones - Verificada
  @OneToMany(() => Evaluacion, evaluacion => evaluacion.materia)
  evaluaciones: Evaluacion[];

  // Relación con Horarios - Verificada
  @OneToMany(() => Horario, horario => horario.materia)
  horarios: Horario[];

  // Relación con Clases - Verificada
  @OneToMany(() => Clase, clase => clase.materia)
  clases: Clase[];
  
  // ✅ RELACIÓN AÑADIDA: Exámenes finales de la materia
  @OneToMany(() => ExamenFinal, examen => examen.materia)
  examenes: ExamenFinal[];
  
  // ✅ RELACIÓN AÑADIDA: Comisiones de la materia
  @OneToMany(() => Comision, comision => comision.materia)
  comisiones: Comision[];
}