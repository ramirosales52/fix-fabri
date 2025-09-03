// src/clase/clase.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clase, EstadoClase } from './entities/clase.entity';
import { Horario } from '../horario/entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
<<<<<<< HEAD
=======
import { Comision } from '../comision/entities/comision.entity'; // ✅ Importar Comision
>>>>>>> 47a0884 (segundo commit)

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(Clase)
    private claseRepo,
    @InjectRepository(Materia)
    private materiaRepo,
    @InjectRepository(Horario)
    private horarioRepo,
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

  async crearClase(
    materiaId: number,
    fecha: Date,
    horarioId?: number,
<<<<<<< HEAD
=======
    comisionId?: number, // ✅ Añadir comisionId opcional
>>>>>>> 47a0884 (segundo commit)
    estado: EstadoClase = EstadoClase.PROGRAMADA,
    motivoCancelacion?: string,
  ): Promise<Clase> {
    const materia = await this.materiaRepo.findOne({ 
      where: { id: materiaId },
<<<<<<< HEAD
      relations: ['inscripciones', 'inscripciones.estudiante'],
=======
      relations: ['inscripciones', 'inscripciones.estudiante', 'comisiones'], // ✅ Incluir comisiones
>>>>>>> 47a0884 (segundo commit)
    });
    
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    let horario;
    if (horarioId) {
      horario = await this.horarioRepo.findOne({ where: { id: horarioId } });
      if (!horario) {
        throw new NotFoundException('Horario no encontrado');
      }
    }

<<<<<<< HEAD
=======
    // Verificar que la comisión exista si se proporciona
    let comision;
    if (comisionId) {
      comision = await this.comisionRepo.findOne({ where: { id: comisionId } });
      if (!comision) {
        throw new NotFoundException('Comisión no encontrada');
      }
    }

>>>>>>> 47a0884 (segundo commit)
    // Verificar que no haya otra clase en la misma fecha y hora
    const solapamiento = await this.claseRepo.findOne({
      where: {
        materia: { id: materiaId },
        fecha,
      },
    });

    if (solapamiento) {
      throw new BadRequestException('Ya existe una clase programada para esta fecha');
    }

    const clase = this.claseRepo.create({
      materia,
      horario,
<<<<<<< HEAD
=======
      comision, // ✅ Añadir comisión
>>>>>>> 47a0884 (segundo commit)
      fecha,
      estado,
      motivoCancelacion,
    });

    const claseGuardada = await this.claseRepo.save(clase);

    // Crear registros de asistencia para todos los estudiantes inscriptos
    if (estado === EstadoClase.REALIZADA && materia.inscripciones) {
      await this.crearRegistrosAsistencia(claseGuardada, materia.inscripciones);
    }

    return claseGuardada;
  }

  private async crearRegistrosAsistencia(clase: Clase, inscripciones: Inscripcion[]) {
    const asistencias = inscripciones.map(inscripcion => ({
      clase,
      estudiante: inscripcion.estudiante,
      estado: 'ausente' as const,
    }));

    await this.claseRepo.manager.save(asistencias);
  }

  async obtenerClasesPorMateria(materiaId: number): Promise<Clase[]> {
    return this.claseRepo.find({
      where: { materia: { id: materiaId } },
<<<<<<< HEAD
      relations: ['horario', 'asistencias', 'asistencias.estudiante'],
=======
      relations: ['horario', 'comision', 'asistencias', 'asistencias.estudiante'], // ✅ Incluir comision
      order: { fecha: 'DESC' },
    });
  }

  async obtenerClasesPorComision(comisionId: number): Promise<Clase[]> {
    return this.claseRepo.find({
      where: { comision: { id: comisionId } },
      relations: ['materia', 'horario', 'asistencias', 'asistencias.estudiante'],
>>>>>>> 47a0884 (segundo commit)
      order: { fecha: 'DESC' },
    });
  }

  async obtenerClasesPorEstudiante(estudianteId: number): Promise<Clase[]> {
    return this.claseRepo
      .createQueryBuilder('clase')
      .innerJoin('clase.asistencias', 'asistencia')
      .innerJoin('asistencia.estudiante', 'estudiante')
      .where('estudiante.id = :estudianteId', { estudianteId })
      .orderBy('clase.fecha', 'DESC')
      .getMany();
  }

  async actualizarClase(
    id: number,
    fecha?: Date,
    estado?: EstadoClase,
    motivoCancelacion?: string,
<<<<<<< HEAD
  ): Promise<Clase> {
    const clase = await this.claseRepo.findOne({
      where: { id },
      relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante'],
=======
    comisionId?: number | null, // ✅ Añadir comisionId opcional
  ): Promise<Clase> {
    const clase = await this.claseRepo.findOne({
      where: { id },
      relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante', 'comision'], // ✅ Incluir comision
>>>>>>> 47a0884 (segundo commit)
    });
    
    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

<<<<<<< HEAD
=======
    // Manejar comisión
    if (comisionId !== undefined) {
      if (comisionId === null) {
        clase.comision = null;
      } else {
        const comision = await this.comisionRepo.findOne({ where: { id: comisionId } });
        if (!comision) {
          throw new NotFoundException('Comisión no encontrada');
        }
        clase.comision = comision;
      }
    }

>>>>>>> 47a0884 (segundo commit)
    if (fecha) clase.fecha = fecha;
    if (estado) clase.estado = estado;
    if (motivoCancelacion) clase.motivoCancelacion = motivoCancelacion;

    // Si se marca como realizada, crear registros de asistencia si no existen
    if (estado === EstadoClase.REALIZADA && clase.asistencias?.length === 0 && clase.materia.inscripciones) {
      await this.crearRegistrosAsistencia(clase, clase.materia.inscripciones);
    }

    return this.claseRepo.save(clase);
  }

  async cancelarClase(id: number, motivo: string): Promise<Clase> {
    return this.actualizarClase(id, undefined, EstadoClase.CANCELADA, motivo);
  }
}