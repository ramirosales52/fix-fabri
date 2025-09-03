<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { HorarioController } from './horario.controller';
=======
// src/horario/horario.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HorarioController } from './horario.controller';
import { HorarioService } from './horario.service';
>>>>>>> 47a0884 (segundo commit)

describe('HorarioController', () => {
  let controller: HorarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorarioController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: HorarioService,
          useValue: {
            // Mockea los métodos reales que HorarioController usa
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<HorarioController>(HorarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
