'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  GraduationCap,
  FileText,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalMaterias: number;
  materiasInscriptas: number;
  asistenciaPromedio: number;
  proximosExamenes: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMaterias: 0,
    materiasInscriptas: 0,
    asistenciaPromedio: 0,
    proximosExamenes: 0,
  });

  useEffect(() => {
    // Aquí cargarías las estadísticas reales desde el backend
    setStats({
      totalMaterias: 42,
      materiasInscriptas: 6,
      asistenciaPromedio: 85,
      proximosExamenes: 3,
    });
  }, []);

  const quickActions = [
    {
      title: 'Inscripción a Materias',
      description: 'Inscríbete a nuevas materias',
      icon: BookOpen,
      href: '/inscripciones',
      color: 'bg-blue-500',
    },
    {
      title: 'Mis Materias',
      description: 'Ver materias actuales',
      icon: GraduationCap,
      href: '/materias',
      color: 'bg-green-500',
    },
    {
      title: 'Horarios',
      description: 'Consulta tus horarios',
      icon: Calendar,
      href: '/horarios',
      color: 'bg-purple-500',
    },
    {
      title: 'Calificaciones',
      description: 'Ver notas y evaluaciones',
      icon: Award,
      href: '/calificaciones',
      color: 'bg-yellow-500',
    },
  ];

  const statsCards = [
    {
      title: 'Materias Totales',
      value: stats.totalMaterias,
      icon: BookOpen,
      description: 'En tu plan de estudios',
      color: 'text-blue-600',
    },
    {
      title: 'Materias Inscriptas',
      value: stats.materiasInscriptas,
      icon: GraduationCap,
      description: 'Este cuatrimestre',
      color: 'text-green-600',
    },
    {
      title: 'Asistencia',
      value: `${stats.asistenciaPromedio}%`,
      icon: TrendingUp,
      description: 'Promedio general',
      color: 'text-purple-600',
    },
    {
      title: 'Próximos Exámenes',
      value: stats.proximosExamenes,
      icon: FileText,
      description: 'En los próximos 30 días',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bienvenido, {user?.nombre}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.rol === 'estudiante' ? 'Panel de Estudiante' : 
                 user?.rol === 'profesor' ? 'Panel de Profesor' : 
                 'Panel de Administración'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Legajo: {user?.legajo}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 bg-white hover:bg-gray-100"
              >
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                {new Date().toLocaleDateString('es-AR')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link href={action.href} key={index}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                <CardTitle className="text-lg text-gray-900">{action.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Actividad Reciente</CardTitle>
              <CardDescription className="text-gray-600">Últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-800">
                {[
                  { action: 'Inscripción a Matemática II', time: 'Hace 2 horas', type: 'success' },
                  { action: 'Asistencia registrada - Física I', time: 'Hace 5 horas', type: 'info' },
                  { action: 'Nueva calificación - Programación', time: 'Ayer', type: 'warning' },
                  { action: 'Actualización de horarios', time: 'Hace 2 días', type: 'info' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Próximos Eventos</CardTitle>
              <CardDescription className="text-gray-600">Tu agenda para los próximos días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-800">
                {[
                  { event: 'Parcial - Álgebra Lineal', date: '25 Sep', time: '14:00' },
                  { event: 'Entrega TP - Base de Datos', date: '27 Sep', time: '23:59' },
                  { event: 'Clase especial - Sistemas Operativos', date: '28 Sep', time: '10:00' },
                  { event: 'Examen Final - Estadística', date: '2 Oct', time: '09:00' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.event}</p>
                      <p className="text-xs text-gray-600">{item.date} - {item.time}</p>
                    </div>
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
