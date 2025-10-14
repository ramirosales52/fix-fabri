import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
const protectedRoutes = [
  '/estudiante',
  '/profesor',
  '/admin',
  '/secretaria'
];

const publicRoutes = ['/login', '/register'];
 
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Si la ruta es pública, permitir el acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Si el usuario ya está autenticado, redirigir al dashboard correspondiente
    if (token) {
      // Aquí podrías hacer una petición para obtener el rol del usuario
      // Por ahora, asumiremos que el token es válido y redirigiremos al dashboard del estudiante
      return NextResponse.redirect(new URL('/estudiante/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si no hay token y la ruta está protegida, redirigir al login
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar el token y el rol del usuario
  if (token) {
    try {
      // Aquí podrías verificar el token contra tu backend
      // Por ahora, asumiremos que el token es válido
      
      // Redirigir a la ruta de estudiante si está en la raíz
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/estudiante/dashboard', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      // Si hay un error al verificar el token, redirigir al login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
