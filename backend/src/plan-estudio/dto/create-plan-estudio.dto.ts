// src/plan-estudio/dto/create-plan-estudio.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePlanEstudioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNotEmpty()
  carreraId: number;
}