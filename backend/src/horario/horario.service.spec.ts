// src/horario/horario.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HorarioService } from './horario.service';
import { Horario } from './entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Comision } from '../comision/entities/comision.entity';
import { DiaSemana } from './entities/horario.entity';

describe('HorarioService', () => {
  let service: HorarioService;
  let mockHorarioRepo: any;
  let mockMateriaRepo: any;
  let mockUserRepo: any;
  let mockInscripcionRepo: any;
  let mockComisionRepo: any;

  beforeEach(async () => {
    // Crear mocks de repositorios
    mockHorarioRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      remove: jest.fn(),
    };

    mockMateriaRepo = {
      findOne: jest.fn(),
    };

    mockUserRepo = {
      findOne: jest.fn(),
    };

    mockInscripcionRepo = {
      find: jest.fn(),
    };

    mockComisionRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorarioService,
        {
          provide: getRepositoryToken(Horario),
          useValue: mockHorarioRepo,
        },
        {
          provide: getRepositoryToken(Materia),
          useValue: mockMateriaRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Inscripcion),
          useValue: mockInscripcionRepo,
        },
        {
          provide: getRepositoryToken(Comision),
          useValue: mockComisionRepo,
        },
      ],
    }).compile();

    service = module.get<HorarioService>(HorarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests específicos para verificar funcionalidad sin conexión real
  describe('crearHorario', () => {
    it('should create a schedule successfully', async () => {
      // Arrange
      const materiaId = 1;
      const dia = DiaSemana.LUNES;
      const horaInicio = '08:00';
      const horaFin = '10:00';
      const aula = 'Aula 101';
      
      const materia = {
        id: materiaId,
        nombre: 'Matemática'
      };

      const savedHorario = {
        id: 1,
        materia,
        dia,
        horaInicio,
        horaFin,
        aula,
        comision: null,
        docente: null
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(service as any, 'verificarSolapamiento').mockResolvedValue(false);
      jest.spyOn(mockHorarioRepo, 'create').mockImplementation((data) => data);
      jest.spyOn(mockHorarioRepo, 'save').mockResolvedValue(savedHorario as any);

      // Act
      const result = await service.crearHorario(
        materiaId,
        dia,
        horaInicio,
        horaFin,
        aula
      );

      // Assert
      expect(result).toEqual(savedHorario);
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id: materiaId } });
      expect((service as any).verificarSolapamiento).toHaveBeenCalledWith(
        materiaId,
        dia,
        horaInicio,
        horaFin,
        undefined,
        undefined
      );
      expect(mockHorarioRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when materia not found', async () => {
      // Arrange
      const materiaId = 1;
      
      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.crearHorario(
        materiaId,
        DiaSemana.LUNES,
        '08:00',
        '10:00',
        'Aula 101'
      )).rejects.toThrow('Materia no encontrada');
      
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id: materiaId } });
    });

    it('should throw BadRequestException when schedule overlaps', async () => {
      // Arrange
      const materiaId = 1;
      const dia = DiaSemana.LUNES;
      const horaInicio = '08:00';
      const horaFin = '10:00';
      
      const materia = {
        id: materiaId,
        nombre: 'Matemática'
      };

      // Mock de los repositorios
      jest.spyOn(mockMateriaRepo, 'findOne').mockResolvedValue(materia as any);
      jest.spyOn(service as any, 'verificarSolapamiento').mockResolvedValue(true);

      // Act & Assert
      await expect(service.crearHorario(
        materiaId,
        dia,
        horaInicio,
        horaFin,
        'Aula 101'
      )).rejects.toThrow('Ya existe un horario programado para este día y hora');
      
      expect(mockMateriaRepo.findOne).toHaveBeenCalledWith({ where: { id: materiaId } });
      expect((service as any).verificarSolapamiento).toHaveBeenCalledWith(
        materiaId,
        dia,
        horaInicio,
        horaFin,
        undefined,
        undefined
      );
    });
  });

  describe('verificarSolapamiento', () => {
    it('should return false when no overlap found', async () => {
      // Arrange
      const materiaId = 1;
      const dia = DiaSemana.LUNES;
      const horaInicio = '08:00';
      const horaFin = '10:00';
      
      // Mock del QueryBuilder
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };
      
      jest.spyOn(mockHorarioRepo, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      // Act
      const result = await service['verificarSolapamiento'](
        materiaId,
        dia,
        horaInicio,
        horaFin
      );

      // Assert
      expect(result).toBe(false);
      expect(mockHorarioRepo.createQueryBuilder).toHaveBeenCalledWith('horario');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('horario.dia = :dia', { dia });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('(horario.horaInicio < :horaFin AND horario.horaFin > :horaInicio)', { 
        horaInicio, 
        horaFin 
      });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return true when overlap found', async () => {
      // Arrange
      const materiaId = 1;
      const dia = DiaSemana.LUNES;
      const horaInicio = '08:00';
      const horaFin = '10:00';
      
      const existingHorario = {
        id: 1,
        materia: { id: materiaId },
        dia,
        horaInicio,
        horaFin
      };

      // Mock del QueryBuilder
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(existingHorario)
      };
      
      jest.spyOn(mockHorarioRepo, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      // Act
      const result = await service['verificarSolapamiento'](
        materiaId,
        dia,
        horaInicio,
        horaFin
      );

      // Assert
      expect(result).toBe(true);
      expect(mockHorarioRepo.createQueryBuilder).toHaveBeenCalledWith('horario');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('horario.dia = :dia', { dia });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('(horario.horaInicio < :horaFin AND horario.horaFin > :horaInicio)', { 
        horaInicio, 
        horaFin 
      });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });

  describe('obtenerHorariosPorMateria', () => {
    it('should return schedules by subject', async () => {
      // Arrange
      const materiaId = 1;
      
      const horarios = [
        {
          id: 1,
          dia: DiaSemana.LUNES,
          horaInicio: '08:00',
          horaFin: '10:00',
          aula: 'Aula 101',
          materia: { id: materiaId },
          comision: { id: 1, nombre: 'Comisión A' },
          docente: { id: 1, nombre: 'Profesor', apellido: 'Apellido' }
        }
      ];

      // Mock del repositorio
      jest.spyOn(mockHorarioRepo, 'find').mockResolvedValue(horarios as any);

      // Act
      const result = await service.obtenerHorariosPorMateria(materiaId);

      // Assert
      expect(result).toEqual(horarios);
      expect(mockHorarioRepo.find).toHaveBeenCalledWith({
        where: { materia: { id: materiaId } },
        relations: ['comision', 'docente'],
        order: { dia: 'ASC', horaInicio: 'ASC' },
      });
    });
  });

  describe('actualizarHorario', () => {
    it('should update schedule successfully', async () => {
      // Arrange
      const id = 1;
      const dia = DiaSemana.MARTES;
      const horaInicio = '10:00';
      const horaFin = '12:00';
      const aula = 'Aula 202';
      
      const existingHorario = {
        id,
        dia: DiaSemana.LUNES,
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: 'Aula 101',
        materia: { id: 1 },
        comision: null,
        docente: null
      };

      const updatedHorario = {
        ...existingHorario,
        dia,
        horaInicio,
        horaFin,
        aula
      };

      // Mock de los repositorios
      jest.spyOn(mockHorarioRepo, 'findOne').mockResolvedValue(existingHorario as any);
      jest.spyOn(service as any, 'verificarSolapamiento').mockResolvedValue(false);
      jest.spyOn(mockHorarioRepo, 'save').mockResolvedValue(updatedHorario as any);

      // Act
      const result = await service.actualizarHorario(
        id,
        dia,
        horaInicio,
        horaFin,
        aula
      );

      // Assert
      expect(result).toEqual(updatedHorario);
      expect(mockHorarioRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['materia']
      });
      expect((service as any).verificarSolapamiento).toHaveBeenCalledWith(
        existingHorario.materia.id,
        dia,
        horaInicio,
        horaFin,
        undefined,
        undefined
      );
      expect(mockHorarioRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when schedule not found', async () => {
      // Arrange
      const id = 1;
      
      // Mock del repositorio
      jest.spyOn(mockHorarioRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.actualizarHorario(id)).rejects.toThrow('Horario no encontrado');
      expect(mockHorarioRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['materia']
      });
    });
  });

  describe('eliminarHorario', () => {
    it('should delete schedule successfully', async () => {
      // Arrange
      const id = 1;
      
      const horario = {
        id,
        materia: { id: 1 }
      };

      // Mock del repositorio
      jest.spyOn(mockHorarioRepo, 'findOne').mockResolvedValue(horario as any);
      jest.spyOn(mockHorarioRepo, 'remove').mockResolvedValue(undefined);

      // Act
      await service.eliminarHorario(id);

      // Assert
      expect(mockHorarioRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockHorarioRepo.remove).toHaveBeenCalledWith(horario);
    });

    it('should throw NotFoundException when schedule not found', async () => {
      // Arrange
      const id = 1;
      
      // Mock del repositorio
      jest.spyOn(mockHorarioRepo, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.eliminarHorario(id)).rejects.toThrow('Horario no encontrado');
      expect(mockHorarioRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});