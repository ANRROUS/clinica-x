# Plan Clínica X — Resumen de Sesión

> **Fecha:** 2026-05-15  
> **Estado actual:** Fase 0 ✅ + Fase 1 ✅ + Fase 2 ✅ + Fase 3 ✅ + Fase 4 ✅ + Fase 5 ✅ + Fase 6 ✅ completadas  
> **Próxima fase:** Fase 7 (Frontend admin)

---

## 1. Decisiones Arquitectónicas Clave

| Decisión | Valor elegido |
|---|---|
| **Monorepo** | pnpm workspaces |
| **Microservicios** | 4 servicios de negocio + 1 API Gateway |
| **Frontend** | Next.js 14 (App Router) + Tailwind v3 + lucide-react + react-icons |
| **Backend** | Express + TypeScript estricto + Hexagonal/DDD por módulo |
| **ORM** | Prisma (un schema.prisma por servicio) |
| **Base de datos** | 1 proyecto Supabase Postgres, 4 schemas separados |
| **Storage** | AWS S3 (bucket privado, signed URLs) |
| **Auth** | Propia con JWT + bcrypt (no Supabase Auth) |
| **Idioma de código** | Español (entidades, VOs, métodos) |
| **Chat IA (Agente X)** | Stub "Próximamente" en Fase 0-4, activable con feature flag |
| **Tests** | Postergados (Fase 8 o después) |

### Servicios y puertos

| Servicio | Puerto | Schema Postgres | Responsabilidad |
|---|---|---|---|
| `auth-service` | 3000 | `auth_service` | Usuarios, login, registro, JWT, perfiles |
| `appointment-service` | 3001 | `appointment_service` | Médicos + horarios (admin), citas, calendario, dashboard |
| `clinical-service` | 3002 | `clinical_service` | Consultas, diagnósticos, recetas, análisis, chat IA stub |
| `file-service` | 3003 | `file_service` | Uploads S3, signed URLs, validación de archivos |
| `api-gateway` | 8080 | — | Reverse proxy + JWT temprano + CORS + rate limit |
| `frontend` | 3100 | — | Next.js (3 portales: paciente, médico, admin) |

---

## 2. Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS v3
- **Íconos:** lucide-react + react-icons
- **Estado global:** Zustand (uno por rol: paciente, médico, admin)
- **Data fetching:** TanStack React Query
- **Formularios:** React Hook Form + Zod
- **Notificaciones:** sonner
- **HTTP:** axios (3 instancias con 3 tokens diferentes)

### Backend (por servicio)
- **Runtime:** Node.js 20+
- **Framework:** Express 4
- **Lenguaje:** TypeScript estricto
- **ORM:** Prisma + `@prisma/client`
- **Validación:** Zod (en adaptadores HTTP, **no** en dominio)
- **Auth:** jsonwebtoken + bcrypt (solo auth-service)
- **Logging:** pino + pino-pretty
- **Seguridad:** helmet, cors, express-rate-limit
- **Storage:** @aws-sdk/client-s3 (file-service)
- **AI:** openai (clinical-service, deshabilitado por flag)
- **Proxy:** http-proxy-middleware (api-gateway)

### Infraestructura
- **Orquestación:** Docker Compose (bind a `127.0.0.1`)
- **Workspace:** pnpm workspaces
- **BD:** Supabase Postgres (pooler `:6543` + directo `:5432` para Prisma)
- **Storage:** AWS S3

---

## 3. Arquitectura Hexagonal + DDD por Módulo

Cada módulo de cada microservicio replica la estructura de la plantilla:

```
src/modules/<contexto>/
  ├── domain/
  │   ├── entities/         # Rich Entities (constructor privado + factory)
  │   ├── value-objects/    # VOs inmutables (factory retorna Result)
  │   ├── events/           # Eventos de dominio
  │   ├── exceptions/       # Errores tipados (heredan de ErrorDominio)
  │   ├── ports/
  │   │   ├── in/           # Input ports (contratos de use cases)
  │   │   └── out/          # Output ports (repos, notifiers, external APIs)
  │   ├── services/         # Domain services (stateless, sin infraestructura)
  │   └── types/            # Tipos auxiliares del dominio
  ├── application/
  │   └── features/<feature>/
  │       ├── *.dto.ts
  │       ├── *.use-case.ts
  │       └── on-*.handler.ts
  └── infrastructure/
      ├── adapters/
      │   ├── in/http/      # Controllers + Routers
      │   └── out/
      │       ├── persistence/   # Prisma repositories
      │       └── external-apis/ # S3, OpenAI, otros servicios HTTP
      └── di.ts             # Composition root (único que conoce concretos)
```

**Reglas de oro:**
- Dominio **no** conoce Express, Prisma, fetch, S3, ni nada de infraestructura.
- `di.ts` es el **único** archivo que instancia implementaciones concretas.
- Cada módulo solo exporta su router (`index.ts`).
- Errores del dominio retornan `Result<T, ErrorDominio>` (no `throw`).
- Entidades tienen constructor privado + factory `create()`.

---

## 4. Estructura del Repo

```
clinica-x/
├── frontend/                          # Next.js 14 (puerto 3100)
│   ├── src/app/
│   │   ├── page.tsx                   # Landing mejorada
│   │   ├── layout.tsx                 # Root layout con Providers + Toaster
│   │   ├── globals.css
│   │   ├── login/page.tsx             # Login paciente (DNI + Email + Password)
│   │   ├── register/page.tsx          # Registro paciente
│   │   ├── reservar-cita/page.tsx    # Wizard de reserva completo
│   │   ├── perfil/page.tsx            # Perfil con 3 tabs
│   │   ├── doctor/
│   │   │   ├── layout.tsx             # Root layout doctor (solo Providers)
│   │   │   ├── login/page.tsx         # Login médico (valida rol MEDICO)
│   │   │   └── (portal)/
│   │   │       ├── layout.tsx         # Auth layout con sidebar
│   │   │       ├── calendario/page.tsx # Calendario médico (3 vistas)
│   │   │       ├── pacientes/page.tsx  # Historial de pacientes
│   │   │       └── consulta/page.tsx   # Consulta médica activa
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Placeholder
│   │   │   └── dashboard/page.tsx    # Placeholder
│   ├── src/components/
│   │   ├── shared/
│   │   │   ├── Header.tsx             # Header dinámico (paciente)
│   │   │   └── Footer.tsx
│   │   ├── landing/ContactForm.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx           # Formulario login paciente
│   │   │   └── RegisterForm.tsx       # Formulario registro paciente
│   │   ├── booking/
│   │   │   ├── SpecialtySidebar.tsx
│   │   │   ├── DoctorSelector.tsx
│   │   │   ├── DaySelector.tsx
│   │   │   ├── SlotSelector.tsx
│   │   │   └── ConfirmBookingModal.tsx
│   │   ├── patient-profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileTabs.tsx
│   │   │   ├── ConsultationsTab.tsx
│   │   │   ├── TreatmentTab.tsx
│   │   │   └── AppointmentsTab.tsx
│   │   ├── doctor/
│   │   │   ├── DoctorLoginForm.tsx     # Login médico con validación de rol
│   │   │   ├── DoctorSidebar.tsx       # Sidebar navegación portal médico
│   │   │   ├── DoctorCalendar.tsx      # Contenedor calendario (3 vistas)
│   │   │   ├── CalendarMonth.tsx       # Vista mensual grilla
│   │   │   ├── CalendarWeek.tsx        # Vista semanal timeline
│   │   │   ├── CalendarDay.tsx         # Vista diaria con acciones
│   │   │   ├── ConsultationPanel.tsx   # Panel iniciar/finalizar consulta
│   │   │   └── PatientHistory.tsx      # Historial agrupado por paciente
│   │   └── Providers.tsx
│   ├── src/hooks/                     # (pendiente)
│   ├── src/lib/api/
│   │   ├── axios.ts                   # Cliente HTTP con 3 tokens + interceptor JWT
│   │   ├── types.ts                   # DTOs compartidos + CitaCalendarioDTO, ConsultaMedicoDTO
│   │   ├── auth.api.ts                # login, register, getMe, updateMe
│   │   ├── appointments.api.ts        # endpoints paciente
│   │   ├── medical.api.ts             # endpoints paciente
│   │   └── doctor.api.ts              # 6 endpoints médico (calendario, consulta, pacientes)
│   ├── src/store/
│   │   ├── useAuthStore.ts            # Zustand paciente
│   │   ├── useBookingStore.ts         # Zustand flujo de reserva
│   │   └── useDoctorAuthStore.ts      # Zustand médico
│   └── tailwind.config.ts             # Paleta teal/indigo
│
├── services/
│   ├── auth-service/                  # 3000 → /api/auth/*
│   │   ├── prisma/schema.prisma       # schema = auth_service
│   │   ├── src/server.ts              # Bootstrap Express
│   │   ├── src/env.ts                 # Validación Zod de variables
│   │   ├── src/shared/                # logger, prisma-client
│   │   ├── src/modules/               # (vacío en Fase 0)
│   │   ├── Dockerfile
│   │   └── .env / .env.example
│   │
│   ├── appointment-service/           # 3001 → /api/admin/* + /api/appointments/*
│   │   ├── prisma/schema.prisma       # schema = appointment_service
│   │   └── ... (misma estructura)
│   │
│   ├── clinical-service/              # 3002 → /api/medical/*
│   │   ├── prisma/schema.prisma       # schema = clinical_service
│   │   ├── src/modules/consultas/     # Módulo hexagonal COMPLETO
│   │   └── ...
│   │
│   ├── file-service/                  # 3003 → /api/files/*
│   │   ├── prisma/schema.prisma       # schema = file_service
│   │   ├── src/shared/s3-client.ts    # Cliente AWS S3
│   │   ├── src/modules/archivos/      # Módulo hexagonal COMPLETO
│   │   └── ...
│   │
│   └── api-gateway/                   # 8080 → reverse proxy
│       ├── src/proxy/routes.ts        # Mapeo de rutas → upstreams
│       ├── src/server.ts              # Proxy + JWT + rate limit
│       └── ...
│
├── packages/
│   ├── shared-kernel/                 # Result<T,E>, ErrorDominio, EntidadBase, ValueObjectBase
│   ├── shared-middleware/             # jwtMiddleware, requireRole, errorHandler, requestId
│   └── shared-types/                  # Rol, UsuarioDTO, ApiResponse, enums de estados
│
├── scripts/
│   ├── clean-schemas.sql              # DROP/CREATE de los 4 schemas
│   └── clean-schemas.js               # Wrapper Node (usa `pg`)
│
├── plantilla/                         # Plantilla de referencia DDD/Hexagonal
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .env                               # Variables reales (NO se comitea)
├── .env.example                       # Plantilla pública
├── .gitignore
├── .npmrc
├── .editorconfig
├── .prettierrc
├── .prettierignore
└── README.md
```

---

## 5. Mapa de Endpoints (vía Gateway en 8080)

| Ruta | Servicio destino | Rol requerido |
|---|---|---|
| `POST /api/auth/register` | auth-service | Público |
| `POST /api/auth/login` | auth-service | Público |
| `GET /api/auth/me` | auth-service | Cualquiera autenticado |
| `PUT /api/auth/me` | auth-service | Cualquiera autenticado |
| `GET /api/admin/doctors` | appointment-service | ADMIN |
| `POST /api/admin/doctors` | appointment-service | ADMIN |
| `PUT /api/admin/doctors/:id` | appointment-service | ADMIN |
| `PATCH /api/admin/doctors/:id/status` | appointment-service | ADMIN |
| `GET /api/admin/dashboard/metrics` | appointment-service | ADMIN |
| `GET /api/appointments/availability` | appointment-service | PACIENTE |
| `POST /api/appointments/book/manual` | appointment-service | PACIENTE |
| `POST /api/appointments/book/automatic` | appointment-service | PACIENTE |
| `GET /api/appointments/patient/me` | appointment-service | PACIENTE |
| `PUT /api/appointments/patient/:id` | appointment-service | PACIENTE |
| `DELETE /api/appointments/patient/:id` | appointment-service | PACIENTE |
| `GET /api/appointments/doctor/calendar` | appointment-service | MEDICO |
| `PATCH /api/appointments/doctor/:id/status` | appointment-service | MEDICO |
| `POST /api/medical/doctor/consultation/start` | clinical-service | MEDICO |
| `POST /api/medical/doctor/consultation/:id/finalize` | clinical-service | MEDICO |
| `GET /api/medical/doctor/active-patient` | clinical-service | MEDICO |
| `GET /api/medical/doctor/patients` | clinical-service | MEDICO |
| `GET /api/medical/patient/history` | clinical-service | PACIENTE |
| `GET /api/medical/patient/consultation/:id` | clinical-service | PACIENTE / MEDICO |
| `POST /api/medical/doctor/ai/chat` | clinical-service | MEDICO (stub) |
| `POST /api/files/upload` | file-service | PACIENTE / MEDICO |
| `GET /api/files/:id/signed-url` | file-service | Cualquiera autenticado |
| `DELETE /api/files/:id` | file-service | PACIENTE / MEDICO |

---

## 6. Roadmap de Fases

| # | Fase | Contenido | Estado |
|---|---|---|---|
| 0 | **Bootstrap** | Monorepo, packages compartidos, esqueletos de 5 servicios, frontend Next.js, Docker Compose, configs, README | ✅ **COMPLETADO** |
| 1 | **auth-service** | Módulo `usuarios`: registro paciente, login triple (DNI+Email+Password), JWT, `me`, update perfil, seed admin inicial | ✅ **COMPLETADO** |
| 2 | **appointment-service (admin)** | Módulos `medicos`, `especialidades`, `dashboard-admin`: CRUD médicos, horarios (grid interactivo), métricas KPI | ✅ **COMPLETADO** |
| 3 | **appointment-service (booking)** | Módulos `disponibilidad`, `reservas`, `calendario-medico`: slots, reserva manual/automática, reprogramar, cancelar, calendario 3 vistas | ✅ **COMPLETADO** |
| 4 | **clinical + file** | Módulos `consultas`, `archivos`: FSM consulta (ACTIVA→FINALIZADA), uploads S3 multipart, signed URLs, validación MIME/tamaño | ✅ **COMPLETADO** |
| 5 | **Frontend paciente** | Landing, login/register, reservar cita (manual + automático), perfil (3 tabs), visualización PDFs | ✅ **COMPLETADO** |
| 6 | **Frontend médico** | Login médico, calendario (3 vistas), sidebar pacientes, consulta activa (diagnóstico + notas), historial agrupado, placeholder Agente X | ✅ **COMPLETADO** |
| 7 | **Frontend admin** | Login, dashboard con métricas KPI, tabla de médicos con filtro/toggle, formulario médico (datos + grid horario), zona de peligro | Pendiente |
| 8 | **Integración E2E** | Seed de datos demo, flujos end-to-end, ajustes de UI, pulido de responsive | Pendiente |

---

## 7. Qué se completó en Fase 0

### Raíz del monorepo
- [x] `pnpm-workspace.yaml` con 3 grupos (`packages/*`, `services/*`, `frontend`)
- [x] `package.json` raíz con scripts globales (`dev`, `build`, `prisma:generate:all`, `prisma:migrate:all`, `db:reset`)
- [x] `tsconfig.base.json` extendido por todos los proyectos
- [x] `.gitignore`, `.dockerignore`, `.editorconfig`, `.prettierrc`, `.prettierignore`, `.eslintrc.json`, `.npmrc`
- [x] `.env` raíz con credenciales reales de Supabase (no se comitea)
- [x] `.env.example` raíz con placeholders (sí se comitea)

### Packages compartidos
- [x] `packages/shared-kernel/`: `Result<T,E>`, `Ok`, `Err`, `ErrorDominio`, `EntidadBase`, `ValueObjectBase`
- [x] `packages/shared-middleware/`: `jwtMiddleware` (con skipPaths), `requireRole`, `errorHandler` (convierte ErrorDominio + ZodError a HTTP), `requestIdMiddleware`
- [x] `packages/shared-types/`: `Rol` (PACIENTE/MEDICO/ADMIN), `UsuarioDTO`, `ApiResponse<T>`, enums (`EstadoCita`, `Turno`, `EstadoConsulta`, `DiaSemana`)
- [x] Los 3 packages compilan sin errores

### 4 microservicios
- [x] `auth-service` (3000): Express + Prisma + env.ts + logger + prisma-client + `/health` + Dockerfile + .env
- [x] `appointment-service` (3001): idem
- [x] `clinical-service` (3002): idem + stub `/api/medical/doctor/ai/chat` → `{ status: "coming_soon" }`
- [x] `file-service` (3003): idem + cliente AWS S3 (`s3-client.ts`)
- [x] Cada servicio tiene `schema.prisma` con datasource apuntando al schema correcto + modelo `Placeholder` (Fase 0)
- [x] Clientes Prisma generados para los 4 servicios
- [x] Todos los servicios compilan sin errores TypeScript

### API Gateway
- [x] Express + `http-proxy-middleware` enrutando las 4 rutas base
- [x] `jwtMiddleware` con `skipPaths` para rutas públicas (`/api/auth/login`, `/api/auth/register`, `/health`)
- [x] CORS configurado con `CORS_ORIGIN` del `.env`
- [x] Rate limit global (300 req/min/IP)
- [x] Propagación de `X-Request-Id`
- [x] Handler de errores de proxy (502 cuando un servicio no responde)
- [x] Compila sin errores

### Frontend
- [x] Next.js 14 con App Router, TypeScript, Tailwind v3
- [x] Config `tailwind.config.ts` con paleta brand teal/indigo
- [x] Estructura de carpetas completa: `app/(public)`, `app/(patient)`, `app/(doctor)`, `app/(admin)`
- [x] Páginas placeholder para todas las rutas definidas en los 3 flujos
- [x] Cliente axios (`lib/axios.ts`) con 3 tokens (paciente/médico/admin) y auto-logout en 401
- [x] Landing page con hero, features, footer
- [x] Compila sin errores (11 rutas estáticas generadas)

### Docker + Scripts
- [x] `docker-compose.yml` con 5 servicios, binding a `127.0.0.1`, red bridge `clinica-x-net`
- [x] `Dockerfile` multi-stage para cada uno de los 5 servicios
- [x] `scripts/clean-schemas.sql`: DROP/CREATE de los 4 schemas
- [x] `scripts/clean-schemas.js`: Wrapper Node que lee el `.env` raíz y ejecuta el SQL vía `pg`
- [x] `README.md` completo con setup, ejecución, mapa de endpoints, troubleshooting, convenciones

---

## 8. Qué se completó en Fase 2

### appointment-service (módulo `medicos/`)
- [x] Schema Prisma actualizado: `Especialidad`, `Medico`, `HorarioMedico`, `Cita` (modelos + enums `Turno`, `EstadoCita`, `TipoReserva`)
- [x] Sincronizado con Supabase via `prisma db push`
- [x] Seed de especialidades ejecutado (10 especialidades médicas)
- [x] Módulo hexagonal `medicos/` completo:
  - `domain/`: entidad `Medico`, VO `HorarioMedico`, excepciones (`MedicoDuplicadoError`, `MedicoNoEncontradoError`, etc.)
  - `application/features/`: 6 casos de uso (crear, actualizar, listar, obtener, cambiar estado, métricas dashboard)
  - `infrastructure/`: `PrismaMedicoRepository`, `MedicosController`, `MedicosRouter`, `AuthServiceClient`, `di.ts`
- [x] Integración cross-service: `AuthServiceClient` llama a `auth-service` para crear `Usuario` con rol `MEDICO`
- [x] Endpoints de admin testeados E2E:
  - `GET /api/admin/doctors` → lista + métricas KPI
  - `POST /api/admin/doctors` → crea médico + usuario + horarios
  - `GET /api/admin/doctors/:id` → detalle
  - `PUT /api/admin/doctors/:id` → actualiza médico + horarios
  - `PATCH /api/admin/doctors/:id/status` → activar/desactivar

### auth-service (mejoras Fase 2)
- [x] `registrarSchema` acepta `rol` opcional (`PACIENTE` | `MEDICO` | `ADMIN`)
- [x] Protección de roles: header `X-Internal-Api-Key` requerido para crear `MEDICO`/`ADMIN`
- [x] `CrearUsuarioUseCase` respeta `dto.rol` (default `PACIENTE`)

### Infraestructura y tooling
- [x] Todos los servicios tienen `tsc-alias` + script `postbuild:prisma` para copiar cliente Prisma a `dist/`
- [x] Clientes Prisma aislados con `output = "../src/generated/prisma"` en cada schema
- [x] Eliminado `@types/bcryptjs` deprecated; agregado `"types": ["node"]` en `shared-kernel` y `shared-types`
- [x] Todo el monorepo (10 proyectos) compila sin errores TypeScript

---

## 9. Qué se completó en Fase 3

### appointment-service (módulo `citas/`)
- [x] Entidad `Cita` con estados `CONFIRMADA`, `EN_ATENCION`, `COMPLETADA`, `CANCELADA`
- [x] Excepciones tipadas: `CitaNoEncontradaError`, `SlotNoDisponibleError`, `NoSePuedeCancelarError`, `NoSePuedeReprogramarError`, `PacienteNoAutorizadoError`
- [x] Puerto `IMedicoConsultaPort` para desacoplar módulo citas de médicos (read-only)
- [x] 7 casos de uso implementados:
  - `crear-cita` (manual) → valida médico activo, slot libre, > 4 horas de anticipación
  - `crear-cita-automatica` → busca primer slot libre en próximos 7 días entre médicos de especialidad
  - `cancelar-cita` → valida propietario y > 1 hora de anticipación
  - `reprogramar-cita` → valida propietario, slot libre, > 1 hora
  - `listar-citas-paciente` → citas del paciente con datos del médico
  - `listar-citas-medico` → calendario del médico con filtros de fecha
  - `obtener-disponibilidad` → genera slots de 30 minutos basados en `HorarioMedico` y citas existentes
  - `cambiar-estado-cita` → permite médico marcar `EN_ATENCION` / `COMPLETADA`
- [x] Repositorio `PrismaCitaRepository` con métodos: guardar, buscarPorId, buscarPorPaciente, buscarPorMedico, buscarPorMedicoYFecha, contarCitasEnRango, actualizar
- [x] `PrismaMedicoConsulta` adaptador read-only para consultar médicos y horarios sin acoplar dominios
- [x] `CitasController` con validación Zod y protección de rol por ruta (`requireRole(['PACIENTE'])` / `requireRole(['MEDICO']`)
- [x] `CitasRouter` montado en `/api/appointments` con sub-rutas para paciente y médico
- [x] Endpoints testeados E2E:
  - `GET /api/appointments/availability` → slots por médico y fecha
  - `GET /api/appointments/availability/specialty/:id` → doctores con disponibilidad
  - `POST /api/appointments/book/manual` → reserva manual
  - `POST /api/appointments/book/automatic` → reserva automática
  - `GET /api/appointments/patient/me` → listar citas del paciente
  - `PUT /api/appointments/patient/:id` → reprogramar cita
  - `DELETE /api/appointments/patient/:id` → cancelar cita
  - `GET /api/appointments/doctor/calendar` → calendario del médico logueado
  - `PATCH /api/appointments/doctor/:id/status` → cambiar estado de cita

---

## 10. Convenciones de Código

- **Idioma:** español para identificadores y comentarios (`EntidadBase`, `ErrorDominio`, `CrearConsultaUseCase`)
- **Entidades:** constructor privado + factory `create()` que retorna `Result<T, Error>`
- **Value Objects:** inmutables, validados en `create()`, comparación estructural (`equals()`)
- **Errores de dominio:** heredan de `ErrorDominio` (campo `codigo` + `httpStatus`)
- **Use cases:** orquestan el flujo, no contienen lógica de negocio. Retornan `Result`.
- **Controladores HTTP:** adaptadores del puerto de entrada. No conocen dominio directamente.
- **DTOs de entrada:** validados con Zod en el adaptador HTTP.
- **DTOs de salida:** planos (primitives), no exponen entidades ni VOs.
- **Tokens JWT:** 3 almacenes separados en localStorage:
  - `clinica_x_token` (paciente)
  - `clinica_x_doctor_token` (médico)
  - `clinica_x_admin_token` (admin)

---

## 11. Variables de Entorno

Las credenciales reales están en `.env` y en cada servicio. Las URLs de Supabase y AWS deben **no** ser comiteadas. Resumen de las claves:

```
# Compartidas (raíz + docker-compose)
HOST_BIND_IP=127.0.0.1
HOST_AUTH_PORT=3000
HOST_APPOINTMENT_PORT=3001
HOST_CLINICAL_PORT=3002
HOST_FILE_PORT=3003
HOST_GATEWAY_PORT=8080
JWT_SECRET=...
JWT_EXPIRES_IN=1d

# Supabase (4 URLs: DATABASE_URL pooler + DIRECT_URL directo)
AUTH_DATABASE_URL=postgresql://...:6543/postgres?schema=auth_service&pgbouncer=true&sslmode=require
AUTH_DIRECT_URL=postgresql://...:5432/postgres?schema=auth_service&sslmode=require
APPOINTMENT_DATABASE_URL=...
APPOINTMENT_DIRECT_URL=...
CLINICAL_DATABASE_URL=...
CLINICAL_DIRECT_URL=...
FILE_DATABASE_URL=...
FILE_DIRECT_URL=...

# AWS S3 (file-service)
AWS_REGION=us-east-1
AWS_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# OpenAI (clinical-service, deshabilitado)
OPENAI_API_KEY=...
AI_TIMEOUT_MS=20000
AI_ENABLED=false

# Gateway
CORS_ORIGIN=http://localhost:3100
```

---

## 12. Qué se completó en Fase 4

### clinical-service (módulo `consultas/`)
- [x] Schema Prisma actualizado: `Consulta`, `OrdenAnalisis`
- [x] Sincronizado con Supabase via `prisma db push`
- [x] Módulo hexagonal `consultas/` completo:
  - `domain/`: entidad `Consulta`, excepciones (`ConsultaNoEncontradaError`, `ConsultaYaFinalizadaError`, `ConsultaActivaExistenteError`, `PacienteNoAutorizadoError`, `MedicoNoAutorizadoError`)
  - `application/features/`: 5 casos de uso (`iniciar-consulta`, `finalizar-consulta`, `obtener-consulta`, `listar-consultas-paciente`, `listar-consultas-medico`)
  - `infrastructure/`: `PrismaConsultaRepository`, `ConsultasController`, `ConsultasRouter`, `di.ts`
- [x] Integración en `server.ts`: `/api/medical` con `jwtMiddleware` + `requireRole` por ruta
- [x] Endpoints definidos:
  - `POST /api/medical/doctor/consultation/start` → iniciar consulta (MEDICO)
  - `POST /api/medical/doctor/consultation/:id/finalize` → finalizar consulta (MEDICO)
  - `GET /api/medical/doctor/active-patient` → consulta activa del médico (MEDICO)
  - `GET /api/medical/doctor/patients` → historial de pacientes del médico (MEDICO)
  - `GET /api/medical/patient/history` → historial del paciente logueado (PACIENTE)
  - `GET /api/medical/patient/consultation/:id` → detalle de consulta (PACIENTE)

### file-service (módulo `archivos/`)
- [x] Schema Prisma actualizado: `Archivo`
- [x] Sincronizado con Supabase via `prisma db push`
- [x] Módulo hexagonal `archivos/` completo:
  - `domain/`: entidad `Archivo`, excepciones (`ArchivoNoEncontradoError`, `TipoMimeNoPermitidoError`, `TamanoArchivoExcedidoError`)
  - `application/features/`: 3 casos de uso (`subir-archivo`, `obtener-url-firmada`, `eliminar-archivo`)
  - `infrastructure/`: `PrismaArchivoRepository`, `S3StorageAdapter`, `ArchivosController`, `ArchivosRouter`, `di.ts`
- [x] Upload multipart vía `multer` (memoryStorage)
- [x] Validación de MIME type (`ALLOWED_MIME_TYPES`) y tamaño (`MAX_FILE_SIZE_BYTES`)
- [x] Signed URLs S3 con expiración configurable (default 1 hora)
- [x] Integración en `server.ts`: `/api/files` con `jwtMiddleware`

### Infraestructura y tooling
- [x] `tsc-alias` agregado a `clinical-service` y `file-service` (faltaba desde Fase 0)
- [x] Scripts de build actualizados: `tsc -p tsconfig.json && tsc-alias -p tsconfig.json && pnpm postbuild:prisma`
- [x] Todo el monorepo compila sin errores TypeScript

### Testeo E2E Fase 4
- [x] clinical-service: iniciar consulta (201), finalizar consulta (200), historial paciente (200), obtener consulta por ID (200)
- [x] file-service: upload sin archivo (400), upload tipo no permitido (400), signed URL inexistente (404)
- [x] file-service upload a S3: falla con credenciales placeholder (se necesita configurar AWS_ACCESS_KEY_ID real en `.env`)

---

## 13. Qué se completó en Fase 5

### Frontend paciente
- [x] Landing page mejorada con hero, sección de características y formulario de contacto
- [x] Login/Registro paciente con validación Zod + React Hook Form
- [x] Stores Zustand: `useAuthStore` (auth persistido en localStorage) y `useBookingStore` (flujo de reserva)
- [x] Cliente axios configurado con interceptor de JWT y auto-logout en 401
- [x] Página de reserva de citas con wizard paso a paso
- [x] Página de perfil con 3 tabs: Consultas, Tratamiento (placeholder), Reservas
- [x] Header dinámico (estado autenticado vs no autenticado) con soporte responsive
- [x] React Query Provider + Sonner para notificaciones toast
- [x] Endpoint backend: `GET /api/appointments/specialties`

### Componentes paciente
- [x] `LoginForm.tsx`, `RegisterForm.tsx` con validación Zod
- [x] `SpecialtySidebar.tsx`, `DoctorSelector.tsx`, `DaySelector.tsx`, `SlotSelector.tsx`, `ConfirmBookingModal.tsx`
- [x] `ProfileHeader.tsx`, `ProfileTabs.tsx`, `ConsultationsTab.tsx`, `TreatmentTab.tsx`, `AppointmentsTab.tsx`
- [x] `Header.tsx` (dinámico), `Footer.tsx`, `ContactForm.tsx`, `Providers.tsx`

---

## 14. Qué se completó en Fase 6

### Store médico
- [x] `useDoctorAuthStore`: gestiona user, token, isAuthenticated para rol MEDICO
- [x] Persiste en localStorage bajo `clinica_x_doctor_token` y `clinica_x_doctor_user`
- [x] Valida que el rol sea `MEDICO` al cargar auth persistida (si no, limpia storage)
- [x] Acciones: `setAuth`, `clearAuth`, `updateUser`

### API médico (`lib/api/doctor.api.ts`)
- [x] `getDoctorCalendar(params?)` → `GET /api/appointments/doctor/calendar`
- [x] `changeAppointmentStatus(id, estado)` → `PATCH /api/appointments/doctor/:id/status`
- [x] `startConsultation(data)` → `POST /api/medical/doctor/consultation/start`
- [x] `finalizeConsultation(id, data)` → `POST /api/medical/doctor/consultation/:id/finalize`
- [x] `getActivePatient()` → `GET /api/medical/doctor/active-patient`
- [x] `getDoctorPatients(params?)` → `GET /api/medical/doctor/patients`

### Tipos nuevos (`lib/api/types.ts`)
- [x] `CitaCalendarioDTO`: extiende CitaDTO con datos del paciente (nombre, apellido)
- [x] `ConsultaMedicoDTO`: extiende ConsultaDTO con datos del paciente
- [x] `PacienteHistorialDTO`: resumen por paciente para el historial

### Route groups Next.js
- [x] `/doctor/layout.tsx`: Root layout (solo Providers, sin sidebar)
- [x] `/doctor/login/page.tsx`: Login fuera del portal autenticado
- [x] `/doctor/(portal)/layout.tsx`: Auth layout con `DoctorSidebar` y redirección si no autenticado
- [x] `/doctor/(portal)/calendario/page.tsx`: Página calendario con React Query
- [x] `/doctor/(portal)/pacientes/page.tsx`: Página historial de pacientes
- [x] `/doctor/(portal)/consulta/page.tsx`: Página consulta activa

### Componentes médicos
- [x] `DoctorLoginForm.tsx`: Login con validación Zod (DNI + Email + Password), verifica rol MEDICO
- [x] `DoctorSidebar.tsx`: Navegación lateral con avatar, links (Calendario, Pacientes), logout
- [x] `DoctorCalendar.tsx`: Contenedor principal con selector de vista (mensual/semanal/diaria) y navegación de fechas
- [x] `CalendarMonth.tsx`: Vista mensual con grilla de días y citas coloreadas por estado
- [x] `CalendarWeek.tsx`: Vista semanal con timeline 7am-8pm y tarjetas de cita clickeables
- [x] `CalendarDay.tsx`: Vista diaria con lista detallada de citas y botones de acción contextuales
- [x] `ConsultationPanel.tsx`: Panel para iniciar consulta (motivo) y finalizar (diagnóstico + notas) con validación Zod
- [x] `PatientHistory.tsx`: Historial agrupado por paciente, expandible, con badges de estado

### Funcionalidades del portal médico
- [x] Login médico con validación de rol (solo MEDICO puede acceder)
- [x] Calendario con 3 vistas intercambiables (mensual, semanal, diaria)
- [x] Navegación de fechas (anterior/siguiente/hoy) en calendario
- [x] Cambio de estado de citas desde vista diaria (CONFIRMADA → EN_ATENCION → COMPLETADA)
- [x] Inicio de consulta médica desde cita (navega a `/doctor/consulta`)
- [x] Panel de consulta activa con campos de diagnóstico y notas
- [x] Finalizar consulta y volver al calendario
- [x] Historial de pacientes filtrable por rango de fechas
- [x] Indicador de consulta activa en página de pacientes
- [x] Placeholder de Agente X (chat IA "Próximamente")
- [x] Auto-logout en 401 redirige a `/doctor/login`

### Build y lint
- [x] `next build` exitoso sin errores (14 rutas generadas)
- [x] `next lint` sin warnings ni errores

---

## 15. Próximos pasos (Fase 7: Frontend admin)

1. **Portal admin:**
   - Login admin (reusar LoginForm con rol ADMIN)
   - Store `useAdminAuthStore` con `clinica_x_admin_token`
   - Dashboard con métricas KPI (`GET /api/admin/dashboard/metrics`)
   - Tabla de médicos con filtros y toggle de estado
   - Formulario de creación/edición de médico con grid de horarios
   - Zona de peligro (desactivar médico)

2. **Preparación Fase 8 (Integración E2E):**
   - Seed de datos demo
   - Pulido responsive
   - Tests manuales de flujos completos

---

## 16. Historial de sesiones

| # | Fecha | Fases | Logros clave |
|---|---|---|---|
| 1 | 2026-05-14 | 0 + 1 | Bootstrap completo del monorepo. auth-service funcional con registro, login (triple DNI+Email+Password), JWT, perfil. Seed admin creado. Frontend Next.js con landing page. |
| 2 | 2026-05-14→15 | 2 | appointment-service admin: CRUD médicos, horarios, dashboard KPI, seed especialidades, integración cross-service auth-service. Prisma clients aislados. Todo compila y endpoints testeados E2E. |
| 3 | 2026-05-15 | 3 | appointment-service booking: módulo `citas/` hexagonal completo. Reserva manual/automática, disponibilidad con slots de 30 min, cancelar, reprogramar, calendario médico, cambiar estado. Todos los endpoints de booking testeados E2E. |
| 4 | 2026-05-15 | 4 | clinical-service: módulo `consultas/` hexagonal completo. file-service: módulo `archivos/` con upload multipart a S3, signed URLs, validación MIME/tamaño. Schemas Prisma sincronizados. tsc-alias agregado a servicios faltantes. Todo compila y levanta. |
| 5 | 2026-05-15 | 5 | Frontend paciente: landing mejorada, login/registro con Zod, stores Zustand, wizard de reservas, perfil con 3 tabs, React Query + Sonner. 14 rutas generadas sin errores. |
| 6 | 2026-05-15 | 6 | Frontend médico: login con validación de rol, store `useDoctorAuthStore`, calendario 3 vistas (mensual/semanal/diaria), consulta activa (iniciar/finalizar), historial pacientes agrupado, route groups `(portal)`, 7 componentes nuevos, `doctor.api.ts` con 6 endpoints. Build y lint limpios. |

---

*Documento actualizado al finalizar la Fase 6 del proyecto Clínica X.*
