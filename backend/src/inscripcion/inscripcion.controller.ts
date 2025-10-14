import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { InscripcionService } from './inscripcion.service';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';

@ApiTags('Inscripciones')
@Controller('inscripcion')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class InscripcionController {
  constructor(private inscripcionService: InscripcionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTUDIANTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Ver materias disponibles para inscripción" })
  @ApiResponse({ status: 200, description: "Materias disponibles", type: [Object] })
  @ApiResponse({ status: 401, description: "No autorizado", type: ApiErrorResponseDto })
  @Get("materia/disponibles")
  async materiasDisponibles(@Request() req) {
    return this.inscripcionService.materiasDisponibles(req.user.userId);
  }

  @ApiOperation({ summary: 'Ver historial académico del estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Historial académico', type: [InscripcionResponseDto] })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Get('historial')
  async historialAcademico(@Request() req) {
    return this.inscripcionService.historialAcademico(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTUDIANTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver materias que el estudiante está cursando' })
  @ApiResponse({ status: 200, description: 'Materias en curso', type: [InscripcionResponseDto] })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Get('cursando')
  async materiasDelEstudiante(@Request() req) {
    return this.inscripcionService.materiasDelEstudiante(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTUDIANTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscribirse a una materia' })
  @ApiParam({ name: 'materiaId', type: Number })
  @ApiResponse({ status: 201, description: 'Inscripción creada', type: InscripcionResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o correlativas faltantes', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Post('materia/:materiaId')
  async inscribirse(@Request() req, @Param('materiaId') materiaId: string) {
    return this.inscripcionService.inscribirse(req.user.userId, +materiaId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cargar faltas para una inscripción' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { faltas: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Inscripción actualizada', type: InscripcionResponseDto })
  @ApiResponse({ status: 400, description: 'Inscripción no encontrada', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Post(':id/faltas')
  async cargarFaltas(@Param('id') id: string, @Body('faltas') faltas: number, @Request() req) {
    return this.inscripcionService.cargarFaltas(+id, faltas, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cargar nota final y STC para una inscripción' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { notaFinal: { type: 'number' }, stc: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Inscripción actualizada', type: InscripcionResponseDto })
  @ApiResponse({ status: 400, description: 'Inscripción no encontrada', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Post(':id/nota')
  async cargarNota(
    @Param('id') id: string,
    @Body('notaFinal') notaFinal: number,
    @Body('stc') stc: string,
    @Request() req,
  ) {
    return this.inscripcionService.cargarNota(+id, notaFinal, stc, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTUDIANTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver detalle de una inscripción propia' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detalle de inscripción', type: InscripcionResponseDto })
  @ApiResponse({ status: 400, description: 'Inscripción no encontrada o no pertenece al usuario', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ApiErrorResponseDto })
  @Get(':id')
  async detalleMateria(@Param('id') id: string, @Request() req) {
    return this.inscripcionService.detalleMateria(+id, req.user.userId);
  }
}
