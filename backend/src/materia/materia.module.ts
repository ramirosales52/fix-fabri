import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';


@Module({
  providers: [MateriaService],
  controllers: [MateriaController]
})
export class MateriaModule {}
