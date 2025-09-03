// src/asistencia/asistencia.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia, EstadoAsistencia } from './entities/asistencia.entity';
import { Clase, EstadoClase } from '../clase/entities/clase.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

// ✅ Define el tipo para el resumen por materia
export interface ResumenPorMateria {
  [materiaId: number]: {
    total: number;
    presentes: number;
    justificadas: number;
    ausentes: number;
  };
}

export interface ResumenAsistencias {
  total: number;
  presentes: number;
  justificadas: number;
  ausentes: number;
  porMateria?: ResumenPorMateria;
}

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo,
    @InjectRepository(Clase)
    private claseRepo,
    @InjectRepository(User)
    private userRepo,
    @InjectRepository(Inscripcion)
    private inscripcionRepo,
  ) {}

  async registrarAsistencia(
    claseId: number,
    estudianteId: number,
    estado: EstadoAsistencia,
    motivoJustificacion?: string,
  ): Promise<Asistencia> {
    const clase = await this.claseRepo.findOne({ 
      where: { id: claseId },
      relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante'],
    });
    
    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    if (clase.estado !== EstadoClase.REALIZADA) {
      throw new BadRequestException('La clase debe estar en estado REALIZADA para registrar asistencia');
    }

    const estudiante = await this.userRepo.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Verificar que el estudiante esté inscripto en la materia
    const inscripto = clase.materia.inscripciones.some(
      inscripcion => inscripcion.estudiante.id === estudianteId
    );

    if (!inscripto) {
      throw new BadRequestException('El estudiante no está inscripto en esta materia');
    }

    // Verificar si ya existe un registro de asistencia
    let asistencia = await this.asistenciaRepo.findOne({
      where: { clase: { id: claseId }, estudiante: { id: estudianteId } },
    });

    if (asistencia) {
      // Actualizar registro existente
      asistencia.estado = estado;
      if (motivoJustificacion) {
        asistencia.motivoJustificacion = motivoJustificacion;
      }
    } else {
      // Crear nuevo registro
      asistencia = this.asistenciaRepo.create({
        clase,
        estudiante,
        estado,
        motivoJustificacion,
      });
    }

    return this.asistenciaRepo.save(asistencia);
  }

  async obtenerAsistenciasPorClase(claseId: number): Promise<Asistencia[]> {
    return this.asistenciaRepo.find({
      where: { clase: { id: claseId } },
      relations: ['estudiante'],
      order: { estudiante: { apellido: 'ASC' } },
    });
  }

  async obtenerAsistenciasPorEstudiante(estudianteId: number): Promise<Asistencia[]> {
    return this.asistenciaRepo.find({
      where: { estudiante: { id: estudianteId } },
      relations: ['clase', 'clase.materia'],
      order: { 'clase.fecha': 'DESC' },
    });
  }

  async obtenerResumenAsistencias(estudianteId: number, materiaId?: number): Promise<ResumenAsistencias> {
    let where: any = { estudiante: { id: estudianteId } };
    if (materiaId) {
      where.clase = { materia: { id: materiaId } };
    }

    const asistencias = await this.asistenciaRepo.find({
      where,
      relations: ['clase', 'clase.materia'],
    });

    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === EstadoAsistencia.PRESENTE).length;
    const justificadas = asistencias.filter(a => a.estado === EstadoAsistencia.JUSTIFICADA).length;
    const ausentes = asistencias.filter(a => a.estado === EstadoAsistencia.AUSENTE).length;

    // ✅ SOLUCIÓN DEFINITIVA (versión funcional simple)
    let porMateria: ResumenPorMateria | undefined;
    if (!materiaId) {
      // 1. Obtener IDs de materias como números válidos
      const materiaIds = Array.from(
        new Set(
          asistencias
            .map(a => {
              const id = Number(a.clase.materia.id);
              return isNaN(id) ? null : id;
            })
            .filter((id): id is number => id !== null)
        )
      ) as number[];

      // 2. Reducir con tipo explícito para el acumulador
      porMateria = materiaIds.reduce<ResumenPorMateria>((acc, materiaId) => {
        const asistenciasMateria = asistencias.filter(a => {
          const id = Number(a.clase.materia.id);
          return !isNaN(id) && id === materiaId;
        });
        
        const presentesMateria = asistenciasMateria.filter(
          a => a.estado === EstadoAsistencia.PRESENTE
        ).length;
        
        const justificadasMateria = asistenciasMateria.filter(
          a => a.estado === EstadoAsistencia.JUSTIFICADA
        ).length;
        
        const ausentesMateria = asistenciasMateria.filter(
          a => a.estado === EstadoAsistencia.AUSENTE
        ).length;
        
        acc[materiaId] = {
          total: asistenciasMateria.length,
          presentes: presentesMateria,
          justificadas: justificadasMateria,
          ausentes: ausentesMateria,
        };
        
        return acc;
      }, {} as ResumenPorMateria);
    }

    return {
      total,
      presentes,
      justificadas,
      ausentes,
      porMateria,
    };
  }
}