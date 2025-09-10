// src/inscripcion-examen/inscripcion-examen.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionExamenController } from './inscripcion-examen.controller';
import { InscripcionExamenService } from './inscripcion-examen.service';

describe('InscripcionExamenController', () => {
  let controller: InscripcionExamenController;
  let mockInscripcionExamenService: Partial<InscripcionExamenService>;

  beforeEach(async () => {
    mockInscripcionExamenService = {
      inscribirse: jest.fn(),
      obtenerInscripcionesPorEstudiante: jest.fn(),
      obtenerInscripcionesPorMateria: jest.fn(),
      obtenerInscripcionesPorExamen: jest.fn(),
      actualizarEstado: jest.fn(),
      removerInscripcion: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscripcionExamenController],
      providers: [
        {
          provide: InscripcionExamenService,
          useValue: mockInscripcionExamenService,
        },
      ],
    }).compile();

    controller = module.get<InscripcionExamenController>(InscripcionExamenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});