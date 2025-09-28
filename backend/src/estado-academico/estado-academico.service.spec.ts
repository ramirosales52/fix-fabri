// src/estado-academico/estado-academico.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EstadoAcademicoService } from './estado-academico.service';
import { InscripcionService } from '../inscripcion/inscripcion.service';

describe('EstadoAcademicoService', () => {
  let service: EstadoAcademicoService;
  let mockInscripcionService: Partial<InscripcionService>;

  beforeEach(async () => {
    mockInscripcionService = {
      materiasDelEstudiante: jest.fn(),
      historialAcademico: jest.fn(),
      detalleMateria: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadoAcademicoService,
        {
          provide: InscripcionService,
          useValue: mockInscripcionService,
        },
      ],
    }).compile();

    service = module.get<EstadoAcademicoService>(EstadoAcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerEstadoAcademico', () => {
    it('should return academic status for a user', async () => {
      // Arrange
      const userId = 1;
      
      const materiasCursando = [
        {
          materia: { id: 1, nombre: 'Matemática' },
          faltas: 2,
          notaFinal: null,
          stc: 'cursada',
          evaluaciones: []
        }
      ];

      const historial = [
        {
          materia: { id: 2, nombre: 'Física' },
          notaFinal: 8,
          stc: 'aprobada',
          fechaInscripcion: new Date(),
          fechaFinalizacion: new Date()
        }
      ];

      // Mock de los métodos del servicio de inscripción
      (mockInscripcionService.materiasDelEstudiante as jest.Mock).mockResolvedValue(materiasCursando);
      (mockInscripcionService.historialAcademico as jest.Mock).mockResolvedValue(historial);

      // Act
      const result = await service.obtenerEstadoAcademico(userId);

      // Assert
      expect(result).toEqual({
        materiasCursando: [
          {
            materia: { id: 1, nombre: 'Matemática' },
            faltas: 2,
            notaFinal: null,
            stc: 'cursada',
            evaluaciones: []
          }
        ],
        historial: [
          {
            materia: { id: 2, nombre: 'Física' },
            notaFinal: 8,
            stc: 'aprobada',
            fechaInscripcion: expect.any(Date),
            fechaFinalizacion: expect.any(Date)
          }
        ]
      });
      expect(mockInscripcionService.materiasDelEstudiante).toHaveBeenCalledWith(userId);
      expect(mockInscripcionService.historialAcademico).toHaveBeenCalledWith(userId);
    });
  });

  describe('puedeAprobarDirectamente', () => {
    it('should return true when student meets direct approval criteria', async () => {
      // Arrange
      const inscripcionId = 1;
      
      const inscripcion = {
        stc: 'cursada',
        evaluaciones: [
          { nota: 9 },
          { nota: 10 },
          { nota: 9 }
        ],
        faltas: 2
      };

      // Mock del método detalleMateria
      (mockInscripcionService.detalleMateria as jest.Mock).mockResolvedValue(inscripcion);

      // Act
      const result = await service.puedeAprobarDirectamente(inscripcionId);

      // Assert
      expect(result).toBe(true);
      expect(mockInscripcionService.detalleMateria).toHaveBeenCalledWith(inscripcionId, 0);
    });

    it('should return false when student does not meet criteria', async () => {
      // Arrange
      const inscripcionId = 1;
      
      const inscripcion = {
        stc: 'cursada',
        evaluaciones: [
          { nota: 5 },
          { nota: 6 },
          { nota: 7 }
        ],
        faltas: 2
      };

      // Mock del método detalleMateria
      (mockInscripcionService.detalleMateria as jest.Mock).mockResolvedValue(inscripcion);

      // Act
      const result = await service.puedeAprobarDirectamente(inscripcionId);

      // Assert
      expect(result).toBe(false);
      expect(mockInscripcionService.detalleMateria).toHaveBeenCalledWith(inscripcionId, 0);
    });

    it('should return false when detailMateria fails', async () => {
      // Arrange
      const inscripcionId = 1;
      
      // Mock del método detalleMateria que lanza error
      (mockInscripcionService.detalleMateria as jest.Mock).mockRejectedValue(new Error('Not found'));

      // Act
      const result = await service.puedeAprobarDirectamente(inscripcionId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('puedeInscribirseExamenFinal', () => {
    it('should return true when student can enroll in final exam', async () => {
      // Arrange
      const inscripcionId = 1;
      
      const inscripcion = {
        stc: 'cursada'
      };

      // Mock del método detalleMateria
      (mockInscripcionService.detalleMateria as jest.Mock).mockResolvedValue(inscripcion);

      // Act
      const result = await service.puedeInscribirseExamenFinal(inscripcionId);

      // Assert
      expect(result).toBe(true);
      expect(mockInscripcionService.detalleMateria).toHaveBeenCalledWith(inscripcionId, 0);
    });

    it('should return false when student cannot enroll in final exam', async () => {
      // Arrange
      const inscripcionId = 1;
      
      const inscripcion = {
        stc: 'pendiente'
      };

      // Mock del método detalleMateria
      (mockInscripcionService.detalleMateria as jest.Mock).mockResolvedValue(inscripcion);

      // Act
      const result = await service.puedeInscribirseExamenFinal(inscripcionId);

      // Assert
      expect(result).toBe(false);
      expect(mockInscripcionService.detalleMateria).toHaveBeenCalledWith(inscripcionId, 0);
    });

    it('should return false when detailMateria fails', async () => {
      // Arrange
      const inscripcionId = 1;
      
      // Mock del método detalleMateria que lanza error
      (mockInscripcionService.detalleMateria as jest.Mock).mockRejectedValue(new Error('Not found'));

      // Act
      const result = await service.puedeInscribirseExamenFinal(inscripcionId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('calcularPromedioEvaluaciones', () => {
    it('should calculate average correctly', () => {
      // Arrange
      const evaluaciones = [
        { nota: 8 },
        { nota: 9 },
        { nota: 7 }
      ];

      // Act
      const result = (service as any).calcularPromedioEvaluaciones(evaluaciones);

      // Assert
      expect(result).toBe(8);
    });

    it('should return 0 when no evaluations', () => {
      // Arrange
      const evaluaciones = [];

      // Act
      const result = (service as any).calcularPromedioEvaluaciones(evaluaciones);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('calcularAsistencia', () => {
    it('should calculate attendance correctly', () => {
      // Arrange
      const faltas = 2;

      // Act
      const result = (service as any).calcularAsistencia(faltas);

      // Assert
      expect(result).toBe(90); // 20 faltas máximas, 2 faltas = 10% faltas = 90% asistencia
    });

    it('should return 0 when more than max absences', () => {
      // Arrange
      const faltas = 25; // Más de las 20 máximas

      // Act
      const result = (service as any).calcularAsistencia(faltas);

      // Assert
      expect(result).toBe(0);
    });
  });
});