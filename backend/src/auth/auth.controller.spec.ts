<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
=======
// src/auth/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
>>>>>>> 47a0884 (segundo commit)

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: AuthService,
          useValue: {
            // Mockea los métodos reales que AuthController usa
            register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
            login: jest.fn().mockResolvedValue({ access_token: 'mock-token' }),
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
