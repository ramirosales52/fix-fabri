<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { CarreraController } from './carrera.controller';
=======
// src/carrera/carrera.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CarreraController } from './carrera.controller';
// Importa el servicio para mockearlo
>>>>>>> 47a0884 (segundo commit)
import { CarreraService } from './carrera.service';

describe('CarreraController', () => {
  let controller: CarreraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarreraController],
<<<<<<< HEAD
      providers: [CarreraService],
=======
      providers: [
        {
          provide: CarreraService, // Mockea el servicio
          useValue: {
            // Mockea los métodos que CarreraController usa
            // Por ejemplo:
            // create: jest.fn().mockResolvedValue({ id: 1, nombre: 'Ingeniería' }),
            // findAll: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Ingeniería' }]),
            // findOne: jest.fn().mockResolvedValue({ id: 1, nombre: 'Ingeniería' }),
            // update: jest.fn().mockResolvedValue({ id: 1, nombre: 'Ingeniería Actualizada' }),
            // remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<CarreraController>(CarreraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
