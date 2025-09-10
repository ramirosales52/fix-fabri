// src/clase/clase.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
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
  let mockClaseRepo: any;
  let mockMateriaRepo: any;
  let mockHorarioRepo: any;
  let mockUserRepo: any;
  let mockInscripcionRepo: any;
  let mockComisionRepo: any;

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
    mockClaseRepo = module.get(getRepositoryToken(Clase));
    mockMateriaRepo = module.get(getRepositoryToken(Materia));
    mockHorarioRepo = module.get(getRepositoryToken(Horario));
    mockUserRepo = module.get(getRepositoryToken(User));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
    mockComisionRepo = module.get(getRepositoryToken(Comision));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});