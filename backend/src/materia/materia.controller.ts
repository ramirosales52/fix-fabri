<<<<<<< HEAD
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MateriaService, Materia } from './materia.service';
=======
// src/materia/materia.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { Materia } from './entities/materia.entity';
>>>>>>> 47a0884 (segundo commit)

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
<<<<<<< HEAD
  create(@Body() createMateriaDto: any): Materia {
=======
  create(@Body() createMateriaDto: any): Promise<Materia> {
>>>>>>> 47a0884 (segundo commit)
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
<<<<<<< HEAD
  findAll(): Materia[] {
=======
  findAll(): Promise<Materia[]> {
>>>>>>> 47a0884 (segundo commit)
    return this.materiaService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  findOne(@Param('id') id: string): Materia | undefined {
=======
  findOne(@Param('id') id: string): Promise<Materia> {
>>>>>>> 47a0884 (segundo commit)
    return this.materiaService.findOne(+id);
  }

  @Put(':id')
<<<<<<< HEAD
  update(@Param('id') id: string, @Body() updateMateriaDto: any): Materia | undefined {
=======
  update(@Param('id') id: string, @Body() updateMateriaDto: any): Promise<Materia> {
>>>>>>> 47a0884 (segundo commit)
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Delete(':id')
<<<<<<< HEAD
  remove(@Param('id') id: string): Materia | null {
=======
  remove(@Param('id') id: string): Promise<Materia> {
>>>>>>> 47a0884 (segundo commit)
    return this.materiaService.remove(+id);
  }
}