// src/materia/dto/update-materia.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMateriaDto } from './create-materia.dto';

export class UpdateMateriaDto extends PartialType(CreateMateriaDto) {
  // Hereda todos los campos de CreateMateriaDto pero los hace opcionales
  // Incluye planesEstudioIds como opcional para actualización
}
