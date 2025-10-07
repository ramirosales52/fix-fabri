import axios from 'axios';

type AuthStorage = {
  token: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autogestion.auth');
    let token: string | null = null;

    if (stored) {
      try {
        const parsed: AuthStorage = JSON.parse(stored);
        token = parsed.token;
      } catch (error) {
        console.warn('Error parsing auth storage', error);
      }
    }

    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
