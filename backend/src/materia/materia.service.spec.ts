// src/materia/materia.service.spec.ts
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MateriaService } from './materia.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Materia } from './entities/materia.entity';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { User } from '../user/entities/user.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Comision } from '../comision/entities/comision.entity';
import { NotFoundException } from '@nestjs/common';

describe('MateriaService', () => {
  let service: MateriaService;
  let mockMateriaRepo: any;
  let mockDepartamentoRepo: any;
  let mockUserRepo: any;

  const mockDepartamentoBasicas = { id: 1, nombre: 'Básicas' };
  const mockDepartamentoCarrera = { id: 2, nombre: 'Sistemas' };
  const mockPlanEstudio = { id: 1, nombre: 'Plan 2023', carrera: { id: 1, departamentos: [mockDepartamentoCarrera] } };
  const mockEstudiante = { 
    id: 1, 
    nombre: 'Estudiante', 
    apellido: 'Prueba',
    planEstudio: mockPlanEstudio 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Materia, Departamento, User]),
      ],
      providers: [MateriaService],
    }).compile();

    service = module.get<MateriaService>(MateriaService);
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockDepartamentoRepo = module.get(getRepositoryToken(Departamento));
    mockUserRepo = module.get(getRepositoryToken(User));

    // Mock para el repositorio de departamento
    mockDepartamentoRepo.findOne = jest.fn().mockImplementation((options) => {
      if (options?.where?.nombre === 'Básicas') {
        return Promise.resolve(mockDepartamentoBasicas);
      }
      return Promise.resolve(mockDepartamentoCarrera);
    });

    // Mock para el repositorio de usuario
    mockUserRepo.findOne = jest.fn().mockResolvedValue(mockEstudiante);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('create', () => {
    it('should create a materia successfully', async () => {
      // Arrange - Corregido: Ahora incluye el departamentoId requerido
      const createDto = {
        nombre: 'Matemática',
        descripcion: 'Materia de matemáticas básicas',
        planEstudioId: 1,
        departamentoId: 1 // ✅ Campo requerido incluido
      };

      const savedMateria = {
        id: 1,
        ...createDto
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockMateriaRepo, 'save').mockResolvedValue(savedMateria as any);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedMateria);
      expect(mockMateriaRepo.create).toHaveBeenCalledWith(createDto);
      expect(mockMateriaRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las materias', async () => {
      // Arrange
      const materias = [
        {
          id: 1,
          nombre: 'Matemática',
          descripcion: 'Materia de matemáticas básicas',
          planEstudioId: 1,
          departamentoId: 1,
          departamento: mockDepartamentoBasicas
        },
        {
          id: 2,
          nombre: 'Programación I',
          descripcion: 'Introducción a la programación',
          planEstudioId: 1,
          departamentoId: 2,
          departamento: mockDepartamentoCarrera
        }
      ];

      mockMateriaRepo.find.mockResolvedValue(materias);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(materias);
      expect(mockMateriaRepo.find).toHaveBeenCalledWith({
        relations: expect.arrayContaining([
          'planEstudio', 'profesores', 'jefeCatedra', 'departamento'
        ])
      });
    });

    it('debería manejar errores al buscar materias', async () => {
      // Arrange
      mockMateriaRepo.find.mockRejectedValue(new Error('Error de base de datos'));

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow('Error de base de datos');
    });
  });

  describe('findMateriasDisponibles', () => {
    it('debería retornar materias del departamento del estudiante y básicas', async () => {
      // Arrange
      const materiasBasicas = [
        { id: 1, nombre: 'Matemática', departamento: mockDepartamentoBasicas }
      ];
      const materiasCarrera = [
        { id: 2, nombre: 'Programación I', departamento: mockDepartamentoCarrera }
      ];
      
      mockMateriaRepo.find.mockImplementation((options) => {
        const deptId = options.where.departamento.id._value[0];
        if (deptId === mockDepartamentoBasicas.id) {
          return Promise.resolve(materiasBasicas);
        }
        return Promise.resolve(materiasCarrera);
      });

      // Act
      const result = await service.findMateriasDisponibles(1);

      // Assert
      expect(result).toHaveLength(2);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['planEstudio', 'planEstudio.carrera', 'planEstudio.carrera.departamentos']
      });
      expect(mockDepartamentoRepo.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Básicas' }
      });
    });

    it('debería lanzar error si el estudiante no tiene plan de estudio', async () => {
      // Arrange
      mockUserRepo.findOne.mockResolvedValueOnce({ id: 1, planEstudio: null });

      // Act & Assert
      await expect(service.findMateriasDisponibles(1)).rejects.toThrow(
        'Estudiante o carrera no encontrados'
      );
    });

    it('debería lanzar error si no encuentra el departamento de básicas', async () => {
      // Arrange
      mockDepartamentoRepo.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findMateriasDisponibles(1)).rejects.toThrow(
        'Departamento de Básicas no encontrado'
      );
    });
  });

  describe('findOne', () => {
    it('should return a materia by id', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Matemática',
        descripcion: 'Materia de matemáticas básicas',
        planEstudioId: 1,
        departamentoId: 1
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(materia);
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['planEstudio', 'profesores', 'jefeCatedra', 'correlativasCursada', 'correlativasFinal', 'inscripciones', 'evaluaciones', 'horarios', 'clases', 'examenes', 'comisiones'],
      });
    });

    it('should throw NotFoundException when materia not found', async () => {
      // Arrange
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['planEstudio', 'profesores', 'jefeCatedra', 'correlativasCursada', 'correlativasFinal', 'inscripciones', 'evaluaciones', 'horarios', 'clases', 'examenes', 'comisiones'],
      });
    });
  });

  describe('update', () => {
    it('should update a materia successfully', async () => {
      // Arrange - Corregido: Ahora incluye el departamentoId requerido
      const id = 1;
      const updateDto = {
        nombre: 'Matemática Avanzada',
        descripcion: 'Materia de matemáticas avanzadas',
        planEstudioId: 1,
        departamentoId: 1 // ✅ Campo requerido incluido
      };

      const existingMateria = {
        id,
        nombre: 'Matemática',
        descripcion: 'Materia de matemáticas básicas',
        planEstudioId: 1,
        departamentoId: 1
      };

      const updatedMateria = {
        ...existingMateria,
        ...updateDto
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(existingMateria as any);
      jest.spyOn(mockMateriaRepo, 'save').mockResolvedValue(updatedMateria as any);

      // Act
      const result = await service.update(id, updateDto);

      // Assert
      expect(result).toEqual(updatedMateria);
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockMateriaRepo.save).toHaveBeenCalledWith({
        ...existingMateria,
        ...updateDto
      });
    });

    it('should throw NotFoundException when materia not found during update', async () => {
      // Arrange
      const id = 1;
      const updateDto = {
        nombre: 'Matemática Avanzada',
        planEstudioId: 1,
        departamentoId: 1 // ✅ Campo requerido incluido
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(id, updateDto)).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('remove', () => {
    it('should remove a materia successfully', async () => {
      // Arrange
      const id = 1;
      
      const materia = {
        id,
        nombre: 'Matemática',
        descripcion: 'Materia de matemáticas básicas',
        planEstudioId: 1,
        departamentoId: 1
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockMateriaRepo, 'delete').mockResolvedValue(undefined);

      // Act
      const result = await service.remove(id);

      // Assert
      expect(result).toEqual(materia);
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockMateriaRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when materia not found during removal', async () => {
      // Arrange
      const id = 1;
      
      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(id)).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});