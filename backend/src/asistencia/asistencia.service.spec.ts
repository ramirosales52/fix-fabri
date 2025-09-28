// src/asistencia/asistencia.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { Asistencia } from './entities/asistencia.entity';
import { Clase } from '../clase/entities/clase.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { EstadoAsistencia } from './entities/asistencia.entity';

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

  // Tests adicionales para verificar funcionalidad específica
  describe('registrarAsistencia', () => {
    it('should register attendance correctly', async () => {
      // Mock de los repositorios para evitar conexión a DB
      jest.spyOn(mockClaseRepo, 'findOne').mockResolvedValue({
        id: 1,
        estado: 'realizada',
        materia: {
          id: 1,
          inscripciones: [
            { estudiante: { id: 1 } }
          ]
        }
      });
      
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez'
      });
      
      jest.spyOn(mockAsistenciaRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockAsistenciaRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockAsistenciaRepo, 'save').mockResolvedValue({
        id: 1,
        clase: { id: 1 },
        estudiante: { id: 1 },
        estado: 'presente'
      });

      const result = await service.registrarAsistencia(1, 1, EstadoAsistencia.PRESENTE);
      
      expect(result).toBeDefined();
      expect(mockClaseRepo.findOne).toHaveBeenCalled();
      expect(mockUserRepo.findOne).toHaveBeenCalled();
    });
  });

  describe('obtenerAsistenciasPorClase', () => {
    it('should return attendances by class', async () => {
      jest.spyOn(mockAsistenciaRepo, 'find').mockResolvedValue([]);
      
      const result = await service.obtenerAsistenciasPorClase(1);
      
      expect(result).toBeDefined();
      expect(mockAsistenciaRepo.find).toHaveBeenCalled();
    });
  });

  describe('obtenerAsistenciasPorEstudiante', () => {
    it('should return attendances by student', async () => {
      jest.spyOn(mockAsistenciaRepo, 'find').mockResolvedValue([]);
      
      const result = await service.obtenerAsistenciasPorEstudiante(1);
      
      expect(result).toBeDefined();
      expect(mockAsistenciaRepo.find).toHaveBeenCalled();
    });
  });

  describe('obtenerResumenAsistencias', () => {
    it('should return attendance summary', async () => {
      jest.spyOn(mockAsistenciaRepo, 'find').mockResolvedValue([]);
      
      const result = await service.obtenerResumenAsistencias(1);
      
      expect(result).toBeDefined();
      expect(mockAsistenciaRepo.find).toHaveBeenCalled();
    });
  });
});