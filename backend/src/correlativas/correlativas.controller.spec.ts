// src/correlativas/correlativas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CorrelativasController } from './correlativas.controller';
import { CorrelativasService } from './correlativas.service';

describe('CorrelativasController', () => {
  let controller: CorrelativasController;
  let mockCorrelativasService: Partial<CorrelativasService>;

  beforeEach(async () => {
    mockCorrelativasService = {
      verificarCorrelativasCursada: jest.fn(),
      verificarCorrelativasFinales: jest.fn(),
      verificarTodasCorrelativas: jest.fn(),
      verificarInscripcionExamenFinal: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrelativasController],
      providers: [
        {
          provide: CorrelativasService,
          useValue: mockCorrelativasService,
        },
      ],
    }).compile();

    controller = module.get<CorrelativasController>(CorrelativasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});