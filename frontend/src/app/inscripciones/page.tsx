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

interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  comisiones: Comision[];
  correlativasCursada: Materia[];
  correlativasFinal: Materia[];
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
  horarios: Horario[];
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
  comision: Comision;
  estado: string;
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [materiasRes, inscripcionesRes] = await Promise.all([
        api.get('/materias/disponibles'),
        api.get('/inscripciones/mis-inscripciones')
      ]);
      setMateriasDisponibles(materiasRes.data);
      setMisInscripciones(inscripcionesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
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
      await api.post('/inscripciones', {
        materiaId: selectedMateria.id,
        comisionId: parseInt(selectedComision),
      });
      
      toast({
        title: "Éxito",
        description: "Te has inscrito correctamente",
      });
      
      setShowModal(false);
      setSelectedMateria(null);
      setSelectedComision('');
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al inscribirse",
        variant: "destructive",
      });
    }
  };

  const handleCancelarInscripcion = async (inscripcionId: number) => {
    try {
      await api.delete(`/inscripciones/${inscripcionId}`);
      
      toast({
        title: "Éxito",
        description: "Inscripción cancelada correctamente",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cancelar la inscripción",
        variant: "destructive",
      });
    }
  };

  const filteredMaterias = materiasDisponibles.filter(materia =>
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'PENDIENTE':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'RECHAZADA':
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
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
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Inscripción
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mis Inscripciones */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mis Inscripciones Actuales</h2>
          {misInscripciones.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tienes inscripciones activas</p>
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
                        <CardDescription>{inscripcion.comision.nombre}</CardDescription>
                      </div>
                      {getEstadoBadge(inscripcion.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {inscripcion.comision.docente && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>
                            Prof. {inscripcion.comision.docente.nombre} {inscripcion.comision.docente.apellido}
                          </span>
                        </div>
                      )}
                      {inscripcion.comision.horarios.map((horario, idx) => (
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
                    {inscripcion.estado === 'PENDIENTE' && (
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
            <h2 className="text-xl font-semibold">Materias Disponibles</h2>
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
                      {materia.correlativasCursada.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Correlativas cursada:</span>
                          <ul className="ml-4 mt-1">
                            {materia.correlativasCursada.map((corr) => (
                              <li key={corr.id} className="text-gray-600">• {corr.nombre}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">Comisiones disponibles:</span>
                        <div className="mt-1 space-y-1">
                          {materia.comisiones.map((comision) => (
                            <div key={comision.id} className="flex justify-between items-center">
                              <span className="text-gray-600">{comision.nombre}</span>
                              <Badge variant="secondary">
                                {comision.cupoDisponible}/{comision.cupoMaximo}
                              </Badge>
                            </div>
                          ))}
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
      </div>

      {/* Modal de Inscripción */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nueva Inscripción</CardTitle>
              <CardDescription>
                {selectedMateria ? `Inscribirse a ${selectedMateria.nombre}` : 'Selecciona una materia y comisión'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!selectedMateria ? (
                  <div>
                    <Label>Materia</Label>
                    <Select onValueChange={(value) => {
                      const materia = materiasDisponibles.find(m => m.id === parseInt(value));
                      setSelectedMateria(materia || null);
                    }}>
                      <SelectTrigger>
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
                      <Label>Materia seleccionada</Label>
                      <p className="text-sm font-medium mt-1">{selectedMateria.nombre}</p>
                    </div>
                    <div>
                      <Label>Comisión</Label>
                      <Select value={selectedComision} onValueChange={setSelectedComision}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una comisión" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMateria.comisiones.map((comision) => (
                            <SelectItem 
                              key={comision.id} 
                              value={comision.id.toString()}
                              disabled={comision.cupoDisponible === 0}
                            >
                              {comision.nombre} ({comision.cupoDisponible}/{comision.cupoMaximo} disponibles)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedComision && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900 mb-2">Horarios:</p>
                        {selectedMateria.comisiones
                          .find(c => c.id === parseInt(selectedComision))
                          ?.horarios.map((horario, idx) => (
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
