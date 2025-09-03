<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
=======
// src/evaluacion/evaluacion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionService } from './evaluacion.service';
import { Evaluacion } from './entities/evaluacion.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity'; // Posiblemente necesaria
import { TestDatabaseModule } from '../test-utils/test-database.module';
>>>>>>> 47a0884 (segundo commit)

describe('EvaluacionService', () => {
  let service: EvaluacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
=======
      imports: [
        TestDatabaseModule,
        // Basado en el error, necesita Evaluacion, Inscripcion y User Repositories
        // Agrega Materia si también es necesaria
        TypeOrmModule.forFeature([Evaluacion, Inscripcion, User, Materia]),
      ],
>>>>>>> 47a0884 (segundo commit)
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
