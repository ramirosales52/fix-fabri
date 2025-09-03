// src/plan-estudio/plan-estudio.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { CreatePlanEstudioDto } from './dto/create-plan-estudio.dto';
import { UpdatePlanEstudioDto } from './dto/update-plan-estudio.dto';
import { Carrera } from '../carrera/entities/carrera.entity';

@Injectable()
export class PlanEstudioService {
  constructor(
    @InjectRepository(PlanEstudio)
    private planRepo,
    @InjectRepository(Carrera)
    private carreraRepo,
  ) {}

  async create(dto: CreatePlanEstudioDto): Promise<PlanEstudio> {
    const carrera = await this.carreraRepo.findOne({ where: { id: dto.carreraId } });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');

    const plan = this.planRepo.create({ ...dto, carrera });
    return this.planRepo.save(plan);
  }

  async findAll(): Promise<PlanEstudio[]> {
    return this.planRepo.find({ relations: ['carrera', 'materias'] });
  }

  async findOne(id: number): Promise<PlanEstudio> {
    const plan = await this.planRepo.findOne({
      where: { id },
      relations: ['carrera', 'materias'],
    });
    if (!plan) throw new NotFoundException('Plan de estudio no encontrado');
    return plan;
  }

  async update(id: number, dto: UpdatePlanEstudioDto): Promise<PlanEstudio> {
    const plan = await this.findOne(id);

    if (dto.carreraId !== undefined) {
      const carrera = await this.carreraRepo.findOne({ where: { id: dto.carreraId } });
      if (!carrera) throw new NotFoundException('Carrera no encontrada');
      plan.carrera = carrera;
    }

    Object.assign(plan, dto);
    return this.planRepo.save(plan);
  }

  async remove(id: number): Promise<void> {
    await this.planRepo.delete(id);
  }
}