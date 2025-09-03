<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { MateriaService } from './materia.service';
=======
// src/materia/materia.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaService } from './materia.service';
import { Materia } from './entities/materia.entity';
import { TestDatabaseModule } from '../test-utils/test-database.module';
// Importa otras entidades que MateriaService pueda necesitar
// import { PlanEstudio } from '../plan-estudio/entities/plan-estudio.entity';
// import { User } from '../user/entities/user.entity';
// import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

// Aumentar timeout si es necesario
jest.setTimeout(15000);
>>>>>>> 47a0884 (segundo commit)

describe('MateriaService', () => {
  let service: MateriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
=======
      imports: [
        TestDatabaseModule,
        // Ajusta la lista de entidades según las necesidades reales de MateriaService
        TypeOrmModule.forFeature([Materia]), // Añade más entidades si es necesario
        // TypeOrmModule.forFeature([Materia, PlanEstudio, User, Inscripcion]),
      ],
>>>>>>> 47a0884 (segundo commit)
      providers: [MateriaService],
    }).compile();

    service = module.get<MateriaService>(MateriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 47a0884 (segundo commit)
