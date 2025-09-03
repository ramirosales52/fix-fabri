<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { ClaseController } from './clase.controller';
=======
// src/clase/clase.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClaseController } from './clase.controller';
import { ClaseService } from './clase.service';
>>>>>>> 47a0884 (segundo commit)

describe('ClaseController', () => {
  let controller: ClaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaseController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: ClaseService,
          useValue: {
            // Mockea los métodos reales que ClaseController usa
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<ClaseController>(ClaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
