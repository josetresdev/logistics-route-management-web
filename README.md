# Sistema de Gestión de Rutas Logísticas - Frontend

**Aplicación web moderna para gestión integral de rutas de distribución logística**

Frontend profesional construido con Angular 21.2.0, Material Design y arquitectura standalone, conectado a la [API de Gestión de Rutas](../logistics-route-management-api).

[![Angular](https://img.shields.io/badge/Angular-21.2.0-red?logo=angular)](https://angular.dev) [![Material](https://img.shields.io/badge/Material-Design-blue?logo=material-design)](https://material.angular.io) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org) [![Node](https://img.shields.io/badge/Node-20+-green?logo=node.js)](https://nodejs.org)

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Desarrollo](#desarrollo)
- [Construcción y Deployment](#construcción-y-deployment)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración del Entorno](#configuración-del-entorno)
- [Integración con API](#integración-con-api)
- [Guía de Contribución](#guía-de-contribución)

## Características

### Principales
- **Autenticación Token-Based** - Integración segura con API REST
- **Gestión de Rutas** - CRUD completo con búsqueda, filtrado y paginación
- **Dashboard de Análisis** - Visualización de datos en tiempo real
- **Importación de Datos** - Soporte para Excel y archivos masivos
- **Registros de Auditoría** - Historial completo de cambios
- **Interfaz Material Design** - UI moderna y responsiva
- **SSR (Server-Side Rendering)** - Renderizado en servidor para mejor SEO y performance

### Experiencia de Usuario
- Componentes reutilizables y modulares
- Validaciones en tiempo real
- Notificaciones de errores y éxito
- Carga diferida (lazy loading) de módulos
- Caché inteligente de datos
- Interceptores HTTP para autenticación automática

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Angular** | 21.2.0 | Framework principal |
| **Angular Material** | 21.2.0 | Componentes UI |
| **TypeScript** | 5.9 | Lenguaje de programación |
| **RxJS** | 7.8.0 | Programación reactiva |
| **Angular CSR/SSR** | 21.2.0 | Renderizado cliente/servidor |

### Herramientas de Desarrollo
| Herramienta | Versión | Propósito |
|------------|---------|----------|
| **Angular CLI** | 21.2.0 | Scaffolding y build |
| **Vitest** | 4.0.8 | Testing unitario |
| **TypeScript Compiler** | 5.9 | Compilación tipada |
| **Prettier** | 3.8.1 | Formateo de código |
| **Express** | 5.1.0 | Servidor SSR |

### Backend (API)
- Django REST Framework 3.14
- PostgreSQL 16
- Docker y Docker Compose

## Requisitos Previos

- **Node.js**: v20+ o superior
- **npm**: v10.8.2 o superior
- **Angular CLI**: v21.2.0+
- **Git**: para control de versiones
- **API Backend**: servidor ejecutándose en `http://localhost:8000`

### Verificar Requisitos

```bash
node --version
npm --version
ng version
```

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd logistics-route-management-web
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias de npm
npm install

# O si prefieres limpiar caché previamente
npm cache clean --force
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  apiTimeout: 30000,
};
```

Crear archivo `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  apiTimeout: 30000,
};
```

### 4. Verificar Conexión con API

Asegúrate que el backend esté ejecutándose:

```bash
# En otra terminal, desde logistics-route-management-api
python manage.py runserver
```

## Desarrollo

### Iniciar Servidor de Desarrollo

```bash
npm start
```

El servidor se inicia en `http://localhost:4200/` y recarga automáticamente con cada cambio.

### Generar Nuevos Componentes

```bash
# Generar un componente nuevo
ng generate component features/mi-modulo/pages/mi-pagina

# Generar un servicio
ng generate service core/services/mi-servicio

# Generar un guard
ng generate guard core/guards/mi-guard

# Generar un interceptor
ng generate interceptor core/interceptors/mi-interceptor
```

### Compilación Incremental

```bash
# Watch mode para desarrollo
npm run watch
```

### Linting y Formateo

```bash
# Formatear código con Prettier
npx prettier --write src/**/*.ts src/**/*.html src/**/*.scss

# Verificar problemas
ng lint
```

## Construcción y Deployment

### Construcción para Producción

```bash
# Build optimizado de producción
npm run build
```

Los artefactos compilados se almacenan en `dist/logistics-frontend/`.

### Construcción con SSR

```bash
# Build con SSR incluido
npm run build

# Los archivos SSR se generan en:
# dist/logistics-frontend/server/server.mjs
# dist/logistics-frontend/browser/
```

### Servir Aplicación SSR

```bash
# Ejecutar servidor SSR en producción
npm run serve:ssr:logistics-frontend

# Acceder en http://localhost:4000
```

### Deployment en Docker

```bash
# Construir imagen Docker
docker build -t logistics-frontend .

# Ejecutar contenedor
docker run -p 4000:4000 logistics-frontend
```

## Testing

### Ejecutar Test Unitarios

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
ng test --watch

# Ejecutar tests con coverage
ng test --code-coverage
```

### Estructura de Tests

Los archivos de test se encuentran junto a sus componentes:

```
src/
├── app/
│   ├── features/
│   │   ├── routes/
│   │   │   ├── routes.component.ts
│   │   │   └── routes.component.spec.ts
```

### Ejemplo de Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutesComponent } from './routes.component';

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Angular 21.2)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UI Components (Material Design)                     │   │
│  │  Services (ApiService, AuthService)                  │   │
│  │  Routing (RxJS Observables)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│           HTTP Requests (JSON + Token Auth)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Django REST API)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST Endpoints                                      │   │
│  │  Authentication (Token-based)                        │   │
│  │  Business Logic (Services, Validators)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│           SQL Queries (Data Persistence)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16 Database                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  - routes (rutas principales)                        │   │
│  │  - locations (ubicaciones)                           │   │
│  │  - execution_logs (historial de ejecuciones)         │   │
│  │  - import_batches (lotes importados)                 │   │
│  │  - auth_user (usuarios y autenticación)              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Frontend** - Usuario interactúa con componentes Angular en Material Design
2. **Comunicación** - ApiService envía requests HTTP con autenticación token-based
3. **Backend** - Django REST API procesa la solicitud, valida y ejecuta lógica de negocio
4. **Base de Datos** - PostgreSQL persiste y recupera datos
5. **Respuesta** - Backend retorna JSON al frontend y actualiza la UI

## Estructura del Proyecto

```
src/
├── app/
│   ├── app.ts                          # Componente root
│   ├── app.html                        # Template root
│   ├── app.scss                        # Estilos globales
│   ├── app.routes.ts                   # Configuración de rutas
│   ├── app.config.ts                   # Configuración de la app
│   │
│   ├── core/                           # Módulo core (singletons)
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Protección de rutas
│   │   ├── interceptors/
│   │   │   └── api.interceptor.ts      # Interceptor HTTP
│   │   └── services/
│   │       ├── api.service.ts          # Comunicación con API
│   │       └── auth.service.ts         # Autenticación
│   │
│   ├── features/                       # Módulos funcionales
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth-routing.module.ts
│   │   │   └── pages/
│   │   │       └── login/
│   │   │           ├── login.component.ts
│   │   │           ├── login.component.html
│   │   │           └── login.component.scss
│   │   │
│   │   └── routes/
│   │       ├── routes.module.ts
│   │       ├── routes-routing.module.ts
│   │       ├── pages/
│   │       │   ├── routes-list/        # Listado de rutas
│   │       │   ├── routes-import/      # Importación de datos
│   │       │   └── routes-logs/        # Auditoría y logs
│   │       ├── components/
│   │       │   ├── route-table/        # Tabla de rutas
│   │       │   └── route-filter/       # Filtros
│   │       └── services/
│   │           └── routes.service.ts   # Lógica de rutas
│   │
│   ├── shared/                         # Componentes compartidos
│   │   ├── shared.module.ts
│   │   ├── components/
│   │   └── models/
│   │       └── route.model.ts
│   │
│   └── environments/
│       ├── environment.ts              # Desarrollo
│       └── environment.prod.ts         # Producción
│
├── index.html                          # HTML principal
├── main.ts                             # Entry point cliente
├── server.ts                           # Entry point SSR
├── styles.scss                         # Estilos globales
│
└── assets/                             # Recursos estáticos

angular.json                            # Configuración Angular
tsconfig.json                           # Configuración TypeScript
package.json                            # Dependencias npm
```

## Configuración del Entorno

### Variables de Entorno

Las variables de entorno se definen en `src/environments/`:

```typescript
// environment.ts (Desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  apiTimeout: 30000,
};

// environment.prod.ts (Producción)
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  apiTimeout: 30000,
};
```

### Compilación Condicionada

El angular.json automáticamente selecciona el ambiente correcto:

```bash
ng build                    # Usa environment.ts
ng build --configuration production  # Usa environment.prod.ts
```

## Integración con API

### Estructura de Llamadas API

El servicio `ApiService` centraliza toda comunicación:

```typescript
// En any.service.ts
constructor(private api: ApiService) {}

getRoutes(page: number, pageSize: number) {
  return this.api.get<Route[]>('/routes', { page, pageSize });
}

createRoute(route: Route) {
  return this.api.post<Route>('/routes', route);
}

updateRoute(id: number, route: Route) {
  return this.api.put<Route>(`/routes/${id}`, route);
}

deleteRoute(id: number) {
  return this.api.delete(`/routes/${id}`);
}
```

### Autenticación

El `AuthService` maneja tokens JWT:

```typescript
login(email: string, password: string) {
  return this.api.post<{ token: string }>('/auth/login', { email, password })
    .pipe(
      tap(response => localStorage.setItem('token', response.token))
    );
}

logout() {
  localStorage.removeItem('token');
}
```

### Interceptor HTTP

El `ApiInterceptor` agrega automáticamente el token en todas las peticiones:

```typescript
// El token se envía en cada request
Authorization: Bearer <token>
```

### Manejo de Errores

Los errores HTTP se propagan con contexto:

```typescript
this.api.get('/routes').subscribe(
  (data) => console.log(data),
  (error) => {
    console.error('Error:', error.error.message);
    // Notificar usuario
  }
);
```

## Seguridad

### Autenticación
- Token-based JWT
- Almacenamiento seguro en localStorage
- Validación en cada request

### Guards
- `AuthGuard` protege rutas que requieren autenticación
- Redirección automática a login si no hay token

### CORS
Configurado en el backend Django para aceptar requests desde el frontend.

## Scripts Disponibles

```bash
npm start              # Inicia el servidor de desarrollo
npm run build          # Compila para producción
npm run watch          # Modo watch para desarrollo
npm test               # Ejecuta tests unitarios
npm run serve:ssr      # Ejecuta el servidor SSR
ng generate <type>    # Genera componentes, servicios, etc.
```

## Troubleshooting

### Problem: "Cannot find module '@angular/core'"
**Solution:** Ejecutar `npm install`

### Problem: "API connection refused"
**Solution:** Asegúrate que el backend esté ejecutándose en `http://localhost:8000`

### Problem: "Port 4200 already in use"
**Solution:** `ng serve --port 4300`

### Problem: "Token missing or invalid"
**Solution:** Verifica las credenciales de login y que el token se guarde correctamente

## Documentación Adicional

- [Angular Docs](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev)
- [Vitest Guide](https://vitest.dev)

## Ver también

- [API Backend - Logistics Route Management API](../logistics-route-management-api)

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Make a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push al branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Licencia

Este proyecto es propiedad de Falabella. Todos los derechos reservados.

---

**Última actualización:** Marzo 2026
**Angular Version:** 21.2.0
**Node Version:** 20+
