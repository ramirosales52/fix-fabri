<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
=======
// src/user/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
>>>>>>> 47a0884 (segundo commit)

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
<<<<<<< HEAD
=======
      providers: [
        {
          provide: UserService,
          useValue: {
            // Mockea los métodos del servicio que el controlador utiliza
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
<<<<<<< HEAD
});
=======
  
  // Aquí podrías agregar más tests específicos del controlador
  // una vez que implementes los endpoints
});
>>>>>>> 47a0884 (segundo commit)
