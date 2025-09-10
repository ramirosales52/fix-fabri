// src/inscripcion/inscripcion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { InscripcionService } from './inscripcion.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Evaluacion } from '../evaluacion/entities/evaluacion.entity';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { InscripcionExamen } from '../inscripcion-examen/entities/inscripcion-examen.entity';
import { CorrelativasService } from '../correlativas/correlativas.service';

describe('InscripcionService', () => {
  let service: InscripcionService;
  let mockInscripcionRepo: any;
  let mockUserRepo: any;
  let mockMateriaRepo: any;
  let mockComisionRepo: any;
  let mockEvaluacionRepo: any;
  let mockExamenRepo: any;
  let mockInscripcionExamenRepo: any;
  let mockCorrelativasService: Partial<CorrelativasService>;

  beforeEach(async () => {
    mockCorrelativasService = {
      verificarCorrelativasCursada: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          Inscripcion, 
          User, 
          Materia, 
          Comision, 
          Evaluacion,
          ExamenFinal,
          InscripcionExamen
        ]),
      ],
      providers: [
        InscripcionService,
        {
          provide: CorrelativasService,
          useValue: mockCorrelativasService,
        },
      ],
    }).compile();

    service = module.get<InscripcionService>(InscripcionService);
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
    mockUserRepo = module.get(getRepositoryToken(User));
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockComisionRepo = module.get(getRepositoryToken(Comision));
    mockEvaluacionRepo = module.get(getRepositoryToken(Evaluacion));
    mockExamenRepo = module.get(getRepositoryToken(ExamenFinal));
    mockInscripcionExamenRepo = module.get(getRepositoryToken(InscripcionExamen));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});