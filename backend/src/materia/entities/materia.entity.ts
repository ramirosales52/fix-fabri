// src/materia/entities/materia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { PlanEstudio } from '../../plan-estudio/entities/plan-estudio.entity';
import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';
import { User } from '../../user/entities/user.entity';
import { Evaluacion } from '../../evaluacion/entities/evaluacion.entity';
import { Horario } from '../../horario/entities/horario.entity';
import { Clase } from '../../clase/entities/clase.entity';
import { ExamenFinal } from '../../examen/entities/examen.entity';
import { ExamenFinal as ExamenFinalNuevo } from '../../examen-final/entities/examen-final.entity';
import { Comision } from '../../comision/entities/comision.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';
import { CorrelativasCursada } from '../../correlativas/entities/correlativas-cursada.entity';
import { CorrelativasFinal } from '../../correlativas/entities/correlativas-final.entity';

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // Relación muchos a muchos con PlanEstudio
  @ManyToMany(() => PlanEstudio, (plan) => plan.materias)
  @JoinTable({
    name: 'materia_planes_estudio',
    joinColumn: { name: 'materiaId' },
    inverseJoinColumn: { name: 'planEstudioId' }
  })
  planesEstudio: PlanEstudio[];

  // Relación con Departamento - ✅ Añadida (OBLIGATORIA)
  @ManyToOne(() => Departamento, (departamento) => departamento.materias)
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

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

  // Relaciones de Correlativas - Actualizadas
  @OneToMany(() => CorrelativasCursada, correlativa => correlativa.materia)
  correlativasCursada: CorrelativasCursada[];

  @OneToMany(() => CorrelativasFinal, correlativa => correlativa.materia)
  correlativasFinal: CorrelativasFinal[];

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
  @OneToMany(() => ExamenFinal, (examen) => examen.materia)
  examenes: ExamenFinal[];

  @OneToMany(() => ExamenFinalNuevo, (examen) => examen.materia)
  examenesFinales: ExamenFinalNuevo[];
  
  // ✅ RELACIÓN AÑADIDA: Comisiones de la materia
  @OneToMany(() => Comision, comision => comision.materia)
  comisiones: Comision[];
}