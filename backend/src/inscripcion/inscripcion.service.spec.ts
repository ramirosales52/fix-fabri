<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionService } from './inscripcion.service';
=======
// src/inscripcion/inscripcion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionService } from './inscripcion.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
>>>>>>> 47a0884 (segundo commit)

describe('InscripcionService', () => {
  let service: InscripcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [InscripcionService],
=======
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Inscripcion, User, Materia, Comision]),
      ],
      providers: [
        InscripcionService,
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    service = module.get<InscripcionService>(InscripcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 47a0884 (segundo commit)
