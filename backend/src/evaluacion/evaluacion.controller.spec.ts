<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionController } from './evaluacion.controller';
=======
// src/evaluacion/evaluacion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionService } from './evaluacion.service';
>>>>>>> 47a0884 (segundo commit)

describe('EvaluacionController', () => {
  let controller: EvaluacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluacionController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: EvaluacionService,
          useValue: {
            // Mockea los métodos reales que EvaluacionController usa
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<EvaluacionController>(EvaluacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
