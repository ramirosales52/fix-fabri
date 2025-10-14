import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';
import { Departamento } from '../departamento/entities/departamento.entity';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';

interface CorrelativaFaltante {
  id: number;
  nombre: string;
}

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepo: any,
    
    @InjectRepository(User)
    private userRepo: any,
    
    @InjectRepository(Materia)
    private materiaRepo: any,
    
    @InjectRepository(Comision)
    private comisionRepo: any,
    
    @InjectRepository(Departamento)
    private departamentoRepo: any,
    
    private correlativasService: CorrelativasService,
  ) {}

  async historialAcademico(userId: number): Promise<InscripcionResponseDto[]> {
    const inscripciones = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .leftJoinAndSelect('inscripcion.comision', 'comision')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .where('estudiante.id = :userId', { userId })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .orderBy('inscripcion.fechaInscripcion', 'DESC')
      .getMany();
    return inscripciones.map(i => this.mapToResponseDto(i));
  }

  async materiasDelEstudiante(userId: number): Promise<InscripcionResponseDto[]> {
    const inscripciones = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .leftJoinAndSelect('inscripcion.comision', 'comision')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .where('estudiante.id = :userId', { userId })
      .andWhere('inscripcion.stc = :stc', { stc: 'cursando' })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .getMany();
    return inscripciones.map(i => this.mapToResponseDto(i));
  }

  async findInscripcionCompleta(id: number): Promise<Inscripcion | undefined> {
    return this.inscripcionRepo.findOne({
      where: { id },
      relations: [
        'evaluaciones',
        'materia',
        'estudiante',
        'comision',
      ],
    });
  }

  private async verificarCorrelativasCursada(
    estudianteId: number,
    materiaId: number,
  ): Promise<{ 
    cumple: boolean; 
    faltantes: CorrelativaFaltante[]
  }> {
    return this.correlativasService.verificarCorrelativasCursada(estudianteId, materiaId);
  }

  private async verificarInscripcionValida(
    userId: number,
    materiaId: number,
  ): Promise<boolean> {
    const estudiante = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.planEstudio', 'planEstudio')
      .leftJoinAndSelect('planEstudio.carrera', 'carrera')
      .where('user.id = :id', { id: userId })
      .select([
        'user.id',
        'planEstudio.id',
        'carrera.id',
      ])
      .getOne();
    
    const materia = await this.materiaRepo
      .createQueryBuilder('materia')
      .leftJoinAndSelect('materia.planesEstudio', 'plan')
      .leftJoinAndSelect('plan.carrera', 'carrera')
      .leftJoinAndSelect('materia.departamento', 'departamento')
      .where('materia.id = :id', { id: materiaId })
      .select([
        'materia.id',
        'departamento.id',
        'departamento.nombre',
        'carrera.id',
      ])
      .getOne();

    if (!estudiante || !materia) {
      return false;
    }

    const departamentoBasica = await this.departamentoRepo.findOne({ 
      where: { nombre: 'Básicas' } 
    });
    
    if (materia.departamento.id === departamentoBasica?.id) {
      return true;
    }

    const estudianteCarreraId = estudiante.planEstudio?.carrera?.id;
    const materiaCarrerasIds = materia.planesEstudio?.map(plan => plan.carrera?.id) || [];
    
    if (estudianteCarreraId && !materiaCarrerasIds.includes(estudianteCarreraId)) {
      return false;
    }

    return true;
  }

  async inscribirse(userId: number, materiaId: number, comisionId?: number): Promise<InscripcionResponseDto> {
    const estudiante = await this.userRepo.findOne({ where: { id: userId } });
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });

    if (!estudiante || !materia) {
      throw new BadRequestException('Estudiante o materia no encontrados');
    }

    const inscripcionValida = await this.verificarInscripcionValida(userId, materiaId);
    if (!inscripcionValida) {
      throw new BadRequestException('No puedes inscribirte a esta materia. No pertenece a tu departamento.');
    }

    const { cumple, faltantes } = await this.verificarCorrelativasCursada(userId, materiaId);
    if (!cumple) {
      const materiasFaltantes = faltantes.map(m => m.nombre).join(', ');
      throw new BadRequestException(
        `No puedes cursar esta materia. Faltan correlativas de cursada: ${materiasFaltantes}`
      );
    }

    const inscripcion = this.inscripcionRepo.create({
      estudiante,
      materia,
      comision: comisionId ? { id: comisionId } as Comision : undefined,
      stc: 'cursando',
    });

    const savedInscripcion = await this.inscripcionRepo.save(inscripcion);
    return this.mapToResponseDto(savedInscripcion);
  }

  async cargarFaltas(inscripcionId: number, faltas: number, profesorId: number): Promise<InscripcionResponseDto> {
    const inscripcion = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .leftJoinAndSelect('materia.profesores', 'profesor')
      .where('inscripcion.id = :id', { id: inscripcionId })
      .andWhere('profesor.id = :profesorId', { profesorId })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .getOne();

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada o no eres docente de esta materia');
    }

    inscripcion.faltas = faltas;
    const updated = await this.inscripcionRepo.save(inscripcion);
    return this.mapToResponseDto(updated);
  }

  async cargarNota(inscripcionId: number, notaFinal: number, stc: string, profesorId: number): Promise<InscripcionResponseDto> {
    const inscripcion = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .leftJoinAndSelect('materia.profesores', 'profesor')
      .where('inscripcion.id = :id', { id: inscripcionId })
      .andWhere('profesor.id = :profesorId', { profesorId })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .getOne();

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada o no eres docente de esta materia');
    }

    inscripcion.notaFinal = notaFinal;
    inscripcion.stc = stc;
    const updated = await this.inscripcionRepo.save(inscripcion);
    return this.mapToResponseDto(updated);
  }

  async detalleMateria(inscripcionId: number, userId: number): Promise<InscripcionResponseDto> {
    const inscripcion = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .leftJoinAndSelect('inscripcion.comision', 'comision')
      .where('inscripcion.id = :id', { id: inscripcionId })
      .andWhere('estudiante.id = :userId', { userId })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .getOne();

    if (!inscripcion) {
      throw new BadRequestException('Inscripción no encontrada o no te pertenece');
    }

    return this.mapToResponseDto(inscripcion);
  }

  async obtenerCursadasMateria(userId: number, materiaId: number): Promise<InscripcionResponseDto[]> {
    const inscripciones = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.comision', 'comision')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .leftJoinAndSelect('inscripcion.materia', 'materia')
      .where('estudiante.id = :userId', { userId })
      .andWhere('materia.id = :materiaId', { materiaId })
      .select([
        'inscripcion.id',
        'inscripcion.faltas',
        'inscripcion.notaFinal',
        'inscripcion.stc',
        'inscripcion.fechaInscripcion',
        'inscripcion.fechaFinalizacion',
        'materia.id',
        'materia.nombre',
        'comision.id',
        'comision.nombre',
        'estudiante.id',
        'estudiante.nombre',
        'estudiante.apellido',
        'estudiante.legajo',
      ])
      .orderBy('inscripcion.fechaInscripcion', 'DESC')
      .getMany();
    return inscripciones.map(i => this.mapToResponseDto(i));
  }

  private mapToResponseDto(inscripcion: Inscripcion): InscripcionResponseDto {
    return {
      id: inscripcion.id,
      estudiante: {
        id: inscripcion.estudiante.id,
        nombre: inscripcion.estudiante.nombre,
        apellido: inscripcion.estudiante.apellido,
        legajo: inscripcion.estudiante.legajo,
      },
      materia: {
        id: inscripcion.materia.id,
        nombre: inscripcion.materia.nombre,
      },
      comision: inscripcion.comision ? {
        id: inscripcion.comision.id,
        nombre: inscripcion.comision.nombre,
      } : undefined,
      faltas: inscripcion.faltas,
      notaFinal: inscripcion.notaFinal,
      stc: inscripcion.stc,
      fechaInscripcion: inscripcion.fechaInscripcion,
      fechaFinalizacion: inscripcion.fechaFinalizacion,
    };
  }


  async materiasDisponibles(estudianteId: number) {
    try {
      console.log('🔍 materiasDisponibles llamado con estudianteId:', estudianteId);

      // Obtener el plan de estudios del estudiante
      const estudiante = await this.userRepo.findOne({
        where: { id: estudianteId },
        select: ['id', 'planEstudio']
      });

      console.log('Estudiante encontrado:', estudiante);

      if (!estudiante?.planEstudio) {
        console.log('❌ Estudiante no tiene planEstudioId');
        throw new Error('Estudiante no tiene plan de estudios asignado');
      }

      console.log('Plan de estudios del estudiante:', estudiante.planEstudio);

      // Consulta más simple usando query directo
      const materiasDelPlan = await this.materiaRepo.query(
        'SELECT m.id, m.nombre, m.descripcion FROM "materia" m INNER JOIN "materia_planes_estudio" mpe ON m.id = mpe."materiaId" WHERE mpe."planEstudioId" = $1',
        [estudiante.planEstudio.id]
      );

      console.log('Materias del plan encontradas:', materiasDelPlan.length);

      // Obtener materias que el estudiante ya está cursando
      const materiasCursando = await this.inscripcionRepo.query(
        'SELECT i."materiaId" FROM "inscripcion" i WHERE i."estudianteId" = $1 AND i.stc = $2',
        [estudianteId, 'cursando']
      );

      console.log('Materias cursando encontradas:', materiasCursando.length);

      const materiasCursandoIds = materiasCursando.map((i: any) => i.materiaId);

      // Filtrar materias disponibles (no está cursando actualmente)
      const materiasDisponibles = materiasDelPlan.filter((materia: any) =>
        !materiasCursandoIds.includes(materia.id)
      );

      console.log('Materias disponibles después del filtro:', materiasDisponibles.length);

      return materiasDisponibles.map((materia: any) => ({
        id: materia.id,
        nombre: materia.nombre,
        descripcion: materia.descripcion,
        departamento: null, // Simplificado por ahora
        correlativasCursada: [], // Simplificado por ahora
        correlativasFinal: [], // Simplificado por ahora
        comisiones: [] // Simplificado por ahora
      }));
    } catch (error) {
      console.error('❌ Error en materiasDisponibles:', error);
      throw error;
    }
  }
}
