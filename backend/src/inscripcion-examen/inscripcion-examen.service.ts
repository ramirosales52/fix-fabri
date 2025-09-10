// src/inscripcion-examen/inscripcion-examen.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InscripcionExamen } from './entities/inscripcion-examen.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { CorrelativasService } from '../correlativas/correlativas.service'; // ✅ Importar el nuevo servicio
import { CreateInscripcionExamenDto } from './dto/create-inscripcion-examen.dto';
import { UpdateInscripcionExamenDto } from './dto/update-inscripcion-examen.dto';

@Injectable()
export class InscripcionExamenService {
  constructor(
    @InjectRepository(InscripcionExamen)
    private inscripcionExamenRepo, // ✅ Sin tipo explícito
    
    @InjectRepository(Inscripcion)
    private inscripcionRepo, // ✅ Sin tipo explícito
    
    @InjectRepository(ExamenFinal)
    private examenRepo, // ✅ Sin tipo explícito
    
    private correlativasService: CorrelativasService, // ✅ Inyectar el nuevo servicio
  ) {}

  async inscribirse(dto: CreateInscripcionExamenDto): Promise<InscripcionExamen> {
    // Verificar que la inscripción exista
    const inscripcion = await this.inscripcionRepo.findOne({ 
      where: { id: dto.inscripcionId },
      relations: ['materia', 'estudiante']
    });
    
    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    // Verificar que el examen exista
    const examen = await this.examenRepo.findOne({ 
      where: { id: dto.examenId },
      relations: ['materia', 'estudiante']
    });
    
    if (!examen) {
      throw new NotFoundException('Examen final no encontrado');
    }

    // Verificar que el estudiante sea el mismo
    if (examen.estudiante.id !== inscripcion.estudiante.id) {
      throw new BadRequestException('No puedes inscribirte a un examen de otro estudiante');
    }

    // ✅ Verificación mejorada con el nuevo servicio
    const verificacion = await this.correlativasService.verificarInscripcionExamenFinal(
      inscripcion.estudiante.id, 
      dto.inscripcionId
    );

    if (!verificacion.cumple) {
      throw new BadRequestException(verificacion.mensaje);
    }

    // Verificar que la inscripción sea válida para examen final
    if (inscripcion.stc !== 'cursada' && inscripcion.stc !== 'aprobada') {
      throw new BadRequestException('No puedes inscribirte a examen final si no has cursado la materia');
    }

    // Verificar si ya está inscripto
    const yaInscripto = await this.inscripcionExamenRepo.findOne({
      where: { inscripcion: { id: dto.inscripcionId }, examen: { id: dto.examenId } }
    });

    if (yaInscripto) {
      throw new BadRequestException('Ya estás inscripto a este examen final');
    }

    // Crear inscripción
    const inscripcionExamen = this.inscripcionExamenRepo.create({
      inscripcion,
      examen,
      estado: dto.estado || 'inscripto',
      nota: dto.nota
    });

    return this.inscripcionExamenRepo.save(inscripcionExamen);
  }

  async obtenerInscripcionesPorEstudiante(estudianteId: number): Promise<InscripcionExamen[]> {
    return this.inscripcionExamenRepo.find({
      where: { 
        inscripcion: { estudiante: { id: estudianteId } } 
      },
      relations: ['examen', 'inscripcion'],
      order: { examen: { id: 'DESC' } }
    });
  }

  async obtenerInscripcionesPorMateria(materiaId: number): Promise<InscripcionExamen[]> {
    return this.inscripcionExamenRepo.find({
      where: { 
        examen: { materia: { id: materiaId } } 
      },
      relations: ['examen', 'inscripcion'],
      order: { examen: { id: 'DESC' } }
    });
  }

  async obtenerInscripcionesPorExamen(examenId: number): Promise<InscripcionExamen[]> {
    return this.inscripcionExamenRepo.find({
      where: { examen: { id: examenId } },
      relations: ['inscripcion', 'examen'],
      order: { inscripcion: { id: 'ASC' } }
    });
  }

  async actualizarEstado(inscripcionExamenId: number, dto: UpdateInscripcionExamenDto): Promise<InscripcionExamen> {
    const inscripcionExamen = await this.inscripcionExamenRepo.findOne({ 
      where: { id: inscripcionExamenId },
      relations: ['examen']
    });
    
    if (!inscripcionExamen) {
      throw new NotFoundException('Inscripción a examen no encontrada');
    }

    Object.assign(inscripcionExamen, dto);
    return this.inscripcionExamenRepo.save(inscripcionExamen);
  }

  async removerInscripcion(inscripcionExamenId: number): Promise<void> {
    const inscripcionExamen = await this.inscripcionExamenRepo.findOne({ 
      where: { id: inscripcionExamenId }
    });
    
    if (!inscripcionExamen) {
      throw new NotFoundException('Inscripción a examen no encontrada');
    }

    await this.inscripcionExamenRepo.delete(inscripcionExamenId);
  }
}