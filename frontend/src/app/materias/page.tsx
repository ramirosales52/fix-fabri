'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';
import api from '@/lib/api';

interface MateriaComision {
  id: number;
  nombre: string;
  cupoDisponible?: number;
  cupoMaximo?: number;
  cupo?: number;
  inscripciones?: Array<{ id: number }>;
}

interface Materia {
  id: number;
  nombre: string;
  descripcion?: string;
  departamento?: {
    nombre: string;
  };
  profesores?: Array<{
    nombre: string;
    apellido: string;
  }>;
  comisiones?: MateriaComision[];
  horarios?: Array<{
    dia: string;
    horaInicio: string;
    horaFin: string;
    aula: string;
  }>;
}

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const response = await api.get('/materia');
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterias = materias.filter(materia =>
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      'LUNES': 'Lun',
      'MARTES': 'Mar',
      'MIERCOLES': 'Mié',
      'JUEVES': 'Jue',
      'VIERNES': 'Vie',
      'SABADO': 'Sáb',
    };
    return days[day] || day;
  };

  const formatCupo = (comision: MateriaComision) => {
    if (
      typeof comision.cupoDisponible === 'number' &&
      typeof comision.cupoMaximo === 'number'
    ) {
      return `${comision.cupoDisponible}/${comision.cupoMaximo}`;
    }

    if (typeof comision.cupo === 'number') {
      const inscriptos = comision.inscripciones?.length ?? 0;
      return `${inscriptos}/${comision.cupo}`;
    }

    if (comision.inscripciones) {
      return `${comision.inscripciones.length} inscriptos`;
    }

    return 'Cupo no disponible';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Materias</h1>
              <p className="text-gray-600 mt-1">Explora todas las materias disponibles</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar materias..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-100">
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterias.map((materia) => (
              <Card key={materia.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                      <CardDescription className="mt-1">
                        {materia.descripcion || 'Sin descripción'}
                      </CardDescription>
                    </div>
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materia.departamento && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{materia.departamento.nombre}</span>
                      </div>
                    )}
                    
                    {materia.profesores && materia.profesores.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {materia.profesores[0].nombre} {materia.profesores[0].apellido}
                          {materia.profesores.length > 1 && ` y ${materia.profesores.length - 1} más`}
                        </span>
                      </div>
                    )}

                    {materia.comisiones && materia.comisiones.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {materia.comisiones.map((comision) => (
                          <Badge key={comision.id} variant="secondary">
                            {comision.nombre} ({formatCupo(comision)})
                          </Badge>
                        ))}
                      </div>
                    )}

                    {materia.horarios && materia.horarios.length > 0 && (
                      <div className="space-y-1">
                        {materia.horarios.slice(0, 2).map((horario, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>
                              {getDayName(horario.dia)} {horario.horaInicio} - {horario.horaFin}
                            </span>
                          </div>
                        ))}
                        {materia.horarios.length > 2 && (
                          <span className="text-xs text-gray-600">
                            +{materia.horarios.length - 2} horarios más
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => setSelectedMateria(materia)}
                    >
                      Ver Detalles
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredMaterias.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No se encontraron materias</h3>
            <p className="text-gray-600 mt-2">
              Intenta ajustar tu búsqueda o filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
