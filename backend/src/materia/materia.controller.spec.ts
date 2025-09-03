<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { MateriaController } from './materia.controller';
=======
// src/materia/materia.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MateriaController } from './materia.controller';
import { MateriaService } from './materia.service';
>>>>>>> 47a0884 (segundo commit)

describe('MateriaController', () => {
  let controller: MateriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MateriaController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: MateriaService,
          useValue: {
            // Mockea los métodos reales que MateriaController usa
            // Ejemplo:
            // findAll: jest.fn().mockResolvedValue([]),
            // findOne: jest.fn().mockResolvedValue({ id: 1, nombre: 'Materia Test' }),
            // create: jest.fn().mockResolvedValue({ id: 2, nombre: 'Nueva Materia' }),
            // update: jest.fn().mockResolvedValue({ id: 1, nombre: 'Materia Actualizada' }),
            // remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<MateriaController>(MateriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
