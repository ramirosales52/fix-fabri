// src/materia/materia.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { Materia } from './entities/materia.entity';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  create(@Body() createMateriaDto: any): Promise<Materia> {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll(): Promise<Materia[]> {
    return this.materiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Materia> {
    return this.materiaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: any): Promise<Materia> {
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Materia> {
    return this.materiaService.remove(+id);
  }
}