import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ExamenFinal } from './entities/examen-final.entity';
import { CreateExamenFinalDto } from './dto/create-examen-final.dto';
import { UpdateExamenFinalDto } from './dto/update-examen-final.dto';
import { ExamenFinalResponseDto } from './dto/examen-final-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ExamenFinalService {
  constructor(
    @InjectRepository(ExamenFinal)
    private examenFinalRepository: Repository<ExamenFinal>,
  ) {}

  async create(createExamenFinalDto: CreateExamenFinalDto): Promise<ExamenFinalResponseDto> {
    // Validar que si se proporciona hora de inicio práctico, también debe estar la de fin y el aula
    if (
      (createExamenFinalDto.horaInicioPractico && !createExamenFinalDto.horaFinPractico) ||
      (createExamenFinalDto.horaFinPractico && !createExamenFinalDto.horaInicioPractico) ||
      (createExamenFinalDto.horaInicioPractico && !createExamenFinalDto.aulaPractico)
    ) {
      throw new BadRequestException('Si se proporciona el horario práctico, deben incluirse tanto la hora de inicio, fin y el aula');
    }

    // Validar que la fecha no sea en el pasado
    const fechaExamen = new Date(createExamenFinalDto.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaExamen < hoy) {
      throw new BadRequestException('La fecha del examen no puede ser en el pasado');
    }

    // Validar que no haya otro examen en la misma materia en la misma fecha
    const existeExamen = await this.examenFinalRepository.findOne({
      where: {
        materia: { id: createExamenFinalDto.materiaId },
        fecha: createExamenFinalDto.fecha,
      },
    });

    if (existeExamen) {
      throw new BadRequestException('Ya existe un examen programado para esta materia en la fecha seleccionada');
    }

    const examen = this.examenFinalRepository.create({
      materia: { id: createExamenFinalDto.materiaId },
      docente: { id: createExamenFinalDto.docenteId },
      fecha: createExamenFinalDto.fecha,
      horaInicioTeorico: createExamenFinalDto.horaInicioTeorico,
      horaFinTeorico: createExamenFinalDto.horaFinTeorico,
      aulaTeorico: createExamenFinalDto.aulaTeorico,
      horaInicioPractico: createExamenFinalDto.horaInicioPractico,
      horaFinPractico: createExamenFinalDto.horaFinPractico,
      aulaPractico: createExamenFinalDto.aulaPractico,
      cupo: createExamenFinalDto.cupo || 30,
      inscriptos: 0,
    });

    const savedExamen = await this.examenFinalRepository.save(examen);
    return this.findOne(savedExamen.id);
  }

  async findAll(): Promise<ExamenFinalResponseDto[]> {
    const hoy = new Date().toISOString().split('T')[0];
    
    const examenes = await this.examenFinalRepository.find({
      where: {
        fecha: MoreThanOrEqual(hoy),
      },
      relations: ['materia', 'docente'],
      order: {
        fecha: 'ASC',
        horaInicioTeorico: 'ASC',
      },
    });

    return examenes.map(examen => this.mapToResponseDto(examen));
  }

  async findOne(id: number): Promise<ExamenFinalResponseDto> {
    const examen = await this.examenFinalRepository.findOne({
      where: { id },
      relations: ['materia', 'docente'],
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(examen);
  }

  async update(
    id: number,
    updateExamenFinalDto: UpdateExamenFinalDto,
  ): Promise<ExamenFinalResponseDto> {
    const examen = await this.examenFinalRepository.findOneBy({ id });
    
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }

    // Validar que si se actualiza la fecha, no sea en el pasado
    if (updateExamenFinalDto.fecha) {
      const fechaExamen = new Date(updateExamenFinalDto.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaExamen < hoy) {
        throw new BadRequestException('La fecha del examen no puede ser en el pasado');
      }
    }

    // Validar que no haya otro examen en la misma materia en la misma fecha
    if (updateExamenFinalDto.fecha || updateExamenFinalDto.materiaId) {
      const materiaId = updateExamenFinalDto.materiaId || examen.materia.id;
      const fecha = updateExamenFinalDto.fecha || examen.fecha;
      
      const existeExamen = await this.examenFinalRepository
        .createQueryBuilder('examen')
        .where('examen.materiaId = :materiaId', { materiaId })
        .andWhere('examen.fecha = :fecha', { fecha })
        .andWhere('examen.id != :id', { id })
        .getOne();

      if (existeExamen) {
        throw new BadRequestException('Ya existe un examen programado para esta materia en la fecha seleccionada');
      }
    }

    await this.examenFinalRepository.update(id, {
      ...updateExamenFinalDto,
      materia: updateExamenFinalDto.materiaId ? { id: updateExamenFinalDto.materiaId } : undefined,
      docente: updateExamenFinalDto.docenteId ? { id: updateExamenFinalDto.docenteId } : undefined,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.examenFinalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
  }

  private mapToResponseDto(examen: ExamenFinal): ExamenFinalResponseDto {
    const response = plainToClass(ExamenFinalResponseDto, {
      ...examen,
      fecha: examen.fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
      disponibles: examen.cupo - examen.inscriptos,
    }, { excludeExtraneousValues: true });

    return response;
  }
}
