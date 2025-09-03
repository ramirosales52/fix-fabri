<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from './inscripcion.controller';
=======
// src/inscripcion/inscripcion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from './inscripcion.controller';
// Importa el servicio para mockearlo
import { InscripcionService } from './inscripcion.service';
>>>>>>> 47a0884 (segundo commit)

describe('InscripcionController', () => {
  let controller: InscripcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscripcionController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: InscripcionService, // Mockea el servicio
          useValue: {
            // Mockea los métodos que InscripcionController usa
            // Por ejemplo:
            // inscribirse: jest.fn().mockResolvedValue({ id: 1, /* ... */ }),
            // historialAcademico: jest.fn().mockResolvedValue([]),
            // detalleMateria: jest.fn().mockResolvedValue({}),
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<InscripcionController>(InscripcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
