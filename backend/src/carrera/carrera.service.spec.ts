// src/carrera/carrera.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CarreraService } from './carrera.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Carrera } from './entities/carrera.entity';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { Materia } from '../materia/entities/materia.entity';

describe('CarreraService', () => {
  let service: CarreraService;
  let mockCarreraRepo: any;
  let mockPlanEstudioRepo: any;
  let mockMateriaRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Carrera, PlanEstudio, Materia]),
      ],
      providers: [
        CarreraService,
      ],
    }).compile();

    service = module.get<CarreraService>(CarreraService);
    mockCarreraRepo = module.get(getRepositoryToken(Carrera));
    mockPlanEstudioRepo = module.get(getRepositoryToken(PlanEstudio));
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});