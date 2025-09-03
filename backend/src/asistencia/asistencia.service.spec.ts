<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { AsistenciaService } from './asistencia.service';
=======
// src/asistencia/asistencia.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './entities/asistencia.entity';
import { Clase } from '../clase/entities/clase.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { TestDatabaseModule } from '../test-utils/test-database.module';

// Aumentar timeout si es necesario
jest.setTimeout(15000);
>>>>>>> 47a0884 (segundo commit)

describe('AsistenciaService', () => {
  let service: AsistenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
=======
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Asistencia, Clase, User, Inscripcion]),
      ],
>>>>>>> 47a0884 (segundo commit)
      providers: [AsistenciaService],
    }).compile();

    service = module.get<AsistenciaService>(AsistenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 47a0884 (segundo commit)
