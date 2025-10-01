import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from 'services/api';
import type { AuthResponse, User } from 'types';

interface AuthContextState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (legajo: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const STORAGE_KEY = 'autogestion.auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        console.warn('Failed to parse auth storage', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (legajo: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { legajo, password });
    const { access_token, user: nextUser } = response.data;

    setUser(nextUser);
    setToken(access_token);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: access_token, user: nextUser })
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
