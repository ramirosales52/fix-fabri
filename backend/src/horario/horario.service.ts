// src/horario/horario.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Horario, DiaSemana } from './entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
<<<<<<< HEAD
=======
import { Comision } from '../comision/entities/comision.entity'; // ✅ Importar Comision
>>>>>>> 47a0884 (segundo commit)

// ✅ Interfaces para el formato de horario
export interface HorarioDiario {
  fecha: Date;
  diaSemana: DiaSemana;
  bloques: HorarioBloque[];
}

export interface HorarioBloque {
  materia: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
<<<<<<< HEAD
=======
  comision?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
>>>>>>> 47a0884 (segundo commit)
  horaInicio: string;
  horaFin: string;
  aula: string;
  esProfesor: boolean;
  materiaId: number;
<<<<<<< HEAD
=======
  comisionId?: number;
>>>>>>> 47a0884 (segundo commit)
}

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(Horario)
    private horarioRepo,
    @InjectRepository(Materia)
    private materiaRepo,
    @InjectRepository(User)
    private userRepo,
    @InjectRepository(Inscripcion)
    private inscripcionRepo,
<<<<<<< HEAD
=======
    @InjectRepository(Comision)
    private comisionRepo, // ✅ Añadir repositorio de comisiones
>>>>>>> 47a0884 (segundo commit)
  ) {}

  async crearHorario(
    materiaId: number,
    dia: DiaSemana,
    horaInicio: string,
    horaFin: string,
    aula: string,
<<<<<<< HEAD
=======
    comisionId?: number, // ✅ Añadir comisionId opcional
    docenteId?: number,   // ✅ Añadir docenteId opcional
>>>>>>> 47a0884 (segundo commit)
  ): Promise<Horario> {
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

<<<<<<< HEAD
    const horario = this.horarioRepo.create({
      materia,
=======
    // Verificar que la comisión exista si se proporciona
    let comision;
    if (comisionId) {
      comision = await this.comisionRepo.findOne({ where: { id: comisionId } });
      if (!comision) {
        throw new NotFoundException('Comisión no encontrada');
      }
    }

    // Verificar que el docente exista si se proporciona
    let docente;
    if (docenteId) {
      docente = await this.userRepo.findOne({ where: { id: docenteId } });
      if (!docente) {
        throw new NotFoundException('Docente no encontrado');
      }
    }

    const horario = this.horarioRepo.create({
      materia,
      docente,
      comision,
>>>>>>> 47a0884 (segundo commit)
      dia,
      horaInicio,
      horaFin,
      aula,
    });

    return this.horarioRepo.save(horario);
  }

  async obtenerHorariosPorMateria(materiaId: number): Promise<Horario[]> {
    return this.horarioRepo.find({
      where: { materia: { id: materiaId } },
<<<<<<< HEAD
=======
      relations: ['comision', 'docente'], // ✅ Incluir relaciones
      order: { dia: 'ASC', horaInicio: 'ASC' },
    });
  }

  async obtenerHorariosPorComision(comisionId: number): Promise<Horario[]> {
    return this.horarioRepo.find({
      where: { comision: { id: comisionId } },
      relations: ['materia', 'docente'], // ✅ Incluir relaciones
>>>>>>> 47a0884 (segundo commit)
      order: { dia: 'ASC', horaInicio: 'ASC' },
    });
  }

  async actualizarHorario(
    id: number,
    dia?: DiaSemana,
    horaInicio?: string,
    horaFin?: string,
    aula?: string,
<<<<<<< HEAD
  ): Promise<Horario> {
    const horario = await this.horarioRepo.findOne({ where: { id } });
=======
    comisionId?: number | null, // ✅ Añadir comisionId opcional (puede ser null)
    docenteId?: number | null,   // ✅ Añadir docenteId opcional (puede ser null)
  ): Promise<Horario> {
    const horario = await this.horarioRepo.findOne({ 
      where: { id },
      relations: ['materia'] // ✅ Incluir materia para validación
    });
>>>>>>> 47a0884 (segundo commit)
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

<<<<<<< HEAD
    if (dia) horario.dia = dia;
    if (horaInicio) horario.horaInicio = horaInicio;
    if (horaFin) horario.horaFin = horaFin;
    if (aula) horario.aula = aula;
=======
    // Actualizar campos simples
    if (dia !== undefined) horario.dia = dia;
    if (horaInicio !== undefined) horario.horaInicio = horaInicio;
    if (horaFin !== undefined) horario.horaFin = horaFin;
    if (aula !== undefined) horario.aula = aula;

    // Manejar comisión
    if (comisionId !== undefined) {
      if (comisionId === null) {
        horario.comision = null;
      } else {
        const comision = await this.comisionRepo.findOne({ where: { id: comisionId } });
        if (!comision) {
          throw new NotFoundException('Comisión no encontrada');
        }
        horario.comision = comision;
      }
    }

    // Manejar docente
    if (docenteId !== undefined) {
      if (docenteId === null) {
        horario.docente = null;
      } else {
        const docente = await this.userRepo.findOne({ where: { id: docenteId } });
        if (!docente) {
          throw new NotFoundException('Docente no encontrado');
        }
        horario.docente = docente;
      }
    }
>>>>>>> 47a0884 (segundo commit)

    return this.horarioRepo.save(horario);
  }

  async eliminarHorario(id: number): Promise<void> {
    const horario = await this.horarioRepo.findOne({ where: { id } });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    await this.horarioRepo.remove(horario);
  }

  // ✅ NUEVO: Obtener horario personalizado para un usuario
  async obtenerHorarioPersonal(
    userId: number,
    fechaInicio: Date = new Date(),
    fechaFin: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
  ): Promise<HorarioDiario[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular días entre fechaInicio y fechaFin
    const dias = this.getDiasEntreFechas(fechaInicio, fechaFin);
    
    // Preparar estructura de horario
    const horarioSemana: HorarioDiario[] = dias.map(fecha => ({
      fecha,
      diaSemana: this.getDiaSemana(fecha),
      bloques: [],
    }));

    // Obtener horarios según rol
    if (user.rol === 'estudiante') {
      await this.agregarHorariosEstudiante(userId, horarioSemana);
    } else {
      await this.agregarHorariosProfesor(userId, horarioSemana);
    }

    return horarioSemana;
  }

  private getDiasEntreFechas(fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas: Date[] = []; // ✅ Tipo explícito
    let currentDate = new Date(fechaInicio);
    
    while (currentDate <= fechaFin) {
      fechas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return fechas;
  }

  private getDiaSemana(fecha: Date): DiaSemana {
    const dia = fecha.getDay();
    switch (dia) {
      case 0: return DiaSemana.DOMINGO; // ✅ Ahora existe en el enum
      case 1: return DiaSemana.LUNES;
      case 2: return DiaSemana.MARTES;
      case 3: return DiaSemana.MIERCOLES;
      case 4: return DiaSemana.JUEVES;
      case 5: return DiaSemana.VIERNES;
      case 6: return DiaSemana.SABADO;
      default: return DiaSemana.LUNES;
    }
  }

  private async agregarHorariosEstudiante(userId: number, horarioSemana: HorarioDiario[]) {
    // Obtener materias en las que está inscripto
    const inscripciones = await this.inscripcionRepo.find({
      where: { estudiante: { id: userId } },
<<<<<<< HEAD
      relations: ['materia', 'materia.horarios'],
=======
      relations: ['materia', 'materia.horarios', 'materia.comisiones'], // ✅ Incluir comisiones
>>>>>>> 47a0884 (segundo commit)
    });

    // Para cada día de la semana
    for (const dia of horarioSemana) {
      // Filtrar horarios para este día
      inscripciones.forEach(inscripcion => {
<<<<<<< HEAD
=======
        // Primero buscamos horarios directos de la materia
>>>>>>> 47a0884 (segundo commit)
        inscripcion.materia.horarios.forEach(horario => {
          if (horario.dia === dia.diaSemana) {
            dia.bloques.push({
              materia: {
                id: inscripcion.materia.id,
                nombre: inscripcion.materia.nombre,
                descripcion: inscripcion.materia.descripcion,
              },
<<<<<<< HEAD
=======
              comision: horario.comision ? { // ✅ Incluir información de comisión si existe
                id: horario.comision.id,
                nombre: horario.comision.nombre,
                descripcion: horario.comision.descripcion,
              } : undefined,
>>>>>>> 47a0884 (segundo commit)
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              aula: horario.aula,
              esProfesor: false,
              materiaId: inscripcion.materia.id,
<<<<<<< HEAD
            });
          }
        });
=======
              comisionId: horario.comision ? horario.comision.id : undefined,
            });
          }
        });

        // Luego buscamos horarios de las comisiones de esa materia
        inscripcion.materia.comisiones.forEach(comision => {
          comision.horarios.forEach(horario => {
            if (horario.dia === dia.diaSemana) {
              dia.bloques.push({
                materia: {
                  id: inscripcion.materia.id,
                  nombre: inscripcion.materia.nombre,
                  descripcion: inscripcion.materia.descripcion,
                },
                comision: {
                  id: comision.id,
                  nombre: comision.nombre,
                  descripcion: comision.descripcion,
                },
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                aula: horario.aula,
                esProfesor: false,
                materiaId: inscripcion.materia.id,
                comisionId: comision.id,
              });
            }
          });
        });
>>>>>>> 47a0884 (segundo commit)
      });

      // Ordenar bloques por hora
      dia.bloques.sort((a, b) => 
        a.horaInicio.localeCompare(b.horaInicio)
      );
    }
  }

  private async agregarHorariosProfesor(userId: number, horarioSemana: HorarioDiario[]) {
    // Obtener materias que dicta
    const materias = await this.materiaRepo.find({
      where: { profesores: { id: userId } },
<<<<<<< HEAD
      relations: ['horarios'],
=======
      relations: ['horarios', 'comisiones', 'comisiones.horarios'], // ✅ Incluir horarios de comisiones
>>>>>>> 47a0884 (segundo commit)
    });

    // Para cada día de la semana
    for (const dia of horarioSemana) {
      // Filtrar horarios para este día
      materias.forEach(materia => {
<<<<<<< HEAD
=======
        // Horarios directos de la materia
>>>>>>> 47a0884 (segundo commit)
        materia.horarios.forEach(horario => {
          if (horario.dia === dia.diaSemana) {
            dia.bloques.push({
              materia: {
                id: materia.id,
                nombre: materia.nombre,
                descripcion: materia.descripcion,
              },
<<<<<<< HEAD
=======
              comision: horario.comision ? { // ✅ Incluir información de comisión si existe
                id: horario.comision.id,
                nombre: horario.comision.nombre,
                descripcion: horario.comision.descripcion,
              } : undefined,
>>>>>>> 47a0884 (segundo commit)
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              aula: horario.aula,
              esProfesor: true,
              materiaId: materia.id,
<<<<<<< HEAD
            });
          }
        });
=======
              comisionId: horario.comision ? horario.comision.id : undefined,
            });
          }
        });

        // Horarios de las comisiones de esta materia
        materia.comisiones.forEach(comision => {
          comision.horarios.forEach(horario => {
            if (horario.dia === dia.diaSemana) {
              dia.bloques.push({
                materia: {
                  id: materia.id,
                  nombre: materia.nombre,
                  descripcion: materia.descripcion,
                },
                comision: {
                  id: comision.id,
                  nombre: comision.nombre,
                  descripcion: comision.descripcion,
                },
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                aula: horario.aula,
                esProfesor: true,
                materiaId: materia.id,
                comisionId: comision.id,
              });
            }
          });
        });
>>>>>>> 47a0884 (segundo commit)
      });

      // Ordenar bloques por hora
      dia.bloques.sort((a, b) => 
        a.horaInicio.localeCompare(b.horaInicio)
      );
    }
  }
}