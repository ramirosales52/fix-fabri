// src/evaluacion/evaluacion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionService } from './evaluacion.service';

describe('EvaluacionController', () => {
  let controller: EvaluacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluacionController],
      providers: [
        {
          provide: EvaluacionService,
          useValue: {
            // Mockea los métodos reales que EvaluacionController usa
          },
        },
      ],
    }).compile();

    controller = module.get<EvaluacionController>(EvaluacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
