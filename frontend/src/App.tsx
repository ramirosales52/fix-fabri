import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'pages/Login/Login';
import DashboardPage from 'pages/Dashboard/Dashboard';
import MateriasPage from 'pages/Materias/Materias';
import InscripcionesPage from 'pages/Inscripciones/Inscripciones';
import HorarioPage from 'pages/Horario/Horario';
import AsistenciasPage from 'pages/Asistencias/Asistencias';
import NotFound from 'pages/NotFound';
import { ProtectedRoute, RedirectIfAuthenticated } from 'routes/ProtectedRoute';
import { useAuth } from 'contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/materias"
        element={
          <ProtectedRoute>
            <MateriasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inscripciones"
        element={
          <ProtectedRoute>
            <InscripcionesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mi-horario"
        element={
          <ProtectedRoute>
            <HorarioPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/asistencias"
        element={
          <ProtectedRoute>
            <AsistenciasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
