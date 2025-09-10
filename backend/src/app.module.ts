// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MateriaModule } from './materia/materia.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { ExamenModule } from './examen/examen.module';
import { CarreraModule } from './carrera/carrera.module';
import { PlanEstudioModule } from './plan-estudio/plan-estudio.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { HorarioModule } from './horario/horario.module';
import { ClaseModule } from './clase/clase.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { ComisionModule } from './comision/comision.module';
import { InscripcionExamenModule } from './inscripcion-examen/inscripcion-examen.module';
import { EstadoAcademicoModule } from './estado-academico/estado-academico.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'testpass',
      database: 'testdb',
      autoLoadEntities: true,  // ✅ Esta línea es crucial
      synchronize: true,
      logging: false,
      ssl: false,
      connectTimeoutMS: 10000,
    }),
    UserModule,
    AuthModule,
    MateriaModule,
    InscripcionModule,
    ExamenModule,
    CarreraModule,
    PlanEstudioModule,
    EvaluacionModule,
    HorarioModule,
    ClaseModule,
    AsistenciaModule,
    ComisionModule,
    InscripcionExamenModule,
    EstadoAcademicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}