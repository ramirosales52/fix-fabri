<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioService } from './plan-estudio.service';
=======
// src/plan-estudio/plan-estudio.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEstudioService } from './plan-estudio.service';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Materia } from '../materia/entities/materia.entity'; // Si PlanEstudio tiene relación con Materia
import { TestDatabaseModule } from '../test-utils/test-database.module';
>>>>>>> 47a0884 (segundo commit)

describe('PlanEstudioService', () => {
  let service: PlanEstudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
=======
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([PlanEstudio, Carrera, Materia]),
      ],
>>>>>>> 47a0884 (segundo commit)
      providers: [PlanEstudioService],
    }).compile();

    service = module.get<PlanEstudioService>(PlanEstudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
