// src/inscripcion-examen/inscripcion-examen.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { InscripcionExamenService } from './inscripcion-examen.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { InscripcionExamen } from './entities/inscripcion-examen.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';

describe('InscripcionExamenService', () => {
  let service: InscripcionExamenService;
  let mockInscripcionExamenRepo: any;
  let mockInscripcionRepo: any;
  let mockExamenRepo: any;
  let mockCorrelativasService: Partial<CorrelativasService>;

  beforeEach(async () => {
    mockCorrelativasService = {
      verificarInscripcionExamenFinal: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          InscripcionExamen, 
          Inscripcion, 
          ExamenFinal
        ]),
      ],
      providers: [
        InscripcionExamenService,
        {
          provide: CorrelativasService,
          useValue: mockCorrelativasService,
        },
      ],
    }).compile();

    service = module.get<InscripcionExamenService>(InscripcionExamenService);
    mockInscripcionExamenRepo = module.get(getRepositoryToken(InscripcionExamen));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
    mockExamenRepo = module.get(getRepositoryToken(ExamenFinal));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});