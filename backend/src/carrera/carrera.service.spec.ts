// src/carrera/carrera.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraService } from './carrera.service';
import { TestDatabaseModule } from '../test-utils/test-database.module';
// Importa las entidades cuyos repositorios necesita CarreraService
import { Carrera } from './entities/carrera.entity';
// Si CarreraService necesita otros repositorios (como Materia), inclúyelos
import { Materia } from '../materia/entities/materia.entity';

describe('CarreraService', () => {
  let service: CarreraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        // Proporciona los repositorios necesarios
        TypeOrmModule.forFeature([Carrera, Materia]), // Ajusta según las dependencias reales
      ],
      providers: [
        CarreraService,
        // Mockea otros servicios si es necesario
      ],
    }).compile();

    service = module.get<CarreraService>(CarreraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
