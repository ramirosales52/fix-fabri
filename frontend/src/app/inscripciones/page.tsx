'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Check, 
  X,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { isAxiosError } from 'axios';
import axios from 'axios';

interface Materia {
  id: number;
  nombre: string;
  descripcion?: string;
  comisiones?: Comision[];
  correlativasCursada?: Array<{
    id: number;
    correlativa?: {
      id: number;
      nombre: string;
    };
    nombre?: string;
  }>;
  correlativasFinal?: Array<{
    id: number;
    correlativa?: {
      id: number;
      nombre: string;
    };
    nombre?: string;
  }>;
}

interface Comision {
  id: number;
  nombre: string;
  cupoDisponible: number;
  cupoMaximo: number;
  docente?: {
    nombre: string;
    apellido: string;
  };
  profesor?: {
    nombre: string;
    apellido: string;
  };
  horarios?: Horario[];
  inscripciones?: Array<{ id: number }>;
  cupo?: number;
}

interface Horario {
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
}

interface Inscripcion {
  id: number;
  materia: Materia;
  comision?: Comision;
  estado?: string;
  stc?: string;
  fechaInscripcion: string;
}

export default function InscripcionesPage() {
  const [materiasDisponibles, setMateriasDisponibles] = useState<Materia[]>([]);
  const [misInscripciones, setMisInscripciones] = useState<Inscripcion[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [selectedComision, setSelectedComision] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('InscripcionesPage: useEffect ejecutándose');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      console.log('Token disponible:', !!token);
      console.log('Usuario en localStorage:', userStr);

      if (!token || !userStr) {
        console.log('No hay token o usuario, mostrando error de autenticación');
        setAuthError('No hay datos de autenticación. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      if (!user.planEstudio?.id) {
        console.log('Usuario no tiene planEstudioId');
        setAuthError('Tu cuenta no tiene un plan de estudios asignado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setAuthError(null);
      console.log('Iniciando carga de datos...');

      let materiasLoaded = false;
      let inscripcionesLoaded = false;

      // Cargar todas las materias del plan de estudios
      try {
        console.log('Cargando materias del plan de estudios...');
        const materiasRes = await api.get(`/materia/del-plan/${user.planEstudio.id}`);
        console.log('Materias del plan cargadas:', materiasRes.data.length);
        setMateriasDisponibles(materiasRes.data);
        materiasLoaded = true;
      } catch (error) {
        console.error('Error al cargar materias del plan:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthError('Error de autenticación al cargar materias. Tu sesión puede haber expirado.');
          setMateriasDisponibles([]);
        } else {
          setMateriasDisponibles([]);
        }
      }

      // Cargar inscripciones actuales
      try {
        console.log('Cargando inscripciones actuales...');
        const inscripcionesRes = await api.get('/inscripcion/cursando');
        console.log('Inscripciones cargadas:', inscripcionesRes.data.length);
        setMisInscripciones(inscripcionesRes.data);
        inscripcionesLoaded = true;
      } catch (error) {
        console.error('Error al cargar inscripciones actuales:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthError('Error de autenticación al cargar inscripciones. Tu sesión puede haber expirado.');
          setMisInscripciones([]);
        } else {
          setMisInscripciones([]);
        }
      }

      // Filtrar materias aprobadas después de cargar ambas listas
      if (materiasLoaded && inscripcionesLoaded) {
        const materiasAprobadas = new Set(
          misInscripciones
            .filter(insc => insc.stc === 'APROBADA')
            .map(insc => insc.materia.id)
        );

        const materiasFiltradas = materiasDisponibles.filter(
          materia => !materiasAprobadas.has(materia.id)
        );

        setMateriasDisponibles(materiasFiltradas);
        console.log('Materias filtradas (excluyendo aprobadas):', materiasFiltradas.length);
      }

    } catch (error) {
      console.error('Error general al cargar datos:', error);
      setAuthError('Error inesperado al cargar la página. Intenta nuevamente.');
    } finally {
      setLoading(false);
      console.log('Carga de datos finalizada');
    }
  };

  const handleRetry = () => {
    console.log('Reintentando carga de datos...');
    fetchData();
  };

  const handleGoToLogin = () => {
    console.log('Redirigiendo manualmente al login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleInscripcion = async () => {
    if (!selectedMateria || !selectedComision) {
      toast({
        title: "Error",
        description: "Debes seleccionar una materia y comisión",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = Number.isFinite(parseInt(selectedComision, 10))
        ? { comisionId: parseInt(selectedComision, 10) }
        : {};

      await api.post(`/inscripcion/materia/${selectedMateria.id}`, payload);
      
      toast({
        title: "Éxito",
        description: "Te has inscrito correctamente",
      });
      
      setShowModal(false);
      setSelectedMateria(null);
      setSelectedComision('');
      fetchData();
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : null;

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('Error 401 en inscripción - mostrando error en pantalla');
        setAuthError('Error de autenticación. Tu sesión ha expirado.');
        setShowModal(false);
        setSelectedMateria(null);
        setSelectedComision('');
      } else {
        toast({
          title: "Error",
          description: message || "Error al inscribirse",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelarInscripcion = async (inscripcionId: number) => {
    try {
      await api.delete(`/inscripcion/${inscripcionId}`);

      toast({
        title: "Éxito",
        description: "Inscripción cancelada correctamente",
      });

      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('Error 401 en cancelar inscripción - mostrando error en pantalla');
        setAuthError('Error de autenticación. Tu sesión ha expirado.');
      } else {
        toast({
          title: "Error",
          description: "Error al cancelar la inscripción",
          variant: "destructive",
        });
      }
    }
  };

  const filteredMaterias = materiasDisponibles.filter(materia =>
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (inscripcion: Inscripcion) => {
    const estado = (inscripcion.estado || inscripcion.stc || '').toUpperCase();
    switch (estado) {
      case 'CONFIRMADA':
      case 'CURSANDO':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'PENDIENTE':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'RECHAZADA':
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      case 'FINALIZADA':
      case 'APROBADA':
        return <Badge className="bg-blue-100 text-blue-800">{estado.charAt(0) + estado.slice(1).toLowerCase()}</Badge>;
      default:
        return estado ? <Badge>{estado}</Badge> : <Badge variant="outline">Sin estado</Badge>;
    }
  };

  const renderComisionDocente = (comision?: Comision) => {
    const docente = comision?.docente ?? comision?.profesor;
    if (!docente) return null;

    return (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span>
          Prof. {docente.nombre} {docente.apellido}
        </span>
      </div>
    );
  };

  const getCorrelativasNombres = (
    correlativas?: Array<{ correlativa?: { nombre: string }; nombre?: string }>,
  ) => {
    return (correlativas ?? [])
      .map((item) => item?.correlativa?.nombre || item?.nombre)
      .filter((nombre): nombre is string => Boolean(nombre));
  };

  const formatCupo = (comision: Comision) => {
    if (
      typeof comision.cupoDisponible === 'number' &&
      typeof comision.cupoMaximo === 'number'
    ) {
      return `${comision.cupoDisponible}/${comision.cupoMaximo}`;
    }

    if (typeof comision.cupo === 'number') {
      const usados = comision.inscripciones?.length ?? 0;
      return `${usados}/${comision.cupo}`;
    }

    if (comision.inscripciones) {
      return `${comision.inscripciones.length} inscriptos`;
    }

    return 'Cupo no disponible';
  };

  const canCancelInscripcion = (inscripcion: Inscripcion) => {
    const estado = (inscripcion.estado || inscripcion.stc || '').toUpperCase();
    return estado === 'PENDIENTE' || estado === 'CURSANDO';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inscripciones</h1>
              <p className="text-gray-600 mt-1">Gestiona tus inscripciones a materias</p>
            </div>
            {!authError && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Inscripción
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authError ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error de Autenticación</h2>
            <p className="text-red-700 mb-4">{authError}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} variant="outline">
                Reintentar
              </Button>
              <Button onClick={handleGoToLogin} variant="destructive">
                Ir al Login
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mis Inscripciones */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Inscripciones Actuales</h2>
              {misInscripciones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes inscripciones activas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {misInscripciones.map((inscripcion) => (
                    <Card key={inscripcion.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{inscripcion.materia.nombre}</CardTitle>
                            <CardDescription>{inscripcion.comision?.nombre || 'Sin comisión asignada'}</CardDescription>
                          </div>
                          {getEstadoBadge(inscripcion)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {renderComisionDocente(inscripcion.comision)}
                          {inscripcion.comision?.horarios?.map((horario, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {horario.dia} {horario.horaInicio} - {horario.horaFin}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              Inscrito el {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                        </div>
                        {canCancelInscripcion(inscripcion) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => handleCancelarInscripcion(inscripcion.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar Inscripción
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Materias Disponibles */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Materias Disponibles</h2>
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
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMaterias.map((materia) => (
                    <Card key={materia.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                        <CardDescription>{materia.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {(() => {
                            const correlativas = getCorrelativasNombres(materia.correlativasCursada);
                            if (correlativas.length === 0) return null;
                            return (
                              <div className="text-sm">
                                <span className="font-medium">Correlativas cursada:</span>
                                <ul className="ml-4 mt-1">
                                  {correlativas.map((nombre, index) => (
                                    <li key={`${materia.id}-corr-${index}`} className="text-gray-600">• {nombre}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })()}
                          <div className="text-sm">
                            <span className="font-medium">Comisiones disponibles:</span>
                            <div className="mt-1 space-y-1">
                              {(materia.comisiones ?? []).map((comision) => (
                                <div key={comision.id} className="flex justify-between items-center">
                                  <span className="text-gray-600">{comision.nombre}</span>
                                  <Badge variant="secondary">{formatCupo(comision)}</Badge>
                                </div>
                              ))}
                              {(materia.comisiones ?? []).length === 0 && (
                                <p className="text-gray-500">Sin comisiones cargadas</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedMateria(materia);
                            setShowModal(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Inscribirse
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de Inscripción */}
      {showModal && !authError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md text-gray-900">
            <CardHeader>
              <CardTitle className="text-gray-900">Nueva Inscripción</CardTitle>
              <CardDescription className="text-gray-700">
                {selectedMateria ? `Inscribirse a ${selectedMateria.nombre}` : 'Selecciona una materia y comisión'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!selectedMateria ? (
                  <div>
                    <Label className="text-gray-800">Materia</Label>
                    <Select onValueChange={(value) => {
                      const materia = materiasDisponibles.find(m => m.id === parseInt(value));
                      setSelectedMateria(materia || null);
                    }}>
                      <SelectTrigger className="text-gray-900 placeholder:text-gray-500">
                        <SelectValue placeholder="Selecciona una materia" />
                      </SelectTrigger>
                      <SelectContent>
                          {materiasDisponibles.map((materia) => (
                            <SelectItem key={materia.id} value={materia.id.toString()}>
                              {materia.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-gray-800">Materia seleccionada</Label>
                      <p className="text-sm font-medium mt-1 text-gray-900">{selectedMateria.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-gray-800">Comisión</Label>
                      <Select value={selectedComision} onValueChange={setSelectedComision}>
                        <SelectTrigger className="text-gray-900 placeholder:text-gray-500">
                          <SelectValue placeholder="Selecciona una comisión" />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedMateria.comisiones ?? []).map((comision) => (
                            <SelectItem
                              key={comision.id}
                              value={comision.id.toString()}
                              disabled={typeof comision.cupoDisponible === 'number' && comision.cupoDisponible === 0}
                            >
                              {comision.nombre} ({formatCupo(comision)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedComision && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900 mb-2">Horarios:</p>
                        {selectedMateria.comisiones
                          ?.find((c) => c.id === parseInt(selectedComision, 10))
                          ?.horarios?.map((horario, idx) => (
                            <p key={idx} className="text-sm text-blue-700">
                              {horario.dia} {horario.horaInicio} - {horario.horaFin} (Aula {horario.aula})
                            </p>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowModal(false);
                  setSelectedMateria(null);
                  setSelectedComision('');
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleInscripcion}
                disabled={!selectedMateria || !selectedComision}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar Inscripción
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
