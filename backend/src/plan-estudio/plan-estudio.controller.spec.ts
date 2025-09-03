<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioController } from './plan-estudio.controller';
=======
// src/plan-estudio/plan-estudio.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioController } from './plan-estudio.controller';
import { PlanEstudioService } from './plan-estudio.service';
>>>>>>> 47a0884 (segundo commit)

describe('PlanEstudioController', () => {
  let controller: PlanEstudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanEstudioController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: PlanEstudioService,
          useValue: {
            // Mockea los métodos reales que PlanEstudioController usa
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<PlanEstudioController>(PlanEstudioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
