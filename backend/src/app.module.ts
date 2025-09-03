import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- importamos TypeORM
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',        // Tipo de base de datos
      host: 'localhost',        // Host donde corre PostgreSQL (Docker)
      port: 5432,               // Puerto
      username: 'admin',        // Usuario que definiste
      password: 'admin123',     // Contraseña que definiste
      database: 'universidad',  // Nombre de la base de datos
      autoLoadEntities: true,   // Carga automáticamente las entidades
      synchronize: true,        // ⚠️ solo en desarrollo (crea tablas automáticamente)
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

