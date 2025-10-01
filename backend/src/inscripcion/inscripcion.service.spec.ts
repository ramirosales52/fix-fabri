// src/inscripcion/inscripcion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InscripcionService } from './inscripcion.service';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';

describe('InscripcionService', () => {
  let service: InscripcionService;
  let mockInscripcionRepo: any;
  let mockUserRepo: any;
  let mockMateriaRepo: any;
  let mockComisionRepo: any;
  let mockDepartamentoRepo: any;
  let mockCorrelativasService: any;

  beforeEach(async () => {
    // Crear mocks de repositorios
    mockInscripcionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockUserRepo = {
      findOne: jest.fn(),
    };

    mockMateriaRepo = {
      findOne: jest.fn(),
    };

    mockComisionRepo = {
      findOne: jest.fn(),
    };

    mockDepartamentoRepo = {
      findOne: jest.fn(),
    };

    mockCorrelativasService = {
      verificarCorrelativasCursada: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscripcionService,
        {
          provide: getRepositoryToken(Inscripcion),
          useValue: mockInscripcionRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Materia),
          useValue: mockMateriaRepo,
        },
        {
          provide: getRepositoryToken(Comision),
          useValue: mockComisionRepo,
        },
        {
          provide: getRepositoryToken(Departamento),
          useValue: mockDepartamentoRepo,
        },
        {
          provide: CorrelativasService,
          useValue: mockCorrelativasService,
        },
      ],
    }).compile();

    service = module.get<InscripcionService>(InscripcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('verificarInscripcionValida', () => {
    it('should allow enrollment in basic department materials', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      const estudiante = {
        id: userId,
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const materia = {
        id: materiaId,
        departamento: { id: 1, nombre: 'Básicas' },
        planesEstudio: [{ id: 1, carrera: { id: 1 } }]
      };

      const departamentoBasica = {
        id: 1,
        nombre: 'Básicas'
      };

      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockDepartamentoRepo, 'findOne').mockResolvedValue(departamentoBasica as any);

      // Act
      const result = await (service as any).verificarInscripcionValida(userId, materiaId);

      // Assert
      expect(result).toBe(true);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: materiaId },
        relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
      });
      expect(mockDepartamentoRepo.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Básicas' }
      });
    });

    it('should deny enrollment when student is from different career', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      const estudiante = {
        id: userId,
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const materia = {
        id: materiaId,
        departamento: { id: 2, nombre: 'Sistemas' },
        planesEstudio: [{ id: 2, carrera: { id: 2 } }]
      };

      const departamentoBasica = {
        id: 1,
        nombre: 'Básicas'
      };

      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockDepartamentoRepo, 'findOne').mockResolvedValue(departamentoBasica as any);

      // Act
      const result = await (service as any).verificarInscripcionValida(userId, materiaId);

      // Assert
      expect(result).toBe(false);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: materiaId },
        relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
      });
    });
  });

  describe('historialAcademico', () => {
    it('should return student academic history', async () => {
      // Arrange
      const userId = 1;
      
      const historial = [
        {
          id: 1,
          estudiante: { id: userId },
          materia: { id: 1, nombre: 'Matemática' },
          comision: { id: 1, nombre: 'Comisión A' },
          fechaInscripcion: new Date(),
          fechaFinalizacion: new Date(),
          faltas: 2,
          notaFinal: 8,
          stc: 'aprobada'
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'find').mockResolvedValue(historial as any);

      // Act
      const result = await service.historialAcademico(userId);

      // Assert
      expect(result).toEqual(historial);
      expect(mockInscripcionRepo.find).toHaveBeenCalledWith({
        where: { estudiante: { id: userId } },
        relations: ['materia', 'comision'],
        order: { fechaInscripcion: 'DESC' },
      });
    });
  });

  describe('materiasDelEstudiante', () => {
    it('should return student current subjects', async () => {
      // Arrange
      const userId = 1;
      
      const materias = [
        {
          id: 1,
          estudiante: { id: userId },
          materia: { id: 1, nombre: 'Matemática' },
          comision: { id: 1, nombre: 'Comisión A' },
          stc: 'cursando'
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'find').mockResolvedValue(materias as any);

      // Act
      const result = await service.materiasDelEstudiante(userId);

      // Assert
      expect(result).toEqual(materias);
      expect(mockInscripcionRepo.find).toHaveBeenCalledWith({
        where: { 
          estudiante: { id: userId },
          stc: 'cursando'
        },
        relations: ['materia', 'comision'],
      });
    });
  });

  describe('inscribirse', () => {
    it('should enroll student in subject successfully', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      const comisionId = 1;
      
      const estudiante = {
        id: userId,
        nombre: 'Juan',
        apellido: 'Pérez',
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const materia = {
        id: materiaId,
        nombre: 'Matemática',
        departamento: { id: 1, nombre: 'Departamento de Básicas' },
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const savedInscripcion = {
        id: 1,
        estudiante,
        materia,
        comision: { id: comisionId },
        stc: 'cursando'
      };

      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockDepartamentoRepo, 'findOne').mockResolvedValue({ id: 1, nombre: 'Básicas' } as any);
      jest.spyOn(mockCorrelativasService, 'verificarCorrelativasCursada').mockResolvedValue({ cumple: true, faltantes: [] });
      jest.spyOn(mockInscripcionRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockInscripcionRepo, 'save').mockResolvedValue(savedInscripcion as any);

      // Act
      const result = await service.inscribirse(userId, materiaId, comisionId);

      // Assert
      expect(result).toEqual(savedInscripcion);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: materiaId },
        relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
      });
      expect(mockDepartamentoRepo.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Básicas' }
      });
      expect(mockCorrelativasService.verificarCorrelativasCursada).toHaveBeenCalledWith(userId, materiaId);
      expect(mockInscripcionRepo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when student or subject not found', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.inscribirse(userId, materiaId)).rejects.toThrow('Estudiante o materia no encontrados');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
    });

    it('should throw BadRequestException when prerequisites not met', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      const estudiante = {
        id: userId,
        nombre: 'Juan',
        apellido: 'Pérez',
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const materia = {
        id: materiaId,
        nombre: 'Matemática',
        departamento: { id: 1, nombre: 'Departamento de Básicas' },
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockDepartamentoRepo, 'findOne').mockResolvedValue({ id: 1, nombre: 'Básicas' } as any);
      jest.spyOn(mockCorrelativasService, 'verificarCorrelativasCursada').mockResolvedValue({ 
        cumple: false, 
        faltantes: [{ id: 2, nombre: 'Álgebra' }] 
      });

      // Act & Assert
      await expect(service.inscribirse(userId, materiaId)).rejects.toThrow('No puedes cursar esta materia. Faltan correlativas de cursada: Álgebra');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: materiaId },
        relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
      });
      expect(mockDepartamentoRepo.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Básicas' }
      });
      expect(mockCorrelativasService.verificarCorrelativasCursada).toHaveBeenCalledWith(userId, materiaId);
    });

    it('should throw BadRequestException when department restriction applies', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      const estudiante = {
        id: userId,
        planEstudio: { id: 1, carrera: { id: 1 } }
      };

      const materia = {
        id: materiaId,
        departamento: { id: 2, nombre: 'Sistemas' },
        planEstudio: { id: 2, carrera: { id: 2 } }
      };

      // Mock de los repositorios
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockDepartamentoRepo, 'findOne').mockResolvedValue({ id: 1, nombre: 'Básicas' } as any);

      // Act & Assert
      await expect(service.inscribirse(userId, materiaId)).rejects.toThrow('No puedes inscribirte a esta materia. No pertenece a tu departamento.');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['planEstudio', 'planEstudio.carrera']
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: materiaId },
        relations: ['departamento', 'planesEstudio', 'planesEstudio.carrera']
      });
      expect(mockDepartamentoRepo.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Básicas' }
      });
    });
  });

  describe('cargarFaltas', () => {
    it('should load absences successfully', async () => {
      // Arrange
      const inscripcionId = 1;
      const faltas = 3;
      
      const inscripcion = {
        id: inscripcionId,
        estudiante: { id: 1 },
        materia: { id: 1 },
        comision: { id: 1 },
        faltas: 0
      };

      const updatedInscripcion = {
        ...inscripcion,
        faltas
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockInscripcionRepo, 'save').mockResolvedValue(updatedInscripcion as any);

      // Act
      const result = await service.cargarFaltas(inscripcionId, faltas);

      // Assert
      expect(result).toEqual(updatedInscripcion);
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId },
        relations: ['materia', 'estudiante', 'comision'],
      });
      expect(mockInscripcionRepo.save).toHaveBeenCalledWith({
        ...inscripcion,
        faltas
      });
    });

    it('should throw BadRequestException when inscription not found', async () => {
      // Arrange
      const inscripcionId = 1;
      const faltas = 3;
      
      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.cargarFaltas(inscripcionId, faltas)).rejects.toThrow('Inscripción no encontrada');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId },
        relations: ['materia', 'estudiante', 'comision'],
      });
    });
  });

  describe('cargarNota', () => {
    it('should load final grade successfully', async () => {
      // Arrange
      const inscripcionId = 1;
      const notaFinal = 8;
      const stc = 'aprobada';
      
      const inscripcion = {
        id: inscripcionId,
        estudiante: { id: 1 },
        materia: { id: 1 },
        comision: { id: 1 },
        notaFinal: 0,
        stc: 'cursando'
      };

      const updatedInscripcion = {
        ...inscripcion,
        notaFinal,
        stc
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockInscripcionRepo, 'save').mockResolvedValue(updatedInscripcion as any);

      // Act
      const result = await service.cargarNota(inscripcionId, notaFinal, stc);

      // Assert
      expect(result).toEqual(updatedInscripcion);
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId },
        relations: ['materia', 'estudiante', 'comision'],
      });
      expect(mockInscripcionRepo.save).toHaveBeenCalledWith({
        ...inscripcion,
        notaFinal,
        stc
      });
    });

    it('should throw BadRequestException when inscription not found', async () => {
      // Arrange
      const inscripcionId = 1;
      const notaFinal = 8;
      const stc = 'aprobada';
      
      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.cargarNota(inscripcionId, notaFinal, stc)).rejects.toThrow('Inscripción no encontrada');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId },
        relations: ['materia', 'estudiante', 'comision'],
      });
    });
  });

  describe('detalleMateria', () => {
    it('should return inscription details', async () => {
      // Arrange
      const inscripcionId = 1;
      const userId = 1;
      
      const inscripcion = {
        id: inscripcionId,
        estudiante: { id: userId },
        materia: { id: 1, nombre: 'Matemática' },
        comision: { id: 1, nombre: 'Comisión A' }
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);

      // Act
      const result = await service.detalleMateria(inscripcionId, userId);

      // Assert
      expect(result).toEqual(inscripcion);
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId, estudiante: { id: userId } },
        relations: ['materia', 'estudiante', 'comision'],
      });
    });

    it('should throw BadRequestException when inscription not found', async () => {
      // Arrange
      const inscripcionId = 1;
      const userId = 1;
      
      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.detalleMateria(inscripcionId, userId)).rejects.toThrow('Inscripción no encontrada o no te pertenece');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionId, estudiante: { id: userId } },
        relations: ['materia', 'estudiante', 'comision'],
      });
    });
  });

  describe('obtenerCursadasMateria', () => {
    it('should return all enrollments for student and subject', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      
      const cursadas = [
        {
          id: 1,
          estudiante: { id: userId },
          materia: { id: materiaId },
          comision: { id: 1, nombre: 'Comisión A' }
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionRepo, 'find').mockResolvedValue(cursadas as any);

      // Act
      const result = await service.obtenerCursadasMateria(userId, materiaId);

      // Assert
      expect(result).toEqual(cursadas);
      expect(mockInscripcionRepo.find).toHaveBeenCalledWith({
        where: { 
          estudiante: { id: userId },
          materia: { id: materiaId }
        },
        relations: ['comision'],
        order: { fechaInscripcion: 'DESC' }
      });
    });
  });
});