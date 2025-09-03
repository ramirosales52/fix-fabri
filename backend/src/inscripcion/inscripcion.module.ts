// src/inscripcion/inscripcion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionService } from './inscripcion.service';
<<<<<<< HEAD
import { InscripcionController } from './inscripcion.controller'; // ✅ Ahora exportado
=======
import { InscripcionController } from './inscripcion.controller';
>>>>>>> 47a0884 (segundo commit)
import { User } from '../user/entities/user.entity';
import { Materia } from '../materia/entities/materia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, User, Materia])],
  providers: [InscripcionService],
  controllers: [InscripcionController],
})
export class InscripcionModule {}