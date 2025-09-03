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
  let mockPlanEstudioService: PlanEstudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        UserService,
        {
          provide: PlanEstudioService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserRepo = module.get(getRepositoryToken(User));
    mockPlanEstudioService = module.get<PlanEstudioService>(PlanEstudioService);
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

      // Creamos un objeto resultado parcial
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

      // Para el caso donde planEstudioId es undefined, no llamamos a findOne
      jest.spyOn(mockPlanEstudioService, 'findOne');
      jest.spyOn(mockUserRepo, 'create').mockImplementation((dto: any) => {
        // Creamos un objeto básico sin planEstudio
        return {
          id: 1,
          nombre: dto.nombre,
          apellido: dto.apellido,
          email: dto.email,
          password: dto.password,
          legajo: dto.legajo,
          dni: dto.dni,
          rol: dto.rol,
          planEstudio: undefined
        };
      });
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
      // Creamos un objeto resultado parcial
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
      jest.spyOn(mockUserRepo, 'create').mockImplementation((dto: any) => {
        // Verificamos que dto tenga las propiedades esperadas antes de usarlas
        if (dto && typeof dto === 'object') {
          return {
            id: 1,
            nombre: dto.nombre,
            apellido: dto.apellido,
            email: dto.email,
            password: dto.password,
            legajo: dto.legajo,
            dni: dto.dni,
            rol: dto.rol,
            planEstudio: mockPlan
          };
        }
        // Valor por defecto si dto no es válido
        return {
          id: 1,
          planEstudio: mockPlan
        };
      });
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

      // Mockeamos findOne para que rechace con un error
      jest.spyOn(mockPlanEstudioService, 'findOne').mockRejectedValue(new Error('Plan de estudio no encontrado'));

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow('Plan de estudio no encontrado');
      expect(mockPlanEstudioService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      // Arrange
      // Creamos un objeto resultado parcial
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
      // Creamos un objeto resultado parcial
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
      // Creamos un array de objetos resultado parciales
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
      
      // Creamos el usuario original (antes de la actualización)
      const originalUser: any = {
        id: 1,
        nombre: 'Juan', // Nombre original
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      // Creamos el usuario esperado después de la actualización
      const expectedUpdatedUser: any = {
        ...originalUser,
        nombre: 'Juan Carlos', // Nombre actualizado
      };

      // Mockeamos findById para que devuelva el usuario actualizado
      // Esta es la solución clave: siempre devolver el usuario actualizado
      jest.spyOn(service, 'findById').mockResolvedValue(expectedUpdatedUser);
      
      // Mockeamos update para que no haga nada (simula éxito)
      jest.spyOn(mockUserRepo, 'update').mockResolvedValue(undefined);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result).toEqual(expectedUpdatedUser);
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, {
        nombre: 'Juan Carlos',
        planEstudio: undefined // Porque no se envió planEstudioId
      });
    });

    it('should update a user with a new plan de estudio', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        nombre: 'Juan Carlos',
        planEstudioId: 2, // Cambiamos el plan de estudio
      };

      // Creamos el usuario original (antes de la actualización)
      const originalUser: any = {
        id: 1,
        nombre: 'Juan', // Nombre original
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        legajo: '12345',
        dni: '12345678',
        rol: UserRole.ESTUDIANTE,
        planEstudio: { id: 1, nombre: 'Plan Test 1' } as PlanEstudio,
      };
      
      const mockNewPlan = { id: 2, nombre: 'Plan Test 2' } as PlanEstudio;
      
      // Creamos el usuario esperado después de la actualización
      const expectedUpdatedUser: any = {
        ...originalUser,
        nombre: 'Juan Carlos', // Nombre actualizado
        planEstudio: mockNewPlan, // Plan de estudio actualizado
      };

      // Mockeamos los servicios
      jest.spyOn(mockPlanEstudioService, 'findOne').mockResolvedValue(mockNewPlan);
      
      // Mockeamos findById para que devuelva el usuario actualizado
      jest.spyOn(service, 'findById').mockResolvedValue(expectedUpdatedUser);
      
      // Mockeamos update para que no haga nada (simula éxito)
      jest.spyOn(mockUserRepo, 'update').mockResolvedValue(undefined);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result).toEqual(expectedUpdatedUser);
      expect(mockPlanEstudioService.findOne).toHaveBeenCalledWith(2);
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, {
        nombre: 'Juan Carlos',
        planEstudio: mockNewPlan // El nuevo plan de estudio
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
