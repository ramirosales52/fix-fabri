// src/materia/materia.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto): Promise<Materia> {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll(): Promise<Materia[]> {
    return this.materiaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('disponibles')
  async findMateriasDisponibles(@Request() req): Promise<Materia[]> {
    return this.materiaService.findMateriasDisponibles(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Materia> {
    return this.materiaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Materia> {
    return this.materiaService.remove(+id);
  }
}