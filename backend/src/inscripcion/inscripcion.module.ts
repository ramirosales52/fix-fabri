// src/inscripcion/inscripcion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { Inscripcion } from './entities/inscripcion.entity';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Evaluacion } from '../evaluacion/entities/evaluacion.entity';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { InscripcionExamen } from '../inscripcion-examen/entities/inscripcion-examen.entity';
import { CorrelativasModule } from '../correlativas/correlativas.module';
import { Departamento } from '../departamento/entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inscripcion, 
      User, 
      Materia, 
      Comision, 
      Evaluacion,
      ExamenFinal,
      InscripcionExamen,
      Departamento // Agregar Departamento aquí
    ]),
    CorrelativasModule,
  ],
  providers: [InscripcionService],
  controllers: [InscripcionController],
  exports: [InscripcionService],
})
export class InscripcionModule {}