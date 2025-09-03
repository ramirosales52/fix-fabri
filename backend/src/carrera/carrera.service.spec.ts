<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { CarreraService } from './carrera.service';
=======
// src/carrera/carrera.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraService } from './carrera.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
// Importa las entidades cuyos repositorios necesita CarreraService
import { Carrera } from './entities/carrera.entity';
// Si CarreraService necesita otros repositorios (como Materia), inclúyelos
import { Materia } from '../materia/entities/materia.entity';
>>>>>>> 47a0884 (segundo commit)

describe('CarreraService', () => {
  let service: CarreraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [CarreraService],
=======
      imports: [
        TestDatabaseModule,
        // Proporciona los repositorios necesarios
        TypeOrmModule.forFeature([Carrera, Materia]), // Ajusta según las dependencias reales
      ],
      providers: [
        CarreraService,
        // Mockea otros servicios si es necesario
      ],
>>>>>>> 47a0884 (segundo commit)
    }).compile();

    service = module.get<CarreraService>(CarreraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
