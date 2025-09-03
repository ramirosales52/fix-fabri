// src/inscripcion/inscripcion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from './inscripcion.controller';
// Importa el servicio para mockearlo
import { InscripcionService } from './inscripcion.service';

describe('InscripcionController', () => {
  let controller: InscripcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscripcionController],
      providers: [
        {
          provide: InscripcionService, // Mockea el servicio
          useValue: {
            
          },
        },
      ],
    }).compile();

    controller = module.get<InscripcionController>(InscripcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
