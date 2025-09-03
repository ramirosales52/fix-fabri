<<<<<<< HEAD
=======
// src/clase/entities/clase.entity.ts
>>>>>>> 47a0884 (segundo commit)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
import { Horario } from '../../horario/entities/horario.entity';
import { Asistencia } from '../../asistencia/entities/asistencia.entity';
<<<<<<< HEAD
=======
import { User } from '../../user/entities/user.entity';
import { Comision } from '../../comision/entities/comision.entity'; // ✅ Importar Comision
>>>>>>> 47a0884 (segundo commit)

export enum EstadoClase {
  PROGRAMADA = 'programada',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
}

@Entity()
export class Clase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Materia, materia => materia.clases)
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @ManyToOne(() => Horario, { nullable: true })
  @JoinColumn({ name: 'horarioId' })
  horario?: Horario;

<<<<<<< HEAD
=======
  // ✅ RELACIÓN AÑADIDA: Comisión (opcional)
  @ManyToOne(() => Comision, comision => comision.clases, { nullable: true })
  @JoinColumn({ name: 'comisionId' })
  comision?: Comision;

  // Añadida la relación con el docente/profesor
  @ManyToOne(() => User, user => user.clasesDictadas, { nullable: true })
  @JoinColumn({ name: 'docenteId' })
  docente?: User;

>>>>>>> 47a0884 (segundo commit)
  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ 
    type: 'enum', 
    enum: EstadoClase, 
    default: EstadoClase.PROGRAMADA 
  })
  estado: EstadoClase;

  @Column({ nullable: true })
  motivoCancelacion?: string;

  @OneToMany(() => Asistencia, asistencia => asistencia.clase)
  asistencias: Asistencia[];
}