'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { obtenerMisAsistencias, obtenerResumenAsistencias, AsistenciaEstudiante, ResumenAsistencias } from '@/services/asistencia.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MisAsistenciasPage() {
  const [asistencias, setAsistencias] = useState<AsistenciaEstudiante[]>([]);
  const [resumen, setResumen] = useState<ResumenAsistencias | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todas');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [misAsistencias, resumenAsistencias] = await Promise.all([
        obtenerMisAsistencias(),
        obtenerResumenAsistencias()
      ]);
      
      setAsistencias(misAsistencias);
      setResumen(resumenAsistencias);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarAsistencias = (): AsistenciaEstudiante[] => {
    const terminoBusqueda = searchTerm.toLowerCase();
    
    return asistencias.filter(asistencia => {
      // Manejo seguro del nombre de la materia
      const nombreMateria = (asistencia.materia?.nombre || '').toLowerCase();
      
      // Manejo seguro de la fecha
      let fechaFormateada = '';
      if (asistencia.fecha && typeof asistencia.fecha === 'string') {
        try {
          fechaFormateada = format(parseISO(asistencia.fecha), 'PPP', { locale: es }).toLowerCase();
        } catch (error) {
          console.error('Error al formatear la fecha:', error);
        }
      }
      
      // Búsqueda segura
      const coincideBusqueda = 
        nombreMateria.includes(terminoBusqueda) ||
        fechaFormateada.includes(terminoBusqueda);
        
      // Filtrado por pestaña activa
      
      if (activeTab === 'todas') return coincideBusqueda;
      if (activeTab === 'presentes') return asistencia.estado === 'PRESENTE' && coincideBusqueda;
      if (activeTab === 'ausentes') return asistencia.estado === 'AUSENTE' && coincideBusqueda;
      if (activeTab === 'justificadas') return asistencia.estado === 'JUSTIFICADO' && coincideBusqueda;
      
      return true;
    });
  };

  const getEstadoBadge = (estado: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' | string = 'SIN_REGISTRO') => {
    switch (estado) {
      case 'PRESENTE':
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
      case 'AUSENTE':
        return <Badge variant="destructive">Ausente</Badge>;
      case 'JUSTIFICADO':
        return <Badge className="bg-blue-100 text-blue-800">Justificado</Badge>;
      default:
        return <Badge variant="outline">Sin registro</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Asistencias</h1>
        <p className="text-gray-600">Revisa tu historial de asistencias</p>
      </div>

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{resumen.presentes}</CardTitle>
              <CardDescription>Presentes</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{resumen.ausentes}</CardTitle>
              <CardDescription>Ausencias</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{resumen.justificadas}</CardTitle>
              <CardDescription>Justificadas</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">
                {resumen.total > 0 ? Math.round((resumen.presentes / resumen.total) * 100) : 0}%
              </CardTitle>
              <CardDescription>Porcentaje de asistencia</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Historial de Asistencias</CardTitle>
              <CardDescription>
                Todas tus asistencias registradas
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por materia o fecha..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="presentes">Presentes</TabsTrigger>
              <TabsTrigger value="ausentes">Ausencias</TabsTrigger>
              <TabsTrigger value="justificadas">Justificadas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filtrarAsistencias().length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No se encontraron asistencias</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtrarAsistencias().map((asistencia) => (
                    <div 
                      key={`${asistencia.inscripcionId}-${asistencia.fecha || ''}`}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{asistencia.materia?.nombre || 'Materia no disponible'}</h3>
                          {asistencia.fecha && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(parseISO(asistencia.fecha), 'PPP', { locale: es })}
                            </div>
                          )}
                          {asistencia.justificacion && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <p className="font-medium">Justificación:</p>
                              <p>{asistencia.justificacion}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {getEstadoBadge(asistencia.estado || 'SIN_REGISTRO')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
