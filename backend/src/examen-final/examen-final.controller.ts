import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExamenFinalService } from './examen-final.service';
import { CreateExamenFinalDto } from './dto/create-examen-final.dto';
import { UpdateExamenFinalDto } from './dto/update-examen-final.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ExamenFinalResponseDto } from './dto/examen-final-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('examenes-finales')
@ApiBearerAuth()
@Controller('examenes-finales')
export class ExamenFinalController {
  constructor(private readonly examenFinalService: ExamenFinalService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.JEFE_CATEDRA)
  @ApiOperation({ summary: 'Crear un nuevo examen final' })
  @ApiResponse({ status: 201, description: 'Examen final creado exitosamente', type: ExamenFinalResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createExamenFinalDto: CreateExamenFinalDto): Promise<ExamenFinalResponseDto> {
    return this.examenFinalService.create(createExamenFinalDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los exámenes finales disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de exámenes finales', type: [ExamenFinalResponseDto] })
  async findAll(): Promise<ExamenFinalResponseDto[]> {
    return this.examenFinalService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un examen final por ID' })
  @ApiResponse({ status: 200, description: 'Examen final encontrado', type: ExamenFinalResponseDto })
  @ApiResponse({ status: 404, description: 'Examen final no encontrado' })
  async findOne(@Param('id') id: string): Promise<ExamenFinalResponseDto> {
    return this.examenFinalService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.JEFE_CATEDRA)
  @ApiOperation({ summary: 'Actualizar un examen final' })
  @ApiResponse({ status: 200, description: 'Examen final actualizado', type: ExamenFinalResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Examen final no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateExamenFinalDto: UpdateExamenFinalDto,
  ): Promise<ExamenFinalResponseDto> {
    return this.examenFinalService.update(+id, updateExamenFinalDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.JEFE_CATEDRA)
  @ApiOperation({ summary: 'Eliminar un examen final' })
  @ApiResponse({ status: 200, description: 'Examen final eliminado' })
  @ApiResponse({ status: 404, description: 'Examen final no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.examenFinalService.remove(+id);
  }
}
