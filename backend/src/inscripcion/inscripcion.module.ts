// src/inscripcion/inscripcion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, User, Materia])],
  providers: [InscripcionService],
  controllers: [InscripcionController],
})
export class InscripcionModule {}