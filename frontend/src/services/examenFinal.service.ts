import axios from 'axios';
import { getApiUrl } from '@/lib/utils';

const API_URL = getApiUrl('examenes-finales');

export interface HorarioExamen {
  horaInicio: string;
  horaFin: string;
  aula: string;
}

export interface ExamenFinal {
  id: number;
  fecha: string;
  horaInicioTeorico: string;
  horaFinTeorico: string;
  aulaTeorico: string;
  horaInicioPractico?: string;
  horaFinPractico?: string;
  aulaPractico?: string;
  materia: {
    id: number;
    nombre: string;
  };
  docente: {
    id: number;
    nombre: string;
    apellido: string;
  };
  cupo: number;
  inscriptos: number;
  disponibles: number;
  createdAt: string;
  updatedAt: string;
}

export interface InscripcionExamenFinal {
  id: number;
  estudianteId: number;
  examenFinal: ExamenFinal;
  fechaInscripcion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'ausente' | 'libre';
  nota?: number;
  observaciones?: string;
  fechaActualizacion?: string;
}

export const ExamenFinalService = {
  // Obtener todos los exámenes finales disponibles
  async getExamenesDisponibles(): Promise<ExamenFinal[]> {
    const response = await axios.get<ExamenFinal[]>(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    // Transformar la respuesta al formato esperado por el frontend
    return response.data.map(examen => ({
      ...examen,
      teorico: {
        horaInicio: examen.horaInicioTeorico,
        horaFin: examen.horaFinTeorico,
        aula: examen.aulaTeorico,
      },
      practico: examen.horaInicioPractico && examen.horaFinPractico && examen.aulaPractico ? {
        horaInicio: examen.horaInicioPractico,
        horaFin: examen.horaFinPractico,
        aula: examen.aulaPractico,
      } : undefined,
    }));
  },

  // Obtener un examen por su ID
  async getExamenById(id: number): Promise<ExamenFinal> {
    const response = await axios.get<ExamenFinal>(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    const examen = response.data;
    return {
      ...examen,
      teorico: {
        horaInicio: examen.horaInicioTeorico,
        horaFin: examen.horaFinTeorico,
        aula: examen.aulaTeorico,
      },
      practico: examen.horaInicioPractico && examen.horaFinPractico && examen.aulaPractico ? {
        horaInicio: examen.horaInicioPractico,
        horaFin: examen.horaFinPractico,
        aula: examen.aulaPractico,
      } : undefined,
    };
  },

  // Inscribirse a un examen final
  async inscribirAExamen(
    examenFinalId: number,
    estudianteId: number
  ): Promise<InscripcionExamenFinal> {
    const response = await axios.post<InscripcionExamenFinal>(
      `${API_URL}/${examenFinalId}/inscribir`,
      { estudianteId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Obtener las inscripciones de un estudiante
  async getInscripcionesEstudiante(estudianteId: number): Promise<InscripcionExamenFinal[]> {
    const response = await axios.get<InscripcionExamenFinal[]>(
      `${API_URL}/estudiante/${estudianteId}/inscripciones`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    
    // Transformar la respuesta al formato esperado por el frontend
    return response.data.map(inscripcion => ({
      ...inscripcion,
      examenFinal: {
        ...inscripcion.examenFinal,
        teorico: {
          horaInicio: inscripcion.examenFinal.horaInicioTeorico,
          horaFin: inscripcion.examenFinal.horaFinTeorico,
          aula: inscripcion.examenFinal.aulaTeorico,
        },
        practico: inscripcion.examenFinal.horaInicioPractico && 
                 inscripcion.examenFinal.horaFinPractico && 
                 inscripcion.examenFinal.aulaPractico ? {
          horaInicio: inscripcion.examenFinal.horaInicioPractico,
          horaFin: inscripcion.examenFinal.horaFinPractico,
          aula: inscripcion.examenFinal.aulaPractico,
        } : undefined,
      },
    }));
  },

  // Cancelar inscripción a un examen final
  async cancelarInscripcion(inscripcionId: number): Promise<void> {
    await axios.delete(`${API_URL}/inscripciones/${inscripcioncionId}`);
  }
};
