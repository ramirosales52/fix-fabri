// src/inscripcion/inscripcion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';

describe('InscripcionController', () => {
  let controller: InscripcionController;
  let mockInscripcionService: Partial<InscripcionService>;

  beforeEach(async () => {
    // Aumentar timeout
    jest.setTimeout(10000);
    
    mockInscripcionService = {
      historialAcademico: jest.fn(),
      materiasDelEstudiante: jest.fn(),
      inscribirse: jest.fn(),
      cargarFaltas: jest.fn(),
      cargarNota: jest.fn(),
      detalleMateria: jest.fn(),
      obtenerCursadasMateria: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscripcionController],
      providers: [
        {
          provide: InscripcionService,
          useValue: mockInscripcionService,
        },
      ],
    }).compile();

    controller = module.get<InscripcionController>(InscripcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad
  describe('inscribirse', () => {
    it('should enroll student in subject', async () => {
      // Arrange
      const userId = 1;
      const materiaId = 1;
      const request = { user: { userId } };
      
      const inscripcion = {
        id: 1,
        estudiante: { id: userId },
        materia: { id: materiaId },
        stc: 'cursando'
      };

      (mockInscripcionService.inscribirse as jest.Mock).mockResolvedValue(inscripcion);

      // Act
      const result = await controller.inscribirse(request, materiaId.toString());

      // Assert
      expect(result).toEqual(inscripcion);
      expect(mockInscripcionService.inscribirse).toHaveBeenCalledWith(userId, materiaId);
    });
  });
});