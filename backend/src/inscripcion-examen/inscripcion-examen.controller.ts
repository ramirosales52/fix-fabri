// src/inscripcion-examen/inscripcion-examen.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InscripcionExamenService } from './inscripcion-examen.service';
import { CreateInscripcionExamenDto } from './dto/create-inscripcion-examen.dto';
import { UpdateInscripcionExamenDto } from './dto/update-inscripcion-examen.dto';
import { UserRole } from '../user/entities/user.entity';

@Controller('inscripcion-examen')
export class InscripcionExamenController {
  constructor(private readonly inscripcionExamenService: InscripcionExamenService) {}

  // 🔒 Estudiante: inscribirse a examen final
  @UseGuards(JwtAuthGuard)
  @Post()
  async inscribirse(@Body() dto: CreateInscripcionExamenDto, @Request() req) {
    // Verificar que el estudiante sea el mismo que el que quiere inscribirse
    dto.inscripcionId = req.user.inscripcionId; // Ajustar según tu estructura de usuario
    return this.inscripcionExamenService.inscribirse(dto);
  }

  // 🔒 Estudiante: ver sus inscripciones a exámenes
  @UseGuards(JwtAuthGuard)
  @Get('estudiante/:estudianteId')
  async obtenerInscripcionesPorEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.inscripcionExamenService.obtenerInscripcionesPorEstudiante(+estudianteId);
  }

  // 🔒 Estudiante: ver inscripciones por materia
  @UseGuards(JwtAuthGuard)
  @Get('materia/:materiaId')
  async obtenerInscripcionesPorMateria(@Param('materiaId') materiaId: string) {
    return this.inscripcionExamenService.obtenerInscripcionesPorMateria(+materiaId);
  }

  // 🔒 Secretaría académica: ver inscripciones por examen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Get('examen/:examenId')
  async obtenerInscripcionesPorExamen(@Param('examenId') examenId: string) {
    return this.inscripcionExamenService.obtenerInscripcionesPorExamen(+examenId);
  }

  // 🔒 Secretaría académica: actualizar estado de inscripción
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Put(':id')
  async actualizarEstado(
    @Param('id') id: string,
    @Body() dto: UpdateInscripcionExamenDto
  ) {
    return this.inscripcionExamenService.actualizarEstado(+id, dto);
  }

  // 🔒 Secretaría académica: eliminar inscripción
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECRETARIA_ACADEMICA)
  @Delete(':id')
  async removerInscripcion(@Param('id') id: string) {
    await this.inscripcionExamenService.removerInscripcion(+id);
    return { message: 'Inscripción eliminada correctamente' };
  }
}