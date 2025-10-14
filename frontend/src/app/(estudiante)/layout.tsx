'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && user?.rol !== 'estudiante') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, loading, router, user?.rol]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Área de Estudiante</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.nombre} {user?.apellido}
            </span>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sistema de Autogestión - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
