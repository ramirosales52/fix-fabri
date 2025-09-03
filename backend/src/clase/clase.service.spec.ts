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

describe('ClaseService', () => {
  let service: ClaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Clase, Horario, Materia, User, Inscripcion, Comision]),
      ],
      providers: [
        ClaseService,
      ],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
