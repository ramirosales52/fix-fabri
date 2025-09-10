// src/evaluacion/evaluacion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EvaluacionService } from './evaluacion.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Evaluacion } from './entities/evaluacion.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let mockEvaluacionRepo: any;
  let mockMateriaRepo: any;
  let mockUserRepo: any;
  let mockInscripcionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Evaluacion, Materia, User, Inscripcion]),
      ],
      providers: [
        EvaluacionService,
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    mockEvaluacionRepo = module.get(getRepositoryToken(Evaluacion));
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockUserRepo = module.get(getRepositoryToken(User));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});