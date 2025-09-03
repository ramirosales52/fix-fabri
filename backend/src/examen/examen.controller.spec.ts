// src/examen/examen.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ExamenController } from './examen.controller';
import { ExamenService } from './examen.service';
// Si necesitas mockear el guard o sobrescribirlo
// import { JefeDeCatedraGuard } from '../auth/jefe-catedra.guard';

describe('ExamenController', () => {
  let controller: ExamenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamenController],
      providers: [
        {
          provide: ExamenService,
          useValue: {
            // Mockea los métodos reales que ExamenController usa
            inscribirse: jest.fn().mockResolvedValue({ id: 1, estado: 'inscripto' }),
            cargarNota: jest.fn().mockResolvedValue({ id: 1, nota: 8, estado: 'aprobado' }),
            verExamenes: jest.fn().mockResolvedValue([]),
            esJefeDeCatedra: jest.fn().mockResolvedValue(true), // Para el guard si es necesario
          },
        },
        // Opcional: Si necesitas probar el guard, mockealo aquí también
        // {
        //   provide: JefeDeCatedraGuard,
        //   useValue: {
        //     canActivate: jest.fn().mockResolvedValue(true), // Siempre permite el acceso
        //   },
        // },
      ],
    })
    // .overrideGuard(JefeDeCatedraGuard) // O sobrescribe el guard si es necesario
    // .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
    .compile();

    controller = module.get<ExamenController>(ExamenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
