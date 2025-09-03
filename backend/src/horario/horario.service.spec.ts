// src/horario/horario.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioService } from './horario.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Horario } from './entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Comision } from '../comision/entities/comision.entity';

describe('HorarioService', () => {
  let service: HorarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Horario, Materia, User, Comision]),
      ],
      providers: [
        HorarioService,
      ],
    }).compile();

    service = module.get<HorarioService>(HorarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
