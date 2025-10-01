// src/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TestDatabaseModule } from '../test-utils/test-database.module';
import { PlanEstudioService } from '../plan-estudio/plan-estudio.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
import { UserRole } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepo: any;
  let mockPlanEstudioService: Partial<PlanEstudioService>;

  beforeEach(async () => {
    // Crear mocks
    mockUserRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockPlanEstudioService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: PlanEstudioService,
          useValue: mockPlanEstudioService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user without plan de estudio', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudioId: undefined,
      };

      const userResult: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: undefined,
      };

      jest.spyOn(mockPlanEstudioService, 'findOne').mockImplementation(() => Promise.resolve(undefined as any));
      jest.spyOn(mockUserRepo, 'create').mockImplementation((dto: any) => ({
        id: 1,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: dto.password,
        legajo: dto.legajo,
        dni: dto.dni,
        rol: dto.rol,
        planEstudio: undefined
      }));
      jest.spyOn(mockUserRepo, 'save').mockResolvedValue(userResult);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(userResult);
      expect(mockPlanEstudioService.findOne).not.toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it('should create a user with plan de estudio', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudioId: 1,
      };

      const mockPlan = { id: 1, nombre: 'Plan Test 1' } as PlanEstudio;
      const userResult: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: mockPlan,
      };

      jest.spyOn(mockPlanEstudioService, 'findOne').mockResolvedValue(mockPlan);
      jest.spyOn(mockUserRepo, 'create').mockImplementation((dto: any) => ({
        id: 1,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: dto.password,
        legajo: dto.legajo,
        dni: dto.dni,
        rol: dto.rol,
        planEstudio: mockPlan
      }));
      jest.spyOn(mockUserRepo, 'save').mockResolvedValue(userResult);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(userResult);
      expect(mockPlanEstudioService.findOne).toHaveBeenCalledWith(1);
      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it('should throw an error if plan de estudio is not found', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudioId: 1,
      };

      jest.spyOn(mockPlanEstudioService, 'findOne').mockRejectedValue(new Error('Plan de estudio no encontrado'));

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow('Plan de estudio no encontrado');
      expect(mockPlanEstudioService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userResult: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(userResult);

      // Act
      const result = await service.findByEmail('juan.perez@example.com');

      // Assert
      expect(result).toEqual(userResult);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'juan.perez@example.com' },
        relations: ['planEstudio']
      });
    });

    it('should return undefined if user is not found', async () => {
      // Arrange
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.findByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeUndefined();
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
        relations: ['planEstudio']
      });
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userResult: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(userResult);

      // Act
      const result = await service.findById(1);

      // Assert
      expect(result).toEqual(userResult);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['planEstudio']
      });
    });

    it('should return undefined if user is not found', async () => {
      // Arrange
      jest.spyOn(mockUserRepo, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.findById(999);

      // Assert
      expect(result).toBeUndefined();
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['planEstudio']
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users: any[] = [{
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      }];
      
      jest.spyOn(mockUserRepo, 'find').mockResolvedValue(users);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(users);
      expect(mockUserRepo.find).toHaveBeenCalledWith({
        relations: ['planEstudio']
      });
    });
  });

  describe('update', () => {
    it('should update a user without changing plan de estudio', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        nombre: 'Juan Carlos'
      };
      
      const originalUser: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      const expectedUpdatedUser: any = {
        ...originalUser,
        nombre: 'Juan Carlos',
      };

      jest.spyOn(service, 'findById').mockResolvedValue(expectedUpdatedUser);
      jest.spyOn(mockUserRepo, 'update').mockResolvedValue(undefined);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result).toEqual(expectedUpdatedUser);
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, {
        nombre: 'Juan Carlos',
        planEstudio: undefined
      });
    });

    it('should update a user with a new plan de estudio', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        nombre: 'Juan Carlos',
        planEstudioId: 2,
      };

      const originalUser: any = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      const mockNewPlan = { id: 2, nombre: 'Plan Test 2' } as PlanEstudio;
      
      const expectedUpdatedUser: any = {
        ...originalUser,
        nombre: 'Juan Carlos',
        planEstudio: mockNewPlan,
      };

      jest.spyOn(mockPlanEstudioService, 'findOne').mockResolvedValue(mockNewPlan);
      jest.spyOn(service, 'findById').mockResolvedValue(expectedUpdatedUser);
      jest.spyOn(mockUserRepo, 'update').mockResolvedValue(undefined);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result).toEqual(expectedUpdatedUser);
      expect(mockPlanEstudioService.findOne).toHaveBeenCalledWith(2);
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, {
        nombre: 'Juan Carlos',
        planEstudio: mockNewPlan
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      jest.spyOn(mockUserRepo, 'delete').mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockUserRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});