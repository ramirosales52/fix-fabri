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
import { EstadoClase } from './entities/clase.entity';

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

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('crearClase', () => {
    it('should create a clase successfully', async () => {
      // Arrange
      const materia = {
        id: 1,
        nombre: 'Matemática',
        inscripciones: [
          { estudiante: { id: 1 } },
          { estudiante: { id: 2 } }
        ],
        comisiones: []
      };

      const horario = {
        id: 1,
        dia: 'lunes',
        horaInicio: '08:00',
        horaFin: '10:00'
      };

      const claseData = {
        materiaId: 1,
        fecha: new Date(),
        horarioId: 1,
        estado: EstadoClase.PROGRAMADA
      };

      const savedClase = {
        id: 1,
        ...claseData,
        materia,
        horario,
        comision: null,
        asistencias: []
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(mockHorarioRepo, 'findOne').mockResolvedValue(horario as any);
      jest.spyOn(mockClaseRepo, 'findOne').mockResolvedValue(null); // No hay solapamiento
      jest.spyOn(mockClaseRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockClaseRepo, 'save').mockResolvedValue(savedClase as any);

      // Act
      const result = await service.crearClase(
        claseData.materiaId,
        claseData.fecha,
        claseData.horarioId,
        undefined,
        claseData.estado
      );

      // Assert
      expect(result).toEqual(savedClase);
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['inscripciones', 'inscripciones.estudiante', 'comisiones']
      });
      expect(mockHorarioRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockClaseRepo.findOne).toHaveBeenCalledWith({
        where: {
          materia: { id: 1 },
          fecha: claseData.fecha,
        },
      });
      expect(mockClaseRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when materia not found', async () => {
      // Arrange
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.crearClase(1, new Date())).rejects.toThrow('Materia no encontrada');
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['inscripciones', 'inscripciones.estudiante', 'comisiones']
      });
    });
  });

  describe('obtenerClasesPorMateria', () => {
    it('should return clases by materia', async () => {
      // Arrange
      const clases = [
        {
          id: 1,
          fecha: new Date(),
          materia: { id: 1 },
          horario: { id: 1 },
          comision: null,
          asistencias: []
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockClaseRepo, 'find').mockResolvedValue(clases as any);

      // Act
      const result = await service.obtenerClasesPorMateria(1);

      // Assert
      expect(result).toEqual(clases);
      expect(mockClaseRepo.find).toHaveBeenCalledWith({
        where: { materia: { id: 1 } },
        relations: ['horario', 'comision', 'asistencias', 'asistencias.estudiante'],
        order: { fecha: 'DESC' },
      });
    });
  });

  describe('actualizarClase', () => {
    it('should update a clase successfully', async () => {
      // Arrange
      const existingClase = {
        id: 1,
        fecha: new Date(),
        estado: EstadoClase.PROGRAMADA,
        materia: { id: 1, inscripciones: [] },
        comision: null,
        asistencias: []
      };

      const updatedClase = {
        ...existingClase,
        estado: EstadoClase.REALIZADA
      };

      // Mock de los repositorios
      jest.spyOn(mockClaseRepo, 'findOne').mockResolvedValue(existingClase as any);
      jest.spyOn(mockClaseRepo, 'save').mockResolvedValue(updatedClase as any);

      // Act
      const result = await service.actualizarClase(
        1,
        undefined,
        EstadoClase.REALIZADA
      );

      // Assert
      expect(result).toEqual(updatedClase);
      expect(mockClaseRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante', 'comision']
      });
      expect(mockClaseRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when clase not found', async () => {
      // Arrange
      jest.spyOn(mockClaseRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.actualizarClase(1)).rejects.toThrow('Clase no encontrada');
      expect(mockClaseRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante', 'comision']
      });
    });
  });

  describe('cancelarClase', () => {
    it('should cancel a clase successfully', async () => {
      // Arrange
      const existingClase = {
        id: 1,
        estado: EstadoClase.PROGRAMADA,
        materia: { id: 1, inscripciones: [] },
        comision: null,
        asistencias: []
      };

      const cancelledClase = {
        ...existingClase,
        estado: EstadoClase.CANCELADA
      };

      // Mock de los repositorios
      jest.spyOn(mockClaseRepo, 'findOne').mockResolvedValue(existingClase as any);
      jest.spyOn(mockClaseRepo, 'save').mockResolvedValue(cancelledClase as any);

      // Act
      const result = await service.cancelarClase(1, 'Motivo de cancelación');

      // Assert
      expect(result).toEqual(cancelledClase);
      expect(mockClaseRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materia', 'materia.inscripciones', 'materia.inscripciones.estudiante', 'comision']
      });
      expect(mockClaseRepo.save).toHaveBeenCalled();
    });
  });
});