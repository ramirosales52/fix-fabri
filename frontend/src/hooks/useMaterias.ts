import { useState, useEffect } from 'react';

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  creditos: number;
  horasSemanales: number;
  carreraId: number;
  planEstudioId: number;
  año: number;
  cuatrimestre: number;
  correlativas: number[];
}

export function useMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/materias');
        // const data = await response.json();
        // setMaterias(data);
        
        // Mock data for development
        const mockMaterias: Materia[] = [
          {
            id: 1,
            nombre: 'Matemática I',
            codigo: 'MAT1',
            descripcion: 'Introducción a las matemáticas universitarias',
            creditos: 8,
            horasSemanales: 6,
            carreraId: 1,
            planEstudioId: 1,
            año: 1,
            cuatrimestre: 1,
            correlativas: []
          },
          {
            id: 2,
            nombre: 'Física I',
            codigo: 'FIS1',
            descripcion: 'Fundamentos de física',
            creditos: 6,
            horasSemanales: 6,
            carreraId: 1,
            planEstudioId: 1,
            año: 1,
            cuatrimestre: 1,
            correlativas: []
          },
          // Add more mock data as needed
        ];
        
        setMaterias(mockMaterias);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchMaterias();
  }, []);

  return { materias, loading, error };
}
