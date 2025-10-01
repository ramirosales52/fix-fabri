// src/inscripcion/inscripcion.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';
import { Departamento } from '../departamento/entities/departamento.entity';

// Definimos un tipo explícito para las correlativas faltantes
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
    
    @InjectRepository(Comision)
    private comisionRepo,
    
    @InjectRepository(Departamento)
    private departamentoRepo,
    
    private correlativasService: CorrelativasService,
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
        stc: 'cursando'
      },
      relations: ['materia', 'comision'],
    });
  }

  // Verificar si el estudiante cumple con las correlativas de cursada
  private async verificarCorrelativasCursada(
    estudianteId: number,
    materiaId: number,
  ): Promise<{ 
    cumple: boolean; 
    faltantes: CorrelativaFaltante[]
  }> {
    return this.correlativasService.verificarCorrelativasCursada(estudianteId, materiaId);
  }

  // Verificar si el estudiante puede inscribirse a una materia
  private async verificarInscripcionValida(
    userId: number,
    materiaId: number,
  ): Promise<boolean> {
    const estudiante = await this.userRepo.findOne({ 
      where: { id: userId },
      relations: ['planEstudio', 'planEstudio.carrera']
    });
    
    const materia = await this.materiaRepo.findOne({ 
      where: { id: materiaId },
      relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
    });

    if (!estudiante || !materia) {
      return false;
    }

    // Verificar si es materia de departamento de básicas (excepción)
    const departamentoBasica = await this.departamentoRepo.findOne({ 
      where: { nombre: 'Básicas' } 
    });
    
    if (materia.departamento.id === departamentoBasica?.id) {
      // Las materias de básicas son accesibles para todos
      return true;
    }

    // Verificar que el estudiante esté en el mismo departamento
    const estudianteCarreraId = estudiante.planEstudio?.carrera?.id;
    const materiaCarrerasIds = materia.planesEstudio?.map(plan => plan.carrera?.id) || [];
    
    if (estudianteCarreraId && !materiaCarrerasIds.includes(estudianteCarreraId)) {
      // Si no es la misma carrera, no puede inscribirse
      return false;
    }

    // Si llegamos aquí, la inscripción es válida
    return true;
  }

  // Inscribir estudiante a materia (permite múltiples inscripciones)
  async inscribirse(userId: number, materiaId: number, comisionId?: number): Promise<Inscripcion> {
    const estudiante = await this.userRepo.findOne({ 
      where: { id: userId },
      relations: ['planEstudio', 'planEstudio.carrera']
    });
    
    const materia = await this.materiaRepo.findOne({ 
      where: { id: materiaId },
      relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
    });

    if (!estudiante || !materia) {
      throw new BadRequestException('Estudiante o materia no encontrados');
    }

    // Verificar que la inscripción sea válida
    const inscripcionValida = await this.verificarInscripcionValida(userId, materiaId);
    if (!inscripcionValida) {
      throw new BadRequestException('No puedes inscribirte a esta materia. No pertenece a tu departamento.');
    }

    // Verificar correlativas de cursada
    const { cumple, faltantes } = await this.verificarCorrelativasCursada(userId, materiaId);
    if (!cumple) {
      const materiasFaltantes = faltantes.map(m => m.nombre).join(', ');
      throw new BadRequestException(
        `No puedes cursar esta materia. Faltan correlativas de cursada: ${materiasFaltantes}`
      );
    }

    // Permitir múltiples inscripciones (una por período/cursada)
    const inscripcion = this.inscripcionRepo.create({
      estudiante,
      materia,
      comision: comisionId ? { id: comisionId } as Comision : undefined,
      stc: 'cursando',
    });

    return this.inscripcionRepo.save(inscripcion);
  }

  // Cargar faltas (solo profesor)
  async cargarFaltas(inscripcionId: number, faltas: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId },
      relations: ['materia', 'estudiante', 'comision'],
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
      relations: ['materia', 'estudiante', 'comision'],
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
      relations: ['materia', 'estudiante', 'comision'],
    });

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada o no te pertenece');
    }

    return inscripcion;
  }

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
}