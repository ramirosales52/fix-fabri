// src/inscripcion-examen/inscripcion-examen.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { InscripcionExamenService } from './inscripcion-examen.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { InscripcionExamen } from './entities/inscripcion-examen.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';
import { CreateInscripcionExamenDto } from './dto/create-inscripcion-examen.dto';
import { UpdateInscripcionExamenDto } from './dto/update-inscripcion-examen.dto';

describe('InscripcionExamenService', () => {
  let service: InscripcionExamenService;
  let mockInscripcionExamenRepo: any;
  let mockInscripcionRepo: any;
  let mockExamenRepo: any;
  let mockCorrelativasService: Partial<CorrelativasService>;

  beforeEach(async () => {
    mockCorrelativasService = {
      verificarInscripcionExamenFinal: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          InscripcionExamen, 
          Inscripcion, 
          ExamenFinal
        ]),
      ],
      providers: [
        InscripcionExamenService,
        {
          provide: CorrelativasService,
          useValue: mockCorrelativasService,
        },
      ],
    }).compile();

    service = module.get<InscripcionExamenService>(InscripcionExamenService);
    mockInscripcionExamenRepo = module.get(getRepositoryToken(InscripcionExamen));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
    mockExamenRepo = module.get(getRepositoryToken(ExamenFinal));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('inscribirse', () => {
    it('should enroll student to final exam successfully', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1,
        estado: 'inscripto',
        nota: 8
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'cursada'
      };

      const examen = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 }
      };

      const savedInscripcionExamen = {
        id: 1,
        inscripcion,
        examen,
        estado: 'inscripto',
        nota: 8
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(examen as any);
      jest.spyOn(mockCorrelativasService, 'verificarInscripcionExamenFinal').mockResolvedValue({ 
        cumple: true, 
        mensaje: 'Correlativas verificadas correctamente' 
      });
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(null); // No inscrito previamente
      jest.spyOn(mockInscripcionExamenRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockInscripcionExamenRepo, 'save').mockResolvedValue(savedInscripcionExamen as any);

      // Act
      const result = await service.inscribirse(dto);

      // Assert
      expect(result).toEqual(savedInscripcionExamen);
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockCorrelativasService.verificarInscripcionExamenFinal).toHaveBeenCalledWith(1, 1);
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { inscripcion: { id: 1 }, examen: { id: 1 } }
      });
      expect(mockInscripcionExamenRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when inscription not found', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('Inscripción no encontrada');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
    });

    it('should throw NotFoundException when exam not found', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'cursada'
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('Examen final no encontrado');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
    });

    it('should throw BadRequestException when student mismatch', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'cursada'
      };

      const examen = {
        id: 1,
        estudiante: { id: 2 }, // Diferente estudiante
        materia: { id: 1 }
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(examen as any);

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('No puedes inscribirte a un examen de otro estudiante');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
    });

    it('should throw BadRequestException when prerequisites not met', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'cursada'
      };

      const examen = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 }
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(examen as any);
      jest.spyOn(mockCorrelativasService, 'verificarInscripcionExamenFinal').mockResolvedValue({ 
        cumple: false, 
        mensaje: 'No puedes inscribirte al examen final. Faltan correlativas: Matemática' 
      });

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('No puedes inscribirte al examen final. Faltan correlativas: Matemática');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockCorrelativasService.verificarInscripcionExamenFinal).toHaveBeenCalledWith(1, 1);
    });

    it('should throw BadRequestException when student has not completed course', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'pendiente' // No ha cursado la materia
      };

      const examen = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 }
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(examen as any);
      jest.spyOn(mockCorrelativasService, 'verificarInscripcionExamenFinal').mockResolvedValue({ 
        cumple: true, 
        mensaje: 'Correlativas verificadas correctamente' 
      });

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('No puedes inscribirte a examen final si no has cursado la materia');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockCorrelativasService.verificarInscripcionExamenFinal).toHaveBeenCalledWith(1, 1);
    });

    it('should throw BadRequestException when already enrolled', async () => {
      // Arrange
      const dto: CreateInscripcionExamenDto = {
        inscripcionId: 1,
        examenId: 1
      };

      const inscripcion = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 },
        stc: 'cursada'
      };

      const examen = {
        id: 1,
        estudiante: { id: 1 },
        materia: { id: 1 }
      };

      const yaInscripto = {
        id: 1,
        inscripcion,
        examen
      };

      // Mock de los repositorios
      jest.spyOn(mockInscripcionRepo, 'findOne').mockResolvedValue(inscripcion as any);
      jest.spyOn(mockExamenRepo, 'findOne').mockResolvedValue(examen as any);
      jest.spyOn(mockCorrelativasService, 'verificarInscripcionExamenFinal').mockResolvedValue({ 
        cumple: true, 
        mensaje: 'Correlativas verificadas correctamente' 
      });
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(yaInscripto as any);

      // Act & Assert
      await expect(service.inscribirse(dto)).rejects.toThrow('Ya estás inscripto a este examen final');
      expect(mockInscripcionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'estudiante']
      });
      expect(mockCorrelativasService.verificarInscripcionExamenFinal).toHaveBeenCalledWith(1, 1);
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { inscripcion: { id: 1 }, examen: { id: 1 } }
      });
    });
  });

  describe('obtenerInscripcionesPorEstudiante', () => {
    it('should return student exam enrollments', async () => {
      // Arrange
      const estudianteId = 1;
      
      const inscripciones = [
        {
          id: 1,
          inscripcion: { id: 1, estudiante: { id: estudianteId } },
          examen: { id: 1, materia: { id: 1 } }
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'find').mockResolvedValue(inscripciones as any);

      // Act
      const result = await service.obtenerInscripcionesPorEstudiante(estudianteId);

      // Assert
      expect(result).toEqual(inscripciones);
      expect(mockInscripcionExamenRepo.find).toHaveBeenCalledWith({
        where: { 
          inscripcion: { estudiante: { id: estudianteId } } 
        },
        relations: ['examen', 'inscripcion'],
        order: { examen: { id: 'DESC' } }
      });
    });
  });

  describe('obtenerInscripcionesPorMateria', () => {
    it('should return exam enrollments by subject', async () => {
      // Arrange
      const materiaId = 1;
      
      const inscripciones = [
        {
          id: 1,
          inscripcion: { id: 1 },
          examen: { id: 1, materia: { id: materiaId } }
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'find').mockResolvedValue(inscripciones as any);

      // Act
      const result = await service.obtenerInscripcionesPorMateria(materiaId);

      // Assert
      expect(result).toEqual(inscripciones);
      expect(mockInscripcionExamenRepo.find).toHaveBeenCalledWith({
        where: { 
          examen: { materia: { id: materiaId } } 
        },
        relations: ['examen', 'inscripcion'],
        order: { examen: { id: 'DESC' } }
      });
    });
  });

  describe('obtenerInscripcionesPorExamen', () => {
    it('should return exam enrollments', async () => {
      // Arrange
      const examenId = 1;
      
      const inscripciones = [
        {
          id: 1,
          inscripcion: { id: 1 },
          examen: { id: examenId }
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'find').mockResolvedValue(inscripciones as any);

      // Act
      const result = await service.obtenerInscripcionesPorExamen(examenId);

      // Assert
      expect(result).toEqual(inscripciones);
      expect(mockInscripcionExamenRepo.find).toHaveBeenCalledWith({
        where: { examen: { id: examenId } },
        relations: ['inscripcion', 'examen'],
        order: { inscripcion: { id: 'ASC' } }
      });
    });
  });

  describe('actualizarEstado', () => {
    it('should update exam enrollment status', async () => {
      // Arrange
      const inscripcionExamenId = 1;
      const dto: UpdateInscripcionExamenDto = {
        estado: 'aprobado',
        nota: 9
      };

      const inscripcionExamen = {
        id: inscripcionExamenId,
        inscripcion: { id: 1 },
        examen: { id: 1 },
        estado: 'inscripto',
        nota: 8
      };

      const updatedInscripcionExamen = {
        ...inscripcionExamen,
        ...dto
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(inscripcionExamen as any);
      jest.spyOn(mockInscripcionExamenRepo, 'save').mockResolvedValue(updatedInscripcionExamen as any);

      // Act
      const result = await service.actualizarEstado(inscripcionExamenId, dto);

      // Assert
      expect(result).toEqual(updatedInscripcionExamen);
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionExamenId },
        relations: ['examen']
      });
      expect(mockInscripcionExamenRepo.save).toHaveBeenCalledWith({
        ...inscripcionExamen,
        ...dto
      });
    });

    it('should throw NotFoundException when exam enrollment not found', async () => {
      // Arrange
      const inscripcionExamenId = 1;
      const dto: UpdateInscripcionExamenDto = {
        estado: 'aprobado'
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.actualizarEstado(inscripcionExamenId, dto)).rejects.toThrow('Inscripción a examen no encontrada');
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionExamenId },
        relations: ['examen']
      });
    });
  });

  describe('removerInscripcion', () => {
    it('should remove exam enrollment', async () => {
      // Arrange
      const inscripcionExamenId = 1;
      
      const inscripcionExamen = {
        id: inscripcionExamenId,
        inscripcion: { id: 1 },
        examen: { id: 1 }
      };

      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(inscripcionExamen as any);
      jest.spyOn(mockInscripcionExamenRepo, 'delete').mockResolvedValue(undefined);

      // Act
      await service.removerInscripcion(inscripcionExamenId);

      // Assert
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionExamenId }
      });
      expect(mockInscripcionExamenRepo.delete).toHaveBeenCalledWith(inscripcionExamenId);
    });

    it('should throw NotFoundException when exam enrollment not found', async () => {
      // Arrange
      const inscripcionExamenId = 1;
      
      // Mock del repositorio
      jest.spyOn(mockInscripcionExamenRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.removerInscripcion(inscripcionExamenId)).rejects.toThrow('Inscripción a examen no encontrada');
      expect(mockInscripcionExamenRepo.findOne).toHaveBeenCalledWith({
        where: { id: inscripcionExamenId }
      });
    });
  });
});