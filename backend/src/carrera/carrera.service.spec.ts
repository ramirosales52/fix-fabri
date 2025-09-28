// src/carrera/carrera.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CarreraService } from './carrera.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Carrera } from './entities/carrera.entity';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { Materia } from '../materia/entities/materia.entity';

describe('CarreraService', () => {
  let service: CarreraService;
  let mockCarreraRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Carrera, PlanEstudio, Materia]),
      ],
      providers: [
        CarreraService,
      ],
    }).compile();

    service = module.get<CarreraService>(CarreraService);
    mockCarreraRepo = module.get(getRepositoryToken(Carrera));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('create', () => {
    it('should create a carrera successfully', async () => {
      // Arrange
      const createDto = {
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Carrera de ingeniería en sistemas'
      };

      const savedCarrera = {
        id: 1,
        ...createDto
      };

      // Mock del repositorio
      jest.spyOn(mockCarreraRepo, 'create').mockImplementation((dto) => dto);
      jest.spyOn(mockCarreraRepo, 'save').mockResolvedValue(savedCarrera as any);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedCarrera);
      expect(mockCarreraRepo.create).toHaveBeenCalledWith(createDto);
      expect(mockCarreraRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all carreras', async () => {
      // Arrange
      const carreras = [
        {
          id: 1,
          nombre: 'Ingeniería en Sistemas',
          descripcion: 'Carrera de ingeniería en sistemas'
        },
        {
          id: 2,
          nombre: 'Licenciatura en Computación',
          descripcion: 'Licenciatura en computación'
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockCarreraRepo, 'find').mockResolvedValue(carreras as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(carreras);
      expect(mockCarreraRepo.find).toHaveBeenCalledWith({ relations: ['materias'] });
    });
  });

  describe('findOne', () => {
    it('should return a carrera by id', async () => {
      // Arrange
      const carrera = {
        id: 1,
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Carrera de ingeniería en sistemas'
      };

      // Mock del repositorio
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(carrera as any);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(carrera);
      expect(mockCarreraRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materias']
      });
    });

    it('should throw NotFoundException when carrera not found', async () => {
      // Arrange
      jest.spyOn(mockCarreraRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow('Carrera con id 999 no encontrada');
      expect(mockCarreraRepo.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['materias']
      });
    });
  });

  describe('update', () => {
    it('should update a carrera successfully', async () => {
      // Arrange
      const updateDto = {
        nombre: 'Ingeniería Actualizada',
        descripcion: 'Carrera actualizada'
      };

      const existingCarrera = {
        id: 1,
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Carrera de ingeniería en sistemas'
      };

      const updatedCarrera = {
        ...existingCarrera,
        ...updateDto
      };

      // Mock de los métodos
      jest.spyOn(service, 'findOne').mockResolvedValue(existingCarrera as any);
      jest.spyOn(mockCarreraRepo, 'save').mockResolvedValue(updatedCarrera as any);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result).toEqual(updatedCarrera);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockCarreraRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a carrera successfully', async () => {
      // Arrange
      const carrera = {
        id: 1,
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Carrera de ingeniería en sistemas'
      };

      // Mock de los métodos
      jest.spyOn(service, 'findOne').mockResolvedValue(carrera as any);
      jest.spyOn(mockCarreraRepo, 'remove').mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockCarreraRepo.remove).toHaveBeenCalledWith(carrera);
    });
  });
});