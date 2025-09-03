<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
=======
// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { TestDatabaseModule } from '../test-utils/test-database.module';
>>>>>>> 47a0884 (segundo commit)

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [AuthService],
=======
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([User]), // AuthService probablemente no necesite todas las entidades, solo User si lo usa directamente
         // Si AuthService no usa directamente repositorios de User, puedes omitir TypeOrmModule.forFeature([User])
      ],
      providers: [
        AuthService,
        {
          provide: UserService, // Mockea UserService
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            // Mockea otros métodos que AuthService pueda usar
          },
        },
        {
          provide: JwtService, // Mockea JwtService
          useValue: {
            sign: jest.fn().mockReturnValue('test-jwt-token'),
            // Mockea otros métodos si es necesario
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
