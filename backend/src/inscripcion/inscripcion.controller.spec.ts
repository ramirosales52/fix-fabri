// src/inscripcion/inscripcion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';

describe('InscripcionController', () => {
  let controller: InscripcionController;
  let mockInscripcionService: Partial<InscripcionService>;

  beforeEach(async () => {
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
});