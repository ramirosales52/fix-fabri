'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth, getHomePathByRole } from '@/contexts/AuthContext';
import { isAxiosError } from 'axios';

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Ingresa tu legajo o correo electrónico'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const loggedUser = await login(data.identifier, data.password);
      router.push(getHomePathByRole(loggedUser.rol));
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Sistema de Autogestión</h1>
            <p className="text-indigo-100 mt-1">Inicia sesión para continuar</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Legajo o correo electrónico
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="ejemplo@dominio.com o EST001"
                    className={`pl-10 w-full ${
                      errors.identifier
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    {...register('identifier')}
                    disabled={isLoading}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Contraseña
                  </Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 w-full ${
                      errors.password
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    {...register('password')}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Crear cuenta
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Sistema de Autogestión. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
