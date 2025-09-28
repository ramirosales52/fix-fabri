// src/materia/dto/create-materia.dto.ts
export class CreateMateriaDto {
  nombre: string;
  descripcion?: string;
  planesEstudioIds: number[]; // Ahora soporta múltiples planes de estudio
  departamentoId: number; // ✅ Obligatorio
}