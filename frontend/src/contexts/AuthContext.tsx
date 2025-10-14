'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type UserRole = 'admin' | 'profesor' | 'estudiante' | 'secretaria_academica';

// Función para obtener la ruta según el rol
export const getHomePathByRole = (role: UserRole = 'estudiante'): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'profesor':
      return '/profesor';
    case 'estudiante':
      return '/dashboard';
    case 'secretaria_academica':
      return '/secretaria';
    default:
      return '/';
  }
};

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  legajo?: string;
  // Agrega otros campos según sea necesario
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
  getHomePathByRole: (role?: UserRole) => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Parsear el usuario almacenado
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Error al cargar los datos de autenticación:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = useCallback(
    async (identifier: string, password: string): Promise<User> => {
      try {
        setLoading(true);
        
        // Verificar que la URL de la API esté definida
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('La URL de la API no está configurada');
        }

        // Determinar si el identificador es un email o un legajo
        const isEmail = identifier.includes('@');
        const loginData = isEmail 
          ? { email: identifier, password }
          : { legajo: identifier, password };
        
        const loginUrl = `${apiUrl}/auth/login`;
        console.log('Intentando iniciar sesión en:', loginUrl);
        
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(loginData),
          credentials: 'include',
        }).catch(error => {
          console.error('Error de red al intentar iniciar sesión:', error);
          throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error al procesar la respuesta del servidor:', jsonError);
          throw new Error('La respuesta del servidor no es válida');
        }
        
        if (!response.ok) {
          console.error('Error en la respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          throw new Error(data?.message || `Error en la autenticación (${response.status})`);
        }
        
        if (!data || !data.user || !data.access_token) {
          console.error('Datos de autenticación incompletos:', data);
          throw new Error('Datos de autenticación incompletos');
        }
        
        const { user, access_token } = data;
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Actualizar estado
        setUser(user);
        setToken(access_token);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        return user;
        
      } catch (error: any) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  }, [router]);

  // Usar la función getHomePathByRole importada

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    getHomePathByRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
