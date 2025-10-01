import axios from 'axios';

type AuthStorage = {
  token: string;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autogestion.auth');
    if (stored) {
      try {
        const parsed: AuthStorage = JSON.parse(stored);
        if (parsed.token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.warn('Error parsing auth storage', error);
      }
    }
  }
  return config;
});

export default api;
