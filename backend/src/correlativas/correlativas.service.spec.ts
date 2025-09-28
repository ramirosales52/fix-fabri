// src/correlativas/correlativas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CorrelativasService } from './correlativas.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Materia } from '../materia/entities/materia.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

describe('CorrelativasService', () => {
  let service: CorrelativasService;
  let mockMateriaRepo: any;
  let mockInscripcionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          Materia, 
          Inscripcion
        ]),
      ],
      providers: [
        CorrelativasService,
      ],
    }).compile();

    service = module.get<CorrelativasService>(CorrelativasService);
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('verificarCorrelativasCursada', () => {
    it('should return true when no correlativas required', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Matemática',
        correlativasCursada: []
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);

      // Act
      const result = await service.verificarCorrelativasCursada(1, 1);

      // Assert
      expect(result).toEqual({ cumple: true, faltantes: [] });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasCursada']
      });
    });

    it('should return true when student meets all prerequisites', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Álgebra',
        correlativasCursada: [
          { id: 2, nombre: 'Matemática' }
        ]
      };

      const inscripcion = {
        id: 1,
        stc: 'aprobada',
        notaFinal: 8
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);

      // Act
      const result = await service.verificarCorrelativasCursada(1, 1);

      // Assert
      expect(result).toEqual({ cumple: true, faltantes: [] });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasCursada']
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: {
          estudiante: { id: 1 },
          materia: { id: 2 }
        },
        select: ['stc', 'notaFinal']
      });
    });

    it('should return false when student misses prerequisites', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Álgebra',
        correlativasCursada: [
          { id: 2, nombre: 'Matemática' }
        ]
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.verificarCorrelativasCursada(1, 1);

      // Assert
      expect(result).toEqual({ 
        cumple: false, 
        faltantes: [{ id: 2, nombre: 'Matemática' }] 
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasCursada']
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: {
          estudiante: { id: 1 },
          materia: { id: 2 }
        },
        select: ['stc', 'notaFinal']
      });
    });

    it('should throw NotFoundException when materia not found', async () => {
      // Arrange
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.verificarCorrelativasCursada(1, 1)).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasCursada']
      });
    });
  });

  describe('verificarCorrelativasFinales', () => {
    it('should return true when no final correlativas required', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Matemática',
        correlativasFinal: []
      };

      // Mock del repositorio
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);

      // Act
      const result = await service.verificarCorrelativasFinales(1, 1);

      // Assert
      expect(result).toEqual({ cumple: true, faltantes: [] });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasFinal']
      });
    });

    it('should return true when student meets all final prerequisites', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Álgebra',
        correlativasFinal: [
          { id: 2, nombre: 'Matemática' }
        ]
      };

      const inscripcion = {
        id: 1,
        stc: 'aprobada',
        notaFinal: 8
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);

      // Act
      const result = await service.verificarCorrelativasFinales(1, 1);

      // Assert
      expect(result).toEqual({ cumple: true, faltantes: [] });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasFinal']
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: {
          estudiante: { id: 1 },
          materia: { id: 2 }
        },
        select: ['stc', 'notaFinal']
      });
    });

    it('should return false when student misses final prerequisites', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Álgebra',
        correlativasFinal: [
          { id: 2, nombre: 'Matemática' }
        ]
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.verificarCorrelativasFinales(1, 1);

      // Assert
      expect(result).toEqual({ 
        cumple: false, 
        faltantes: [{ id: 2, nombre: 'Matemática' }] 
      });
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasFinal']
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: {
          estudiante: { id: 1 },
          materia: { id: 2 }
        },
        select: ['stc', 'notaFinal']
      });
    });

    it('should throw NotFoundException when materia not found', async () => {
      // Arrange
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.verificarCorrelativasFinales(1, 1)).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['correlativasFinal']
      });
    });
  });

  describe('verificarTodasCorrelativas', () => {
    it('should verify both cursada and final prerequisites', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Álgebra',
        correlativasCursada: [],
        correlativasFinal: []
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(service, 'verificarCorrelativasCursada').mockResolvedValue({ cumple: true, faltantes: [] });
      jest.spyOn(service, 'verificarCorrelativasFinales').mockResolvedValue({ cumple: true, faltantes: [] });

      // Act
      const result = await service.verificarTodasCorrelativas(1, 1);

      // Assert
      expect(result).toEqual({
        cursada: { cumple: true, faltantes: [] },
        final: { cumple: true, faltantes: [] }
      });
      expect(service.verificarCorrelativasCursada).toHaveBeenCalledWith(1, 1);
      expect(service.verificarCorrelativasFinales).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('verificarInscripcionExamenFinal', () => {
    it('should return success when student can inscribe to final exam', async () => {
      // Arrange
      const inscripcion = {
        id: 1,
        stc: 'cursada',
        materia: { id: 1 },
        estudiante: { id: 1 }
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(service, 'verificarCorrelativasFinales').mockResolvedValue({ cumple: true, faltantes: [] });

      // Act
      const result = await service.verificarInscripcionExamenFinal(1, 1);

      // Assert
      expect(result).toEqual({
        cumple: true,
        mensaje: 'Correlativas verificadas correctamente'
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
    });

    it('should return error when inscription not found', async () => {
      // Arrange
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.verificarInscripcionExamenFinal(1, 1);

      // Assert
      expect(result).toEqual({
        cumple: false,
        mensaje: 'Inscripción no encontrada'
      });
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
    });

    it('should return error when student is different', async () => {
      // Arrange
      const inscripcion = {
        id: 1,
        stc: 'cursada',
        materia: { id: 1 },
        estudiante: { id: 2 } // Diferente estudiante
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);

      // Act
      const result = await service.verificarInscripcionExamenFinal(1, 1);

      // Assert
      expect(result).toEqual({
        cumple: false,
        mensaje: 'No puedes inscribirte a un examen de otro estudiante'
      });
    });

    it('should return error when student has not completed course', async () => {
      // Arrange
      const inscripcion = {
        id: 1,
        stc: 'pendiente', // No ha cursado la materia
        materia: { id: 1 },
        estudiante: { id: 1 }
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);

      // Act
      const result = await service.verificarInscripcionExamenFinal(1, 1);

      // Assert
      expect(result).toEqual({
        cumple: false,
        mensaje: 'No puedes inscribirte a examen final si no has cursado la materia'
      });
    });
  });
});