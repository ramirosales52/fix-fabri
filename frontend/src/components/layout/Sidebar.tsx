'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  ClipboardList,
  Award,
  Building,
  UserCheck,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Materias',
    href: '/materias',
    icon: BookOpen,
  },
  {
    title: 'Inscripciones',
    href: '/inscripciones',
    icon: ClipboardList,
    roles: ['estudiante'],
  },
  {
    title: 'Mis Clases',
    href: '/clases',
    icon: GraduationCap,
  },
  {
    title: 'Horarios',
    href: '/horarios',
    icon: Calendar,
  },
  {
    title: 'Calificaciones',
    href: '/calificaciones',
    icon: Award,
  },
  {
    title: 'Exámenes',
    href: '/examenes',
    icon: FileText,
  },
  {
    title: 'Asistencia',
    href: '/asistencia',
    icon: UserCheck,
  },
  {
    title: 'Usuarios',
    href: '/usuarios',
    icon: Users,
    roles: ['admin', 'secretaria_academica'],
  },
  {
    title: 'Carreras',
    href: '/carreras',
    icon: Building,
    roles: ['admin', 'secretaria_academica'],
  },
  {
    title: 'Reportes',
    href: '/reportes',
    icon: BarChart,
    roles: ['admin', 'secretaria_academica', 'profesor'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.rol || '');
  });

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Autogestión</h1>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-white">{user?.nombre} {user?.apellido}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.rol?.replace('_', ' ')}</p>
        </div>
        <div className="space-y-2">
          <Link href="/perfil">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
