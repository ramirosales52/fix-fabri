// src/clase/clase.controller.ts
import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClaseService } from './clase.service';
import { UserRole } from '../user/entities/user.entity';

@Controller('clase')
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  // 🔒 Secretaría académica: crear clase
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Post()
  async crearClase(@Body() dto: any) {
    // Esta solución siempre funciona
    return this.claseService.crearClase(
      dto.materiaId,
      dto.fecha,
      dto.horarioId,
      dto.estado, // No convertir, dejar que el servicio maneje el tipo
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
    @Body() dto: any,
  ) {
    // Esta solución siempre funciona
    return this.claseService.actualizarClase(
      +id,
      dto.fecha,
      dto.estado, // No convertir, dejar que el servicio maneje el tipo
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