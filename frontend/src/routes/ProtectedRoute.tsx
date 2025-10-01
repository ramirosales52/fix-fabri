import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Cargando sesión…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export const RedirectIfAuthenticated = ({ children }: ProtectedRouteProps): ReactElement => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Cargando sesión…</div>;
  }

  if (user) {
    const redirectTo = (location.state as { from?: Location })?.from || { pathname: '/dashboard' };
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
