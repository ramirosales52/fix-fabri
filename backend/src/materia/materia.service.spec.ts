// src/materia/materia.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MateriaService } from './materia.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Materia } from './entities/materia.entity';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Comision } from '../comision/entities/comision.entity';

describe('MateriaService', () => {
  let service: MateriaService;
  let mockMateriaRepo: any;
  let mockPlanEstudioRepo: any;
  let mockUserRepo: any;
  let mockInscripcionRepo: any;
  let mockComisionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Materia, PlanEstudio, User, Inscripcion, Comision]),
      ],
      providers: [
        MateriaService,
      ],
    }).compile();

    service = module.get<MateriaService>(MateriaService);
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockPlanEstudioRepo = module.get(getRepositoryToken(PlanEstudio));
    mockUserRepo = module.get(getRepositoryToken(User));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
    mockComisionRepo = module.get(getRepositoryToken(Comision));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});