import { Module } from '@nestjs/common';
import { EstadoAcademicoController } from './estado-academico.controller';
import { EstadoAcademicoService } from './estado-academico.service';
import { InscripcionModule } from '../inscripcion/inscripcion.module';

@Module({
  imports: [InscripcionModule],
  controllers: [EstadoAcademicoController],
  providers: [EstadoAcademicoService],
  exports: [EstadoAcademicoService],
})
export class EstadoAcademicoModule {}