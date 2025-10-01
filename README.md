# Sistema de Autogestión Universitaria 🎓

Sistema completo de gestión académica para universidades, desarrollado con tecnologías modernas y mejores prácticas.

## 🚀 Características Principales

### Para Estudiantes
- 📚 Inscripción a materias y comisiones
- 📅 Visualización de horarios
- 📊 Seguimiento de calificaciones
- ✅ Control de asistencia
- 📝 Inscripción a exámenes
- 📈 Dashboard con estadísticas personales

### Para Profesores
- 👥 Gestión de comisiones
- 📝 Registro de asistencia
- 🎯 Carga de calificaciones
- 📋 Gestión de clases
- 📊 Reportes de rendimiento

### Para Administradores
- 🏫 Gestión de carreras y planes de estudio
- 👤 Administración de usuarios
- 📚 Gestión de materias y correlatividades
- 📊 Reportes y estadísticas generales
- 🔧 Configuración del sistema

## 🛠️ Stack Tecnológico

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **Bcrypt** - Encriptación de contraseñas

### Frontend
- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP
- **Zustand** - Estado global
- **Recharts** - Gráficos

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/autogestion.git
cd autogestion
```

### 2. Configurar la Base de Datos

Crear una base de datos PostgreSQL:

```sql
CREATE DATABASE autogestion;
```

### 3. Configurar Variables de Entorno

#### Backend (.env)

Crear archivo `/backend/.env`:

```env
# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=autogestion

# JWT
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3001
```

#### Frontend (.env.local)

Crear archivo `/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## 🚀 Ejecución

### Desarrollo

#### Opción 1: Ejecutar por separado

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

#### Opción 2: Script unificado

Desde la raíz del proyecto:
```bash
npm run dev
```

### Producción

#### Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

#### Ejecutar
```bash
# Backend
cd backend
npm run start:prod

# Frontend
cd frontend
npm run start
```

## 📚 Documentación API

Una vez iniciado el backend, la documentación de la API está disponible en:

- Swagger UI: http://localhost:3000/api
- ReDoc: http://localhost:3000/redoc

## 🔑 Usuarios de Prueba

El sistema incluye usuarios de prueba para cada rol:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@universidad.edu | admin123 | Administrador |
| profesor@universidad.edu | prof123 | Profesor |
| estudiante@universidad.edu | est123 | Estudiante |

## 📁 Estructura del Proyecto

```
autogestion/
├── backend/
│   ├── src/
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── user/          # Gestión de usuarios
│   │   ├── materia/       # Gestión de materias
│   │   ├── inscripcion/   # Sistema de inscripciones
│   │   ├── evaluacion/    # Calificaciones
│   │   ├── asistencia/    # Control de asistencia
│   │   ├── clase/         # Gestión de clases
│   │   ├── comision/      # Comisiones
│   │   ├── carrera/       # Carreras
│   │   ├── plan-estudio/  # Planes de estudio
│   │   └── ...
│   └── test/              # Pruebas
│
└── frontend/
    ├── src/
    │   ├── app/           # Páginas de Next.js
    │   ├── components/    # Componentes React
    │   ├── contexts/      # Contextos de React
    │   ├── services/      # Servicios API
    │   ├── lib/          # Utilidades
    │   └── styles/       # Estilos globales
    └── public/           # Archivos estáticos
```

## 🧪 Testing

### Backend
```bash
cd backend
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### Frontend
```bash
cd frontend
# Pruebas
npm run test

# Cobertura
npm run test:coverage
```

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas con Bcrypt
- ✅ Validación de datos con class-validator
- ✅ Guards de autorización por roles
- ✅ CORS configurado
- ✅ Variables de entorno para datos sensibles
- ✅ SQL Injection prevention con TypeORM

## 📈 Funcionalidades Principales

### Gestión de Materias
- CRUD completo de materias
- Sistema de correlatividades
- Asignación de profesores
- Gestión de comisiones y horarios

### Sistema de Inscripciones
- Inscripción a materias con validación de correlativas
- Control de cupos
- Estados de inscripción (pendiente, aprobada, rechazada)
- Historial de inscripciones

### Control de Asistencia
- Registro de asistencia por clase
- Cálculo automático de porcentajes
- Alertas por inasistencias

### Evaluaciones
- Carga de notas parciales y finales
- Cálculo de promedios
- Historial académico

### Dashboard y Reportes
- Estadísticas en tiempo real
- Gráficos interactivos
- Exportación de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Backend**: NestJS Team
- **Desarrollo Frontend**: Next.js Team
- **UI/UX Design**: Design Team
- **Testing & QA**: QA Team

## 📞 Soporte

Para soporte, enviar un email a soporte@universidad.edu o abrir un issue en GitHub.

## 🎯 Roadmap

- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar módulo de mensajería
- [ ] Integración con sistemas externos
- [ ] App móvil con React Native
- [ ] Sistema de videoconferencias
- [ ] Módulo de biblioteca digital

---

Desarrollado con ❤️ para la comunidad universitaria
