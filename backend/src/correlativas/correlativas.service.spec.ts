// src/correlativas/correlativas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CorrelativasService } from './correlativas.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Materia } from '../materia/entities/materia.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

describe('CorrelativasService', () => {
  let service: CorrelativasService;
  let mockMateriaRepo: any;
  let mockInscripcionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          Materia, 
          Inscripcion
        ]),
      ],
      providers: [
        CorrelativasService,
      ],
    }).compile();

    service = module.get<CorrelativasService>(CorrelativasService);
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});