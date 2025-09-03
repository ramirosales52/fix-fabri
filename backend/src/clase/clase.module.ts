// src/clase/clase.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from './entities/clase.entity';
import { Horario } from '../horario/entities/horario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity'; // ✅ Importa Inscripcion
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';

@Module({
  imports: [
<<<<<<< HEAD
    // ✅ IMPORTANTE: Incluye Inscripcion aquí
=======
>>>>>>> 47a0884 (segundo commit)
    TypeOrmModule.forFeature([Clase, Horario, Materia, User, Inscripcion]),
  ],
  providers: [ClaseService],
  controllers: [ClaseController],
  exports: [ClaseService],
})
export class ClaseModule {}