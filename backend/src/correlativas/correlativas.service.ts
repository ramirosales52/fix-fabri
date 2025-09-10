// src/correlativas/correlativas.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Materia } from '../materia/entities/materia.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

@Injectable()
export class CorrelativasService {
  constructor(
    @InjectRepository(Materia)
    private materiaRepo, // ✅ Sin tipo explícito
    
    @InjectRepository(Inscripcion)
    private inscripcionRepo, // ✅ Sin tipo explícito
  ) {}

  /**
   * Verifica si un estudiante cumple con las correlativas de cursada
   */
  async verificarCorrelativasCursada(estudianteId: number, materiaId: number): Promise<{
    cumple: boolean;
    faltantes: { id: number; nombre: string }[];
  }> {
    // Obtener la materia con sus correlativas
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: ['correlativasCursada']
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    if (!materia.correlativasCursada || materia.correlativasCursada.length === 0) {
      return { cumple: true, faltantes: [] };
    }

    const faltantes: { id: number; nombre: string }[] = [];

    for (const correlativa of materia.correlativasCursada) {
      // Verificar si el estudiante tiene la correlativa aprobada o cursada
      const inscripcion = await this.inscripcionRepo.findOne({
        where: {
          estudiante: { id: estudianteId },
          materia: { id: correlativa.id }
        },
        select: ['stc', 'notaFinal']
      });

      // La correlativa se cumple si está aprobada o cursada
      const cumpleCorrelativa = inscripcion && 
        (inscripcion.stc === 'aprobada' || inscripcion.stc === 'cursada');

      if (!cumpleCorrelativa) {
        faltantes.push({ id: correlativa.id, nombre: correlativa.nombre });
      }
    }

    return {
      cumple: faltantes.length === 0,
      faltantes
    };
  }

  /**
   * Verifica si un estudiante cumple con las correlativas finales
   */
  async verificarCorrelativasFinales(estudianteId: number, materiaId: number): Promise<{
    cumple: boolean;
    faltantes: { id: number; nombre: string }[];
  }> {
    // Obtener la materia con sus correlativas finales
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: ['correlativasFinal']
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    if (!materia.correlativasFinal || materia.correlativasFinal.length === 0) {
      return { cumple: true, faltantes: [] };
    }

    const faltantes: { id: number; nombre: string }[] = [];

    for (const correlativa of materia.correlativasFinal) {
      // Verificar si el estudiante tiene la correlativa aprobada o cursada
      const inscripcion = await this.inscripcionRepo.findOne({
        where: {
          estudiante: { id: estudianteId },
          materia: { id: correlativa.id }
        },
        select: ['stc', 'notaFinal']
      });

      // La correlativa se cumple si está aprobada o cursada
      const cumpleCorrelativa = inscripcion && 
        (inscripcion.stc === 'aprobada' || inscripcion.stc === 'cursada');

      if (!cumpleCorrelativa) {
        faltantes.push({ id: correlativa.id, nombre: correlativa.nombre });
      }
    }

    return {
      cumple: faltantes.length === 0,
      faltantes
    };
  }

  /**
   * Verifica todas las correlativas antes de inscribir a una materia
   */
  async verificarTodasCorrelativas(estudianteId: number, materiaId: number): Promise<{
    cursada: { cumple: boolean; faltantes: { id: number; nombre: string }[] };
    final: { cumple: boolean; faltantes: { id: number; nombre: string }[] };
  }> {
    const cursada = await this.verificarCorrelativasCursada(estudianteId, materiaId);
    const final = await this.verificarCorrelativasFinales(estudianteId, materiaId);
    
    return {
      cursada,
      final
    };
  }

  /**
   * Verificación más completa para inscripción a examen final
   */
  async verificarInscripcionExamenFinal(estudianteId: number, inscripcionId: number): Promise<{
    cumple: boolean;
    mensaje: string;
    faltantes?: { id: number; nombre: string }[];
  }> {
    // Obtener la inscripción
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId },
      relations: ['materia', 'estudiante']
    });

    if (!inscripcion) {
      return {
        cumple: false,
        mensaje: 'Inscripción no encontrada'
      };
    }

    // Verificar que el estudiante sea el mismo
    if (inscripcion.estudiante.id !== estudianteId) {
      return {
        cumple: false,
        mensaje: 'No puedes inscribirte a un examen de otro estudiante'
      };
    }

    // Verificar estado de la cursada
    if (inscripcion.stc !== 'cursada' && inscripcion.stc !== 'aprobada') {
      return {
        cumple: false,
        mensaje: 'No puedes inscribirte a examen final si no has cursado la materia'
      };
    }

    // Verificar correlativas finales
    const resultado = await this.verificarCorrelativasFinales(estudianteId, inscripcion.materia.id);
    
    if (!resultado.cumple) {
      const materiasFaltantes = resultado.faltantes.map(m => m.nombre).join(', ');
      return {
        cumple: false,
        mensaje: `No puedes inscribirte al examen final. Faltan correlativas: ${materiasFaltantes}`,
        faltantes: resultado.faltantes
      };
    }

    return {
      cumple: true,
      mensaje: 'Correlativas verificadas correctamente'
    };
  }
}