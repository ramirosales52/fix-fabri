'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import axios from 'axios';

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TestPage: Cargando...');

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        console.log('TestPage - Token disponible:', !!token);
        console.log('TestPage - Usuario en localStorage:', user ? JSON.parse(user).email : 'No hay usuario');

        if (!token) {
          console.log('TestPage - No hay token');
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }

        console.log('TestPage - Haciendo petición de prueba a /materia/disponibles...');
        const response = await api.get('/materia/disponibles');
        console.log('TestPage - Respuesta recibida:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('TestPage - Error:', error);

        if (axios.isAxiosError(error)) {
          console.log('TestPage - Error axios:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
          });

          if (error.response?.status === 401) {
            setError('Error 401: No autorizado');
          } else {
            setError(`Error ${error.response?.status}: ${error.response?.data?.message || error.message}`);
          }
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
        console.log('TestPage - Carga finalizada');
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page - Autenticación</h1>
      <p>Esta página prueba la autenticación de manera aislada</p>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <p>❌ Error: {error}</p>
        </div>
      ) : data ? (
        <div style={{ color: 'green', margin: '10px 0' }}>
          <p>✅ Datos cargados exitosamente</p>
          <p>Número de materias: {data.length}</p>
          {data.length > 0 && (
            <div>
              <p>Primera materia: {data[0].nombre}</p>
              {data[0].comisiones && (
                <p>Comisiones: {data[0].comisiones.length}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No se pudieron cargar los datos</p>
      )}
    </div>
  );
}
