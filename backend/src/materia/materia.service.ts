// src/materia/materia.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private materiaRepo, // ✅ Sin tipo explícito
  ) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    const materia = this.materiaRepo.create(createMateriaDto);
    return this.materiaRepo.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepo.find({
      relations: ['planEstudio', 'profesores', 'jefeCatedra', 'correlativasCursada', 'correlativasFinal', 'inscripciones', 'evaluaciones', 'horarios', 'clases', 'examenes', 'comisiones'],
    });
  }

  async findOne(id: number): Promise<Materia> {
    const materia = await this.materiaRepo.findOne({
      where: { id },
      relations: ['planEstudio', 'profesores', 'jefeCatedra', 'correlativasCursada', 'correlativasFinal', 'inscripciones', 'evaluaciones', 'horarios', 'clases', 'examenes', 'comisiones'],
    });
    
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }
    
    return materia;
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
    const materia = await this.materiaRepo.findOne({ where: { id } });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    Object.assign(materia, updateMateriaDto);
    return this.materiaRepo.save(materia);
  }

  async remove(id: number): Promise<Materia> {
    const materia = await this.materiaRepo.findOne({ where: { id } });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }
    await this.materiaRepo.delete(id);
    return materia;
  }
}