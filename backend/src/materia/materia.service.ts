// src/materia/materia.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, getRepository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { User } from '../user/entities/user.entity';
import { Departamento } from '../departamento/entities/departamento.entity';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(PlanEstudio)
    private readonly planEstudioRepository: Repository<PlanEstudio>,
    @InjectRepository(Departamento)
    private readonly departamentoRepo,
  ) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    const { planesEstudioIds, ...materiaData } = createMateriaDto;
    const materia = this.materiaRepository.create(materiaData);
    
    if (planesEstudioIds && planesEstudioIds.length > 0) {
      const planes = await this.planEstudioRepository.find({
        where: { id: In(planesEstudioIds) },
      });
      materia.planesEstudio = planes;
    }
    
    return this.materiaRepository.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepository.find({
      relations: ['planesEstudio', 'departamento']
    });
  }

  async findOne(id: number): Promise<Materia> {
    const materia = await this.materiaRepository.findOne({ 
      where: { id },
      relations: ['planesEstudio', 'departamento']
    });
    if (!materia) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }
    return materia;
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
    const { planesEstudioIds, ...materiaData } = updateMateriaDto;
    
    const materia = await this.materiaRepository.preload({
      id,
      ...materiaData,
    });

    if (!materia) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }

    // Actualizar planes de estudio si se proporcionan
    if (planesEstudioIds) {
      const planes = await this.planEstudioRepository.find({
        where: { id: In(planesEstudioIds) },
      });
      materia.planesEstudio = planes;
    }

    return this.materiaRepository.save(materia);
  }

  async remove(id: number): Promise<Materia> {
    const materia = await this.materiaRepository.findOne({ where: { id } });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }
    await this.materiaRepository.delete(id);
    return materia;
  }

  async findMateriasDisponibles(estudianteId: number): Promise<Materia[]> {
    // Obtener el estudiante con su plan de estudio y carrera
    const userRepository = getRepository(User);
    const estudiante = await userRepository.findOne({
      where: { id: estudianteId },
      relations: ['planEstudio', 'planEstudio.carrera', 'planEstudio.carrera.departamentos'],
    });

    if (!estudiante || !estudiante.planEstudio || !estudiante.planEstudio.carrera) {
      throw new NotFoundException('Estudiante o carrera no encontrados');
    }

    // Obtener el departamento de básicas
    const departamentoBasicas = await this.departamentoRepo.findOne({
      where: { nombre: 'Básicas' }
    });

    if (!departamentoBasicas) {
      throw new NotFoundException('Departamento de Básicas no encontrado');
    }

    // Obtener los IDs de los departamentos permitidos
    const departamentosCarrera = estudiante.planEstudio.carrera.departamentos || [];
    const departamentosPermitidos = [
      ...departamentosCarrera.map(d => d.id),
      departamentoBasicas.id
    ];

    // Obtener las materias de los departamentos permitidos
    return this.materiaRepository.find({
      where: {
        departamento: {
          id: In(departamentosPermitidos)
        }
      },
      relations: ['planesEstudio', 'departamento', 'profesores'],
      order: { nombre: 'ASC' }
    });
  }
}