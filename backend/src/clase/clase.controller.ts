// src/clase/clase.controller.ts
import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClaseService } from './clase.service';
import { EstadoClase } from './entities/clase.entity';
import { UserRole } from '../user/entities/user.entity';

class CrearClaseDto {
  materiaId: number;
  fecha: Date;
  horarioId?: number;
  estado?: EstadoClase;
  motivoCancelacion?: string;
}

class ActualizarClaseDto {
  fecha?: Date;
  estado?: EstadoClase;
  motivoCancelacion?: string;
}

@Controller('clase')
export class ClaseController {
  constructor(private claseService: ClaseService) {}

  // 🔒 Secretaría académica: crear clase
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Post()
  async crearClase(@Body() dto: CrearClaseDto) {
    return this.claseService.crearClase(
      dto.materiaId,
      dto.fecha,
      dto.horarioId,
      dto.estado,
      dto.motivoCancelacion,
    );
  }

  // 🔒 Todos: ver clases de una materia
  @Get('materia/:materiaId')
  async obtenerClasesPorMateria(@Param('materiaId') materiaId: string) {
    return this.claseService.obtenerClasesPorMateria(+materiaId);
  }

  // 🔒 Estudiantes: ver sus clases
  @UseGuards(JwtAuthGuard)
  @Get('mis-clases')
  async obtenerClasesPorEstudiante(@Request() req) {
    return this.claseService.obtenerClasesPorEstudiante(req.user.userId);
  }

  // 🔒 Secretaría académica: actualizar clase
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Put(':id')
  async actualizarClase(
    @Param('id') id: string,
    @Body() dto: ActualizarClaseDto,
  ) {
    return this.claseService.actualizarClase(
      +id,
      dto.fecha,
      dto.estado,
      dto.motivoCancelacion,
    );
  }

  // 🔒 Secretaría académica: cancelar clase
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Post(':id/cancelar')
  async cancelarClase(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ) {
    return this.claseService.cancelarClase(+id, motivo);
  }
}