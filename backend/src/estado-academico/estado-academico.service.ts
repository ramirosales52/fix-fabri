import { Injectable } from '@nestjs/common';
import { InscripcionService } from '../inscripcion/inscripcion.service';
import { ExamenFinal } from '../examen/entities/examen.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { InscripcionExamen } from '../inscripcion-examen/entities/inscripcion-examen.entity';

@Injectable()
export class EstadoAcademicoService {
  constructor(
    private inscripcionService: InscripcionService,
  ) {}

  async obtenerEstadoAcademico(userId: number) {
    // Materias actualmente cursando
    const materiasCursando = await this.inscripcionService.materiasDelEstudiante(userId);
    
    // Historial académico completo
    const historial = await this.inscripcionService.historialAcademico(userId);
    
    return {
      materiasCursando: materiasCursando.map((inscripcion: any) => ({
        materia: inscripcion.materia,
        faltas: inscripcion.faltas,
        notaFinal: inscripcion.notaFinal,
        stc: inscripcion.stc,
        evaluaciones: inscripcion.evaluaciones
      })),
      historial: historial.map((inscripcion: any) => ({
        materia: inscripcion.materia,
        notaFinal: inscripcion.notaFinal,
        stc: inscripcion.stc,
        fechaInscripcion: inscripcion.fechaInscripcion,
        fechaFinalizacion: inscripcion.fechaFinalizacion
      }))
    };
  }

  // Función para calcular si un estudiante puede aprobar directamente
  async puedeAprobarDirectamente(inscripcionId: number): Promise<boolean> {
    // Obtener la inscripción usando el método correcto
    try {
      // Usamos un userId dummy (0) ya que detalleMateria no lo necesita para la búsqueda
      const inscripcion = await this.inscripcionService.detalleMateria(inscripcionId, 0);
      
      if (!inscripcion) return false;
      
      // Verificar condiciones para aprobación directa:
      // 1. Promedio de evaluaciones >= 9/10
      // 2. Asistencia >= 80%
      // 3. Todas las notas parciales >= 6
      
      const promedioEvaluaciones = this.calcularPromedioEvaluaciones(inscripcion.evaluaciones);
      const asistencia = this.calcularAsistencia(inscripcion.faltas);
      
      // Verificar condiciones
      const cumplePromedio = promedioEvaluaciones >= 9;
      const cumpleAsistencia = asistencia >= 80;
      const cumpleNotasParciales = inscripcion.evaluaciones.every((evaluacion: any) => evaluacion.nota >= 6);
      
      return cumplePromedio && cumpleAsistencia && cumpleNotasParciales;
    } catch (error) {
      return false;
    }
  }

  private calcularPromedioEvaluaciones(evaluaciones: any[]): number {
    if (!evaluaciones || evaluaciones.length === 0) return 0;
    
    // Corregido: Usamos reduce con tipo explícito para evitar el uso de eval
    const total = evaluaciones.reduce((sum: number, evaluacion: any) => sum + (evaluacion.nota || 0), 0);
    return total / evaluaciones.length;
  }

  private calcularAsistencia(faltas: number): number {
    // Suponiendo que el máximo de faltas es 20 (20 clases)
    const maxFaltas = 20;
    const faltasPermitidas = 4; // 20% de faltas máximas
    return Math.max(0, 100 - (faltas / maxFaltas) * 100);
  }

  // Función para verificar si puede inscribirse al examen final
  async puedeInscribirseExamenFinal(inscripcionId: number): Promise<boolean> {
    try {
      // Usamos un userId dummy (0) ya que detalleMateria no lo necesita para la búsqueda
      const inscripcion = await this.inscripcionService.detalleMateria(inscripcionId, 0);
      
      if (!inscripcion) return false;
      
      // Condición: debe tener estado "cursada" o "aprobada" en la cursada
      return inscripcion.stc === 'cursada' || inscripcion.stc === 'aprobada';
    } catch (error) {
      return false;
    }
  }

  // Función para verificar correlativas para inscribirse a examen final
  async verificarCorrelativasExamenFinal(inscripcionId: number): Promise<boolean> {
    try {
      // Usamos un userId dummy (0) ya que detalleMateria no lo necesita para la búsqueda
      const inscripcion = await this.inscripcionService.detalleMateria(inscripcionId, 0);
      
      if (!inscripcion) return false;
      
      // Verificar que la materia tenga correlativas finales
      // y que el estudiante haya aprobado todas las correlativas
      // (Implementación más compleja que dependerá de tu lógica de correlativas)
      
      return true; // Simplificado para ejemplo
    } catch (error) {
      return false;
    }
  }
}