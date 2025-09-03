// src/plan-estudio/plan-estudio.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioController } from './plan-estudio.controller';
import { PlanEstudioService } from './plan-estudio.service';

describe('PlanEstudioController', () => {
  let controller: PlanEstudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanEstudioController],
      providers: [
        {
          provide: PlanEstudioService,
          useValue: {
            // Mockea los métodos reales que PlanEstudioController usa
          },
        },
      ],
    }).compile();

    controller = module.get<PlanEstudioController>(PlanEstudioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
