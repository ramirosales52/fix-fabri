// src/horario/entities/horario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
<<<<<<< HEAD

export enum DiaSemana {
  DOMINGO = 'domingo', // ✅ Añadido DOMINGO
=======
import { User } from '../../user/entities/user.entity';
import { Comision } from '../../comision/entities/comision.entity'; // ✅ Importar Comision

export enum DiaSemana {
  DOMINGO = 'domingo',
>>>>>>> 47a0884 (segundo commit)
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
}

@Entity()
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Materia, materia => materia.horarios)
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

<<<<<<< HEAD
=======
  // Añadida la relación con el docente/profesor
  @ManyToOne(() => User, user => user.horariosDictados, { nullable: true }) 
  @JoinColumn({ name: 'docenteId' }) 
  docente?: User;

  // ✅ RELACIÓN AÑADIDA: Comisión (opcional)
  @ManyToOne(() => Comision, comision => comision.horarios, { nullable: true })
  @JoinColumn({ name: 'comisionId' })
  comision?: Comision;

>>>>>>> 47a0884 (segundo commit)
  @Column({ type: 'enum', enum: DiaSemana })
  dia: DiaSemana;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column()
  aula: string;
}