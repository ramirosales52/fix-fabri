export class MateriaResponseDto {
    id: number;
    nombre: string;
    descripcion?: string;
    departamento: {
      id: number;
      nombre: string;
    };
    planesEstudio: {
      planEstudioId: number;
      planEstudioNombre: string;
      nivel: number;
      carrera: {
        id: number;
        nombre: string;
      };
    }[];
  }