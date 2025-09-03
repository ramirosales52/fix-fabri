<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
=======
// src/clase/clase.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseService } from './clase.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Clase } from './entities/clase.entity';
import { Horario } from '../horario/entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Comision } from '../comision/entities/comision.entity';
>>>>>>> 47a0884 (segundo commit)

describe('ClaseService', () => {
  let service: ClaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [ClaseService],
=======
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Clase, Horario, Materia, User, Inscripcion, Comision]),
      ],
      providers: [
        ClaseService,
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    service = module.get<ClaseService>(ClaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 47a0884 (segundo commit)
