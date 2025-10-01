// src/plan-estudio/plan-estudio.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PlanEstudioService } from './plan-estudio.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';

describe('PlanEstudioService', () => {
  let service: PlanEstudioService;
  let mockPlanRepo: any;
  let mockCarreraRepo: any;

  beforeEach(async () => {
    // Crear mocks de repositorios
    mockPlanRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    mockCarreraRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanEstudioService,
        {
          provide: getRepositoryToken(PlanEstudio),
          useValue: mockPlanRepo,
        },
        {
          provide: getRepositoryToken(Carrera),
          useValue: mockCarreraRepo,
        },
      ],
    }).compile();

    service = module.get<PlanEstudioService>(PlanEstudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a plan estudio successfully', async () => {
      // Arrange
      const createDto = {
        nombre: 'Plan de Ingeniería',
        descripcion: 'Plan de estudios para ingeniería',
        carreraId: 1
      };
      
      const mockCarrera = { id: 1, nombre: 'Ingeniería' } as Carrera;
      const mockPlan = {
        id: 1,
        nombre: 'Plan de Ingeniería',
        descripcion: 'Plan de estudios para ingeniería',
        año: 2023,
        carrera: mockCarrera,
        materias: [],
        estudiantes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as PlanEstudio;
      
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(mockCarrera);
      jest.spyOn(mockPlanRepo, 'create').mockReturnValue(mockPlan);
      jest.spyOn(mockPlanRepo, 'save').mockResolvedValue(mockPlan);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(mockPlan);
      expect(mockCarreraRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPlanRepo.save).toHaveBeenCalledWith(mockPlan);
    });

    it('should throw error when carrera is not found', async () => {
      // Arrange
      const createDto = {
        nombre: 'Plan de Ingeniería',
        descripcion: 'Plan de estudios para ingeniería',
        carreraId: 1
      };
      
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createDto))
        .rejects.toThrow('Carrera no encontrada');
      expect(mockCarreraRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all plans', async () => {
      // Arrange
      const mockPlans = [{
        id: 1,
        nombre: 'Plan de Ingeniería',
        descripcion: 'Plan de estudios para ingeniería',
        año: 2023,
        carrera: { id: 1, nombre: 'Ingeniería' } as Carrera,
        materias: [],
        estudiantes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }] as PlanEstudio[];
      
      jest.spyOn(mockPlanRepo, 'find').mockResolvedValue(mockPlans);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockPlans);
      expect(mockPlanRepo.find).toHaveBeenCalledWith({
        relations: ['carrera', 'materias']
      });
    });
  });

  describe('findOne', () => {
    it('should return a plan when found', async () => {
      // Arrange
      const mockPlan = {
        id: 1,
        nombre: 'Plan de Ingeniería',
        descripcion: 'Plan de estudios para ingeniería',
        año: 2023,
        carrera: { id: 1, nombre: 'Ingeniería' } as Carrera,
        materias: [],
        estudiantes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as PlanEstudio;
      
      jest.spyOn(mockPlanRepo, 'findOne').mockResolvedValue(mockPlan);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(mockPlan);
      expect(mockPlanRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['carrera', 'materias']
      });
    });

    it('should throw error when plan is not found', async () => {
      // Arrange
      jest.spyOn(mockPlanRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(1))
        .rejects.toThrow('Plan de estudio no encontrado');
      expect(mockPlanRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['carrera', 'materias']
      });
    });
  });

  describe('update', () => {
    it('should update a plan successfully', async () => {
      // Arrange
      const updateDto = {
        nombre: 'Plan Actualizado',
        descripcion: 'Descripción actualizada'
      };
      
      const mockPlan = {
        id: 1,
        nombre: 'Plan Original',
        descripcion: 'Descripción original',
        año: 2023,
        carrera: { id: 1, nombre: 'Ingeniería' } as Carrera,
        materias: [],
        estudiantes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as PlanEstudio;
      
      const mockCarrera = { id: 1, nombre: 'Ingeniería' } as Carrera;
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPlan);
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(mockCarrera);
      jest.spyOn(mockPlanRepo, 'save').mockResolvedValue({ ...mockPlan, ...updateDto });

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result.nombre).toBe('Plan Actualizado');
      expect(result.descripcion).toBe('Descripción actualizada');
      expect(mockPlanRepo.save).toHaveBeenCalledWith({ ...mockPlan, ...updateDto });
    });

    it('should update carrera when carreraId is provided', async () => {
      // Arrange
      const updateDto = {
        nombre: 'Plan Actualizado',
        carreraId: 2
      };
      
      const mockPlan = {
        id: 1,
        nombre: 'Plan Original',
        descripcion: 'Descripción original',
        año: 2023,
        carrera: { id: 1, nombre: 'Ingeniería' } as Carrera,
        materias: [],
        estudiantes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as PlanEstudio;
      
      const mockCarrera = { id: 2, nombre: 'Ciencias' } as Carrera;
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPlan);
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(mockCarrera);
      jest.spyOn(mockPlanRepo, 'save').mockResolvedValue({ ...mockPlan, carrera: mockCarrera });

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result.carrera.id).toBe(2);
      expect(mockPlanRepo.save).toHaveBeenCalledWith({ ...mockPlan, carrera: mockCarrera });
    });
  });

  describe('remove', () => {
    it('should remove a plan', async () => {
      // Arrange
      jest.spyOn(mockPlanRepo, 'delete').mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockPlanRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});