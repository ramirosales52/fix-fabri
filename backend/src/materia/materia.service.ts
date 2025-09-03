<<<<<<< HEAD
import { Injectable } from '@nestjs/common';

export interface Materia {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Injectable()
export class MateriaService {
  private materias: Materia[] = [];
  private idCounter = 1;

  create(createMateriaDto: any): Materia {
    const materia: Materia = { id: this.idCounter++, ...createMateriaDto };
    this.materias.push(materia);
    return materia;
  }

  findAll(): Materia[] {
    return this.materias;
  }

  findOne(id: number): Materia | undefined {
    return this.materias.find(m => m.id === id);
  }

  update(id: number, updateMateriaDto: any): Materia | undefined {
    const materia = this.findOne(id);
    if (materia) {
      Object.assign(materia, updateMateriaDto);
    }
    return materia;
  }

  remove(id: number): Materia | null {
    const index = this.materias.findIndex(m => m.id === id);
    if (index > -1) {
      return this.materias.splice(index, 1)[0];
    }
    return null;
  }
=======
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
>>>>>>> 47a0884 (segundo commit)
}