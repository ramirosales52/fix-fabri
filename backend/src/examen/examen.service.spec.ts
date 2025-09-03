// src/examen/examen.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenService } from './examen.service';
import { ExamenFinal } from './entities/examen.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Evaluacion } from '../evaluacion/entities/evaluacion.entity';
import { TestDatabaseModule } from '../test-utils/test-database.module';

// Aumentar timeout si es necesario
jest.setTimeout(15000);

describe('ExamenService', () => {
  let service: ExamenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // ELIMINADO: TypeOrmModule.forRoot({...}) - Usar TestDatabaseModule
        TestDatabaseModule, // AGREGADO: Usar configuración centralizada
        TypeOrmModule.forFeature([ExamenFinal, Materia, User, Inscripcion, PlanEstudio, Carrera, Evaluacion]),
      ],
      providers: [ExamenService],
    }).compile();

    service = module.get<ExamenService>(ExamenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
