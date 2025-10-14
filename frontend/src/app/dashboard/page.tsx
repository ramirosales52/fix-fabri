'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EstudianteDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bienvenido/a, {user?.nombre} {user?.apellido}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Materias Inscriptas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Materias Inscriptas</h2>
          <p className="text-gray-600">Ver y gestionar tus materias inscriptas</p>
          <button 
            onClick={() => router.push('/materias')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Ver materias
          </button>
        </div>

        {/* Card 2: Asistencias */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Asistencias</h2>
          <p className="text-gray-600">Consulta tu registro de asistencias</p>
          <button 
            onClick={() => router.push('/calificaciones')}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Ver asistencias
          </button>
        </div>

        {/* Card 3: Exámenes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Exámenes</h2>
          <p className="text-gray-600">Consulta tus exámenes y notas</p>
          <button 
            onClick={() => router.push('/examenes')}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Ver exámenes
          </button>
        </div>
      </div>
    </div>
  );
}
