// src/inscripcion/inscripcion.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
<<<<<<< HEAD
=======
import { Comision } from '../comision/entities/comision.entity';
>>>>>>> 47a0884 (segundo commit)

// ✅ Definimos un tipo explícito para las correlativas faltantes
interface CorrelativaFaltante {
  id: number;
  nombre: string;
}

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepo,
    @InjectRepository(User)
    private userRepo,
    @InjectRepository(Materia)
    private materiaRepo,
<<<<<<< HEAD
  ) {}

  // Historial académico del estudiante
  async historialAcademico(userId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      where: { estudiante: { id: userId } },
      relations: ['materia'],
      order: { materia: { nombre: 'ASC' } },
    });
  }

  // Ver materias cursando de un estudiante
  async materiasDelEstudiante(userId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      where: { estudiante: { id: userId } },
      relations: ['materia'],
=======
    @InjectRepository(Comision)
    private comisionRepo,
  ) {}

  // Historial académico del estudiante (incluye múltiples cursadas)
  async historialAcademico(userId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      where: { estudiante: { id: userId } },
      relations: ['materia', 'comision'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  // Ver materias cursando de un estudiante (última cursada activa)
  async materiasDelEstudiante(userId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      where: { 
        estudiante: { id: userId },
        stc: 'cursando' // Solo las que están cursando actualmente
      },
      relations: ['materia', 'comision'],
>>>>>>> 47a0884 (segundo commit)
    });
  }

  // Verificar si el estudiante cumple con las correlativas de cursada
  private async verificarCorrelativasCursada(
    estudianteId: number,
    materiaId: number,
  ): Promise<{ 
    cumple: boolean; 
    faltantes: CorrelativaFaltante[] // ✅ Cambiado a no opcional
  }> {
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: ['correlativasCursada'],
    });

    if (!materia || materia.correlativasCursada.length === 0) {
      // ✅ Siempre retornamos un array de faltantes (vacío si no hay)
      return { cumple: true, faltantes: [] };
    }

    // ✅ Definimos explícitamente el tipo del array
    const faltantes: CorrelativaFaltante[] = [];
    
    for (const correlativa of materia.correlativasCursada) {
      const inscripcion = await this.inscripcionRepo.findOne({
        where: {
          estudiante: { id: estudianteId },
          materia: { id: correlativa.id },
        },
      });

      // Para cursar, la correlativa debe estar aprobada o al menos cursada
      const estadoValido = inscripcion && 
        (inscripcion.stc === 'aprobada' || inscripcion.stc === 'cursada');
      
      if (!estadoValido) {
        // ✅ TypeScript ahora sabe que faltantes es CorrelativaFaltante[]
        faltantes.push({ id: correlativa.id, nombre: correlativa.nombre });
      }
    }

    return {
      cumple: faltantes.length === 0,
      faltantes, // ✅ Siempre es un array
    };
  }

<<<<<<< HEAD
  // Inscribir estudiante a materia
  async inscribirse(userId: number, materiaId: number): Promise<Inscripcion> {
=======
  // Inscribir estudiante a materia (permite múltiples inscripciones)
  async inscribirse(userId: number, materiaId: number, comisionId?: number): Promise<Inscripcion> {
>>>>>>> 47a0884 (segundo commit)
    const estudiante = await this.userRepo.findOne({ where: { id: userId } });
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });

    if (!estudiante || !materia) {
      throw new BadRequestException('Estudiante o materia no encontrados');
    }

    // Verificar correlativas de cursada
    const { cumple, faltantes } = await this.verificarCorrelativasCursada(userId, materiaId);
    if (!cumple) {
      // ✅ Ahora TypeScript sabe que faltantes siempre está definido
      const materiasFaltantes = faltantes.map(m => m.nombre).join(', ');
      throw new BadRequestException(
        `No puedes cursar esta materia. Faltan correlativas de cursada: ${materiasFaltantes}`
      );
    }

<<<<<<< HEAD
    const yaInscripto = await this.inscripcionRepo.findOne({
      where: { estudiante: { id: userId }, materia: { id: materiaId } },
    });

    if (yaInscripto) {
      throw new BadRequestException('Ya estás inscripto en esta materia');
    }

    const inscripcion = this.inscripcionRepo.create({
      estudiante,
      materia,
=======
    // ✅ Permitir múltiples inscripciones (una por período/cursada)
    // No hay restricción de inscripción única
    
    const inscripcion = this.inscripcionRepo.create({
      estudiante,
      materia,
      comision: comisionId ? { id: comisionId } as Comision : undefined,
>>>>>>> 47a0884 (segundo commit)
      stc: 'cursando',
    });

    return this.inscripcionRepo.save(inscripcion);
  }

  // Cargar faltas (solo profesor)
  async cargarFaltas(inscripcionId: number, faltas: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId },
<<<<<<< HEAD
      relations: ['materia', 'estudiante'],
=======
      relations: ['materia', 'estudiante', 'comision'],
>>>>>>> 47a0884 (segundo commit)
    });

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada');
    }

    inscripcion.faltas = faltas;
    return this.inscripcionRepo.save(inscripcion);
  }

  // Cargar nota final y STC
  async cargarNota(inscripcionId: number, notaFinal: number, stc: string): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId },
<<<<<<< HEAD
      relations: ['materia', 'estudiante'],
=======
      relations: ['materia', 'estudiante', 'comision'],
>>>>>>> 47a0884 (segundo commit)
    });

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada');
    }

    inscripcion.notaFinal = notaFinal;
    inscripcion.stc = stc;
    return this.inscripcionRepo.save(inscripcion);
  }

  // Ver detalles de una inscripción
  async detalleMateria(inscripcionId: number, userId: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId, estudiante: { id: userId } },
<<<<<<< HEAD
      relations: ['materia', 'estudiante'],
=======
      relations: ['materia', 'estudiante', 'comision'],
>>>>>>> 47a0884 (segundo commit)
    });

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada o no te pertenece');
    }

    return inscripcion;
  }
<<<<<<< HEAD
=======

  // Obtener todas las cursadas de un estudiante en una materia (incluye repetidos)
  async obtenerCursadasMateria(userId: number, materiaId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      where: { 
        estudiante: { id: userId },
        materia: { id: materiaId }
      },
      relations: ['comision'],
      order: { fechaInscripcion: 'DESC' }
    });
  }
>>>>>>> 47a0884 (segundo commit)
}