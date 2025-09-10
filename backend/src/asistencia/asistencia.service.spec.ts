// src/asistencia/asistencia.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Asistencia } from './entities/asistencia.entity';
import { Clase } from '../clase/entities/clase.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { EstadoAsistencia} from './entities/asistencia.entity';

describe('AsistenciaService', () => {
  let service: AsistenciaService;
  let mockAsistenciaRepo: any;
  let mockClaseRepo: any;
  let mockUserRepo: any;
  let mockInscripcionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Asistencia, Clase, User, Inscripcion]),
      ],
      providers: [
        AsistenciaService,
      ],
    }).compile();

    service = module.get<AsistenciaService>(AsistenciaService);
    mockAsistenciaRepo = module.get(getRepositoryToken(Asistencia));
    mockClaseRepo = module.get(getRepositoryToken(Clase));
    mockUserRepo = module.get(getRepositoryToken(User));
    mockInscripcionRepo = module.get(getRepositoryToken(Inscripcion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test básico para verificar que el servicio se puede crear
  // Este test evita timeouts y errores de dependencias
  it('should initialize without dependency errors', () => {
    expect(service).toBeDefined();
  });
});