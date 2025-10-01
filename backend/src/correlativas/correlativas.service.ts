// src/correlativas/correlativas.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Materia } from '../materia/entities/materia.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { CorrelativasCursada } from './entities/correlativas-cursada.entity';
import { CorrelativasFinal } from './entities/correlativas-final.entity';

type CorrelativaTipo = 'cursada' | 'final';

@Injectable()
export class CorrelativasService {
  constructor(
    @InjectRepository(Materia)
    private materiaRepo: Repository<Materia>,
    
    @InjectRepository(Inscripcion)
    private inscripcionRepo: Repository<Inscripcion>,
    
    @InjectRepository(CorrelativasCursada)
    private correlativasCursadaRepo: Repository<CorrelativasCursada>,
    
    @InjectRepository(CorrelativasFinal)
    private correlativasFinalRepo: Repository<CorrelativasFinal>,
  ) {}

  /**
   * Agrega una correlativa de cursada a una materia
   * @param materiaId ID de la materia principal
   * @param correlativaId ID de la materia correlativa
   * @returns La correlativa creada
   */
  async agregarCorrelativaCursada(materiaId: number, correlativaId: number): Promise<CorrelativasCursada> {
    // Verificar que no exista ya la correlativa
    const existe = await this.correlativasCursadaRepo
      .createQueryBuilder('cc')
      .where('cc.materia.id = :materiaId', { materiaId })
      .andWhere('cc.correlativa.id = :correlativaId', { correlativaId })
      .getOne();

    if (existe) {
      throw new BadRequestException('La correlativa ya existe');
    }

    // Verificar que no se esté intentando una autocorrelación
    if (materiaId === correlativaId) {
      throw new BadRequestException('Una materia no puede ser correlativa de sí misma');
    }

    // Verificar que existan ambas materias
    const [materia, correlativa] = await Promise.all([
      this.materiaRepo.findOne({ where: { id: materiaId } }),
      this.materiaRepo.findOne({ where: { id: correlativaId } })
    ]);

    if (!materia || !correlativa) {
      throw new NotFoundException('Una o ambas materias no existen');
    }

    // Crear y guardar la correlativa
    const nuevaCorrelativa = this.correlativasCursadaRepo.create({
      materia: { id: materiaId },
      correlativa: { id: correlativaId }
    });

    return this.correlativasCursadaRepo.save(nuevaCorrelativa);
  }

  /**
   * Agrega una correlativa de final a una materia
   * @param materiaId ID de la materia principal
   * @param correlativaId ID de la materia correlativa
   * @returns La correlativa creada
   */
  async agregarCorrelativaFinal(materiaId: number, correlativaId: number): Promise<CorrelativasFinal> {
    // Verificar que no exista ya la correlativa
    const existe = await this.correlativasFinalRepo
      .createQueryBuilder('cf')
      .where('cf.materia.id = :materiaId', { materiaId })
      .andWhere('cf.correlativa.id = :correlativaId', { correlativaId })
      .getOne();

    if (existe) {
      throw new BadRequestException('La correlativa ya existe');
    }

    // Verificar que no se esté intentando una autocorrelación
    if (materiaId === correlativaId) {
      throw new BadRequestException('Una materia no puede ser correlativa de sí misma');
    }

    // Verificar que existan ambas materias
    const [materia, correlativa] = await Promise.all([
      this.materiaRepo.findOne({ where: { id: materiaId } }),
      this.materiaRepo.findOne({ where: { id: correlativaId } })
    ]);

    if (!materia || !correlativa) {
      throw new NotFoundException('Una o ambas materias no existen');
    }

    // Crear y guardar la correlativa
    const nuevaCorrelativa = this.correlativasFinalRepo.create({
      materia: { id: materiaId },
      correlativa: { id: correlativaId }
    });

    return this.correlativasFinalRepo.save(nuevaCorrelativa);
  }

  /**
   * Elimina una correlativa de cursada
   * @param id ID de la correlativa a eliminar
   */
  async eliminarCorrelativaCursada(id: number): Promise<void> {
    const resultado = await this.correlativasCursadaRepo.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Correlativa con ID ${id} no encontrada`);
    }
  }

  /**
   * Elimina una correlativa de final
   * @param id ID de la correlativa a eliminar
   */
  async eliminarCorrelativaFinal(id: number): Promise<void> {
    const resultado = await this.correlativasFinalRepo.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Correlativa con ID ${id} no encontrada`);
    }
  }

  /**
   * Obtiene todas las correlativas de una materia
   * @param materiaId ID de la materia
   * @param tipo Tipo de correlativa ('cursada' o 'final')
   * @returns Lista de correlativas
   */
  async obtenerCorrelativas(materiaId: number, tipo: CorrelativaTipo): Promise<Materia[]> {
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: [
        tipo === 'cursada' ? 'correlativasCursada' : 'correlativasFinal',
        `${tipo === 'cursada' ? 'correlativasCursada' : 'correlativasFinal'}.correlativa`
      ]
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    return tipo === 'cursada' 
      ? materia.correlativasCursada.map(c => c.correlativa)
      : materia.correlativasFinal.map(c => c.correlativa);
  }

  /**
   * Verifica si un estudiante cumple con las correlativas de cursada
   * @param estudianteId ID del estudiante
   * @param materiaId ID de la materia a verificar
   * @returns Objeto con el resultado de la verificación
   */
  async verificarCorrelativasCursada(
    estudianteId: number, 
    materiaId: number
  ): Promise<{ cumple: boolean; faltantes: Array<{ id: number; nombre: string }> }> {
    // Obtener la materia con sus correlativas
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: ['correlativasCursada', 'correlativasCursada.correlativa']
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    // Si no tiene correlativas, retornar verdadero
    if (!materia.correlativasCursada || materia.correlativasCursada.length === 0) {
      return { cumple: true, faltantes: [] };
    }

    // Obtener los IDs de las correlativas
    const correlativaIds = materia.correlativasCursada.map(c => c.correlativa?.id).filter(Boolean) as number[];

    // Obtener las inscripciones del estudiante a las materias correlativas
    const inscripciones = await this.inscripcionRepo.find({
      where: {
        estudiante: { id: estudianteId },
        materia: { id: In(correlativaIds) }
      },
      relations: ['materia'],
      select: ['id', 'stc', 'notaFinal', 'materia']
    });

    // Mapear las materias faltantes
    const materiasFaltantes = materia.correlativasCursada
      .filter(correlativa => {
        const inscripcion = inscripciones.find(i => i.materia.id === correlativa.correlativa?.id);
        return !inscripcion || !['aprobada', 'cursada'].includes(inscripcion.stc);
      })
      .map(correlativa => ({
        id: correlativa.correlativa?.id || 0,
        nombre: correlativa.correlativa?.nombre || 'Materia desconocida'
      }));

    return {
      cumple: materiasFaltantes.length === 0,
      faltantes: materiasFaltantes
    };
  }

  /**
   * Verifica si un estudiante cumple con las correlativas de final
   * @param estudianteId ID del estudiante
   * @param materiaId ID de la materia a verificar
   * @returns Objeto con el resultado de la verificación
   */
  async verificarCorrelativasFinales(
    estudianteId: number, 
    materiaId: number
  ): Promise<{ cumple: boolean; faltantes: Array<{ id: number; nombre: string }> }> {
    // Obtener la materia con sus correlativas
    const materia = await this.materiaRepo.findOne({
      where: { id: materiaId },
      relations: ['correlativasFinal', 'correlativasFinal.correlativa']
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    // Si no tiene correlativas, retornar verdadero
    if (!materia.correlativasFinal || materia.correlativasFinal.length === 0) {
      return { cumple: true, faltantes: [] };
    }

    // Obtener los IDs de las correlativas
    const correlativaIds = materia.correlativasFinal
      .map(c => c.correlativa?.id)
      .filter((id): id is number => id !== undefined);

    // Obtener las inscripciones del estudiante a las materias correlativas
    const inscripciones = await this.inscripcionRepo.find({
      where: {
        estudiante: { id: estudianteId },
        materia: { id: In(correlativaIds) }
      },
      relations: ['materia'],
      select: ['id', 'stc', 'notaFinal', 'materia']
    });

    // Mapear las materias faltantes
    const materiasFaltantes = materia.correlativasFinal
      .filter(correlativa => {
        const inscripcion = inscripciones.find(i => i.materia.id === correlativa.correlativa?.id);
        // Para final, la correlativa debe estar aprobada
        return !inscripcion || inscripcion.stc !== 'aprobada';
      })
      .map(correlativa => ({
        id: correlativa.correlativa?.id || 0,
        nombre: correlativa.correlativa?.nombre || 'Materia desconocida'
      }));

    return {
      cumple: materiasFaltantes.length === 0,
      faltantes: materiasFaltantes
    };
  }

  /**
   * Verifica si existe una relación de correlatividad entre dos materias
   * @param materiaId ID de la materia principal
   * @param correlativaId ID de la materia correlativa
   * @param tipo Tipo de correlativa ('cursada' o 'final')
   * @returns Verdadero si existe la correlativa, falso en caso contrario
   */
  async existeCorrelativa(
    materiaId: number, 
    correlativaId: number, 
    tipo: CorrelativaTipo
  ): Promise<boolean> {
    if (tipo === 'cursada') {
      const existe = await this.correlativasCursadaRepo
        .createQueryBuilder('cc')
        .where('cc.materia.id = :materiaId', { materiaId })
        .andWhere('cc.correlativa.id = :correlativaId', { correlativaId })
        .getOne();
      return !!existe;
    } else {
      const existe = await this.correlativasFinalRepo
        .createQueryBuilder('cf')
        .where('cf.materia.id = :materiaId', { materiaId })
        .andWhere('cf.correlativa.id = :correlativaId', { correlativaId })
        .getOne();
      return !!existe;
    }
  }

  /**
   * Verifica si un estudiante puede inscribirse a una materia
   * @param estudianteId ID del estudiante
   * @param materiaId ID de la materia
   * @returns Objeto con el resultado de la verificación de correlativas de cursada y final
   */
  async verificarInscripcionMateria(
    estudianteId: number, 
    materiaId: number
  ): Promise<{
    cursada: { cumple: boolean; faltantes: Array<{ id: number; nombre: string }> };
    final: { cumple: boolean; faltantes: Array<{ id: number; nombre: string }> };
    aprobado: boolean;
  }> {
    const cursada = await this.verificarCorrelativasCursada(estudianteId, materiaId);
    const final = await this.verificarCorrelativasFinales(estudianteId, materiaId);
    
    return {
      cursada,
      final,
      aprobado: cursada.cumple && final.cumple
    };
  }

  /**
   * Verifica la inscripción a un examen final
   * @param estudianteId ID del estudiante
   * @param inscripcionId ID de la inscripción al examen
   * @returns Resultado de la verificación
   */
  async verificarInscripcionExamenFinal(
    estudianteId: number,
    inscripcionId: number
  ): Promise<{
    cumple: boolean;
    mensaje: string;
    faltantes?: Array<{ id: number; nombre: string }>;
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

  async verificarTodasCorrelativas(estudianteId: number, materiaId: number) {
    const cursada = await this.verificarCorrelativasCursada(estudianteId, materiaId);
    const final = await this.verificarCorrelativasFinales(estudianteId, materiaId);
    
    return {
      cursada,
      final,
      aprobado: cursada.cumple && final.cumple,
    };
  }
}