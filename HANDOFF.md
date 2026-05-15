# HANDOFF — Clínica X

> **Fecha de sesión:** 2026-05-15
> **Sesión #:** 4 (Fase 4 clinical-service + file-service)
> **Estado:** Fase 0 ✅ | Fase 1 ✅ | Fase 2 ✅ | Fase 3 ✅ | Fase 4 ✅ | Listo para Fase 5

---

## Resumen ejecutivo

En la sesión #4 se implementaron los módulos de **consultas (`consultas/`)** en `clinical-service` y **archivos (`archivos/`)** en `file-service`, completando la Fase 4 del proyecto.

**Logros clave de esta sesión:**
- Módulo `consultas/` hexagonal completo en clinical-service
  - Entidad `Consulta`, estados `ACTIVA` → `FINALIZADA`
  - 5 casos de uso: `iniciar-consulta`, `finalizar-consulta`, `obtener-consulta`, `listar-consultas-paciente`, `listar-consultas-medico`
  - Excepciones tipadas: `ConsultaNoEncontradaError`, `ConsultaYaFinalizadaError`, `ConsultaActivaExistenteError`
  - Repositorio `PrismaConsultaRepository` con filtros por paciente, médico, estado y rango de fechas
  - Controller + Router con validación Zod y protección por rol (`MEDICO` / `PACIENTE`)
- Módulo `archivos/` hexagonal completo en file-service
  - Entidad `Archivo` con validación de MIME type y tamaño
  - 3 casos de uso: `subir-archivo`, `obtener-url-firmada`, `eliminar-archivo`
  - Adaptador S3 (`S3StorageAdapter`) con `PutObjectCommand`, `GetObjectCommand` (signed URLs), `DeleteObjectCommand`
  - Upload multipart vía `multer` (memoryStorage)
  - Repositorio `PrismaArchivoRepository` para persistir metadatos
- Schemas Prisma actualizados y sincronizados con Supabase:
  - `clinical_service`: tablas `consultas`, `ordenes_analisis`
  - `file_service`: tabla `archivos`
- Instalación y configuración de `tsc-alias` en `clinical-service` y `file-service` (faltaba en Fase 0)
- Integración de rutas `/api/medical/*` y `/api/files/*` en sus respectivos `server.ts` con `jwtMiddleware`
- Ambos servicios compilan sin errores TypeScript y levantan correctamente en sus puertos (3002, 3003)

---

## Estado por fase

| Fase | Descripción | Estado | Notas |
|---|---|---|---|
| **0** | Bootstrap del monorepo | ✅ Completa | Todo compila y levanta |
| **1** | auth-service (usuarios) | ✅ Completa | Registro, login, perfil, JWT funcionan |
| **2** | appointment-service (admin) | ✅ Completa | CRUD médicos, horarios, dashboard KPI, cross-service auth |
| **3** | appointment-service (booking) | ✅ Completa | Reservas manual/automática, disponibilidad, cancelar, reprogramar, calendario médico |
| **4** | clinical-service + file-service | ✅ **Completa** | Módulo consultas (iniciar/finalizar/historial), uploads S3, signed URLs |
| **5** | Frontend paciente | ⏳ Pendiente | Landing, auth, reservas, perfil |
| **6** | Frontend médico | ⏳ Pendiente | Calendario, pacientes, consulta, historial |
| **7** | Frontend admin | ⏳ Pendiente | Dashboard, form médico, grid horario |
| **8** | Integración E2E | ⏳ Pendiente | Seed demo, pulido, tests manuales |

---

## Decisiones arquitectónicas (consolidadas)

| Área | Decisión |
|---|---|
| Gestor de paquetes | **pnpm workspaces** |
| Microservicios | 4 servicios + 1 API Gateway (puertos 3000-3003 + 8080) |
| Frontend | Next.js 14 App Router + Tailwind v3 + lucide-react + react-icons |
| Backend | Express + TypeScript estricto + Hexagonal/DDD |
| ORM | **Prisma** (un `schema.prisma` por servicio) |
| Base de datos | 1 proyecto Supabase Postgres, **4 schemas separados** |
| Storage | **AWS S3** (bucket privado, signed URLs) |
| Auth | Propia con JWT + **bcryptjs** (cambiado de bcrypt por compatibilidad Windows) |
| Idioma código | **Español** (entidades, VOs, métodos, comentarios) |
| Chat IA | Stub "Próximamente" (`AI_ENABLED=false`) |
| Alias de imports | `@/` para rutas absolutas dentro de cada servicio |
| Build post-proceso | **`tsc-alias`** reescribe `@/` a rutas relativas en `dist/` |

---

## Estructura del repo (lo que existe ahora)

```
clinica-x/
├── frontend/                          # Next.js 14 (puerto 3100)
│   ├── src/app/                       # Rutas: /, /login, /register, /reservar-cita, /perfil
│   │   ├── (public)/                  #   + /doctor/*, /admin/*
│   │   ├── (patient)/
│   │   ├── (doctor)/
│   │   └── (admin)/
│   ├── src/components/                # Placeholder (.gitkeep)
│   ├── src/hooks/                     # Placeholder
│   ├── src/lib/api/axios.ts           # Cliente HTTP con 3 tokens
│   ├── src/store/                     # Placeholder
│   ├── tailwind.config.ts             # Paleta teal/indigo
│   └── .env.local                     # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
│
├── services/
│   ├── auth-service/                  # 3000 → /api/auth/*
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Modelo Usuario + enum Rol
│   │   │   └── seed.ts                # Crea admin inicial
│   │   ├── src/
│   │   │   ├── server.ts              # Bootstrap + monta /api/auth
│   │   │   ├── env.ts                 # Validación Zod de variables
│   │   │   ├── shared/
│   │   │   │   ├── logger.ts
│   │   │   │   └── prisma-client.ts
│   │   │   └── modules/usuarios/      # Módulo hexagonal COMPLETO
│   │   │       ├── domain/
│   │   │       │   ├── entities/usuario.entity.ts
│   │   │       │   ├── value-objects/{dni,email,password}.vo.ts
│   │   │       │   ├── ports/
│   │   │       │   │   ├── in/usuarios.port.ts      # DTOs + contratos
│   │   │       │   │   └── out/usuario.repository.port.ts
│   │   │       │   └── exceptions/usuario.errors.ts
│   │   │       ├── application/
│   │   │       │   ├── mapper.ts
│   │   │       │   └── features/
│   │   │       │       ├── crear-usuario/crear-usuario.use-case.ts
│   │   │       │       ├── iniciar-sesion/iniciar-sesion.use-case.ts
│   │   │       │       ├── obtener-perfil/obtener-perfil.use-case.ts
│   │   │       │       └── actualizar-perfil/actualizar-perfil.use-case.ts
│   │   │       └── infrastructure/
│   │   │           ├── adapters/
│   │   │           │   ├── in/http/
│   │   │           │   │   ├── usuarios.controller.ts
│   │   │           │   │   └── usuarios.router.ts
│   │   │           │   └── out/
│   │   │           │       ├── persistence/prisma-usuario.repository.ts
│   │   │           │       └── hash/bcrypt-hash.adapter.ts
│   │   │           └── di.ts           # Composition root
│   │   ├── package.json               # Scripts: build (con tsc-alias), dev, seed
│   │   ├── tsconfig.json
│   │   └── .env                       # Credenciales reales de Supabase
│   │
│   ├── appointment-service/           # 3001 → CRUD médicos + horarios + dashboard ✅ + booking ✅
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Especialidad, Medico, HorarioMedico, Cita
│   │   │   └── seed.ts                # Seed de 10 especialidades
│   │   ├── src/
│   │   │   ├── server.ts              # Bootstrap /health + /api/admin + /api/appointments
│   │   │   ├── env.ts                 # Validación Zod de variables
│   │   │   ├── shared/
│   │   │   │   ├── logger.ts
│   │   │   │   └── prisma-client.ts
│   │   │   ├── modules/
│   │   │   │   ├── medicos/           # Módulo hexagonal COMPLETO (Fase 2)
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/medico.entity.ts
│   │   │   │   │   │   ├── value-objects/horario-medico.vo.ts
│   │   │   │   │   │   ├── ports/in/medicos.port.ts
│   │   │   │   │   │   ├── ports/out/medico.repository.port.ts
│   │   │   │   │   │   └── exceptions/medico.errors.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── mapper.ts
│   │   │   │   │   │   └── features/
│   │   │   │   │   │       ├── crear-medico/
│   │   │   │   │   │       ├── actualizar-medico/
│   │   │   │   │   │       ├── listar-medicos/
│   │   │   │   │   │       ├── obtener-medico/
│   │   │   │   │   │       ├── cambiar-estado-medico/
│   │   │   │   │   │       └── obtener-metricas-dashboard/
│   │   │   │   │   └── infrastructure/
│   │   │   │   │       ├── adapters/in/http/medicos.controller.ts
│   │   │   │   │       ├── adapters/in/http/medicos.router.ts
│   │   │   │   │       ├── adapters/out/persistence/prisma-medico.repository.ts
│   │   │   │   │       ├── adapters/out/external-apis/auth-service.client.ts
│   │   │   │   │       └── di.ts
│   │   │   │   └── citas/             # Módulo hexagonal COMPLETO (Fase 3)
│   │   │   │       ├── domain/
│   │   │   │       │   ├── entities/cita.entity.ts
│   │   │   │       │   ├── ports/in/citas.port.ts
│   │   │   │       │   ├── ports/out/cita.repository.port.ts
│   │   │   │       │   ├── ports/out/medico-consulta.port.ts
│   │   │   │       │   └── exceptions/cita.errors.ts
│   │   │   │       ├── application/
│   │   │   │       │   ├── mapper.ts
│   │   │   │       │   └── features/
│   │   │   │       │       ├── crear-cita/
│   │   │   │       │       ├── crear-cita-automatica/
│   │   │   │       │       ├── cancelar-cita/
│   │   │   │       │       ├── reprogramar-cita/
│   │   │   │       │       ├── listar-citas-paciente/
│   │   │   │       │       ├── listar-citas-medico/
│   │   │   │       │       ├── obtener-disponibilidad/
│   │   │   │       │       ├── obtener-disponibilidad-por-especialidad/
│   │   │   │       │       └── cambiar-estado-cita/
│   │   │   │       └── infrastructure/
│   │   │   │           ├── adapters/in/http/citas.controller.ts
│   │   │   │           ├── adapters/in/http/citas.router.ts
│   │   │   │           ├── adapters/out/persistence/prisma-cita.repository.ts
│   │   │   │           ├── adapters/out/persistence/prisma-medico-consulta.adapter.ts
│   │   │   │           └── di.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   ├── clinical-service/              # 3002 → /api/medical/* (consultas) + stub chat IA
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # schema = clinical_service (Consulta, OrdenAnalisis)
│   │   ├── src/
│   │   │   ├── server.ts              # Bootstrap + /api/medical + /health
│   │   │   ├── modules/consultas/     # Módulo hexagonal COMPLETO (Fase 4)
│   │   │   │   ├── domain/entities/consulta.entity.ts
│   │   │   │   ├── domain/ports/in/consultas.port.ts
│   │   │   │   ├── domain/ports/out/consulta.repository.port.ts
│   │   │   │   ├── domain/exceptions/consulta.errors.ts
│   │   │   │   ├── application/features/
│   │   │   │   │   ├── iniciar-consulta/
│   │   │   │   │   ├── finalizar-consulta/
│   │   │   │   │   ├── obtener-consulta/
│   │   │   │   │   ├── listar-consultas-paciente/
│   │   │   │   │   └── listar-consultas-medico/
│   │   │   │   └── infrastructure/
│   │   │   │       ├── adapters/in/http/consultas.controller.ts
│   │   │   │       ├── adapters/in/http/consultas.router.ts
│   │   │   │       ├── adapters/out/persistence/prisma-consulta.repository.ts
│   │   │   │       └── di.ts
│   │   └── package.json               # build con tsc-alias
│   │
│   ├── file-service/                  # 3003 → /api/files/* (uploads S3)
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # schema = file_service (Archivo)
│   │   ├── src/
│   │   │   ├── server.ts              # Bootstrap + /api/files + /health
│   │   │   ├── shared/s3-client.ts    # Cliente AWS S3
│   │   │   └── modules/archivos/      # Módulo hexagonal COMPLETO (Fase 4)
│   │   │       ├── domain/entities/archivo.entity.ts
│   │   │       ├── domain/ports/in/archivos.port.ts
│   │   │       ├── domain/ports/out/archivo.repository.port.ts
│   │   │       ├── domain/ports/out/storage.port.ts
│   │   │       ├── domain/exceptions/archivo.errors.ts
│   │   │       ├── application/features/
│   │   │       │   ├── subir-archivo/
│   │   │       │   ├── obtener-url-firmada/
│   │   │       │   └── eliminar-archivo/
│   │   │       └── infrastructure/
│   │   │           ├── adapters/in/http/archivos.controller.ts
│   │   │           ├── adapters/in/http/archivos.router.ts
│   │   │           ├── adapters/out/persistence/prisma-archivo.repository.ts
│   │   │           ├── adapters/out/storage/s3-storage.adapter.ts
│   │   │           └── di.ts
│   │   └── package.json               # build con tsc-alias
│   └── api-gateway/                   # 8080 → Proxy + JWT + rate limit
│
├── packages/
│   ├── shared-kernel/                 # Result<T,E>, ErrorDominio, EntidadBase, VOBase
│   ├── shared-middleware/             # jwtMiddleware, requireRole, errorHandler, requestId
│   └── shared-types/                  # Rol, UsuarioDTO, ApiResponse, enums de estados
│
├── scripts/
│   ├── clean-schemas.sql              # DROP/CREATE de los 4 schemas
│   └── clean-schemas.js               # Wrapper Node (requiere `pg`)
│
├── plantilla/                         # Referencia DDD/Hexagonal
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json                       # Scripts globales + devDependencies
├── tsconfig.base.json
├── .env                               # Variables reales (NO comitear)
├── .env.example                       # Plantilla sin secretos
├── .gitignore
├── .npmrc                             # pnpm config + public-hoist-pattern
├── .editorconfig, .prettierrc, .eslintrc.json
└── README.md                          # Guía completa de setup y ejecución
```

---

## Problemas encontrados y soluciones

### 1. `bcrypt` no compila en Windows
- **Problema:** `bcrypt` requiere compilación nativa con node-gyp, falla en Windows sin herramientas de build.
- **Solución:** Cambiado a **`bcryptjs`** (implementación pura JS). Misma API (`hash`, `compare`).
- **Archivos afectados:** `services/auth-service/package.json`, `bcrypt-hash.adapter.ts`, `prisma/seed.ts`

### 2. Alias `@/` no funcionan en runtime (`dist/`)
- **Problema:** TypeScript compila los imports con `@/` pero Node.js no los resuelve al ejecutar `dist/server.js`.
- **Solución:** Instalado **`tsc-alias`** como devDependency. El script `build` ahora es:
  ```json
  "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json"
  ```
  `tsc-alias` reescribe los imports `@/` a rutas relativas en los archivos `.js` de `dist/`.
- **Archivos afectados:** Todos los servicios tienen `tsc-alias` y `postbuild:prisma`.

### 3. Prisma Client sobrescrito entre servicios
- **Problema:** Al generar varios `prisma generate` en un monorepo, el último schema sobrescribe el `@prisma/client` global.
- **Solución:** Configurar `output = "../src/generated/prisma"` en cada `schema.prisma` y usar imports relativos desde `src/shared/prisma-client.ts`. Agregar script `postbuild:prisma` para copiar `src/generated/prisma` a `dist/generated/prisma` después de compilar.

### 4. `@types/bcryptjs` deprecated causa TS2688
- **Problema:** `@types/bcryptjs@3.0.0` está deprecated y genera errores de compilación.
- **Solución:** Eliminar `@types/bcryptjs` de todos los servicios (bcryptjs v3 incluye sus propios tipos nativos). Agregar `"types": ["node"]` al `tsconfig.json` de `shared-kernel` y `shared-types`.

### 5. Zod `z.string().datetime()` requiere timezone
- **Problema:** En Fase 3, `reservarManual` recibía `"2026-05-19T08:00:00"` y Zod rechazaba el formato ISO 8601 sin `Z`.
- **Solución:** El frontend debe enviar fechas en formato completo ISO 8601 (con `Z` o offset). En tests, usar `"2026-05-19T08:00:00Z"`.
- **Archivo afectado:** `citas.controller.ts` (schema `crearCitaSchema`)

### 6. `clinical-service` y `file-service` no tenían `tsc-alias` en Fase 0
- **Problema:** Los servicios creados en Fase 0 solo hacían `tsc -p tsconfig.json` en el build. Al ejecutar `node dist/server.js`, los imports `@/` no se resolvían (`MODULE_NOT_FOUND`).
- **Solución:** Instalar `tsc-alias` como devDependency y actualizar el script de build:
  ```json
  "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json && pnpm postbuild:prisma"
  ```
- **Archivos afectados:** `services/clinical-service/package.json`, `services/file-service/package.json`

---

## Cómo arrancar en una nueva sesión

### Prerrequisitos
- Node.js 20+
- pnpm 8+ (`corepack enable && corepack prepare pnpm@8.15.0 --activate`)
- Docker (opcional, para Compose)

### Pasos de setup (una sola vez)
```bash
# 1. Instalar dependencias del workspace
pnpm install

# 2. Generar clientes Prisma de los 4 servicios
pnpm prisma:generate:all

# 3. (Solo si los schemas tienen tablas viejas/rotas)
pnpm db:reset
```

### Ejecución rápida
```bash
# Todos los servicios backend en paralelo (sin Docker)
pnpm dev:services

# Frontend (en otra terminal)
pnpm dev:frontend

# O con Docker Compose
docker compose up --build
```

### Verificar que funciona
```bash
curl http://localhost:3000/health   # auth-service
curl http://localhost:3001/health   # appointment-service
curl http://localhost:8080/health   # api-gateway
```

---

## Estado de la base de datos (Supabase)

- **Schema `auth_service`:** Tabla `usuarios` con registros de admin, médicos de prueba y pacientes creados en tests E2E.
  - Admin: DNI `00000000`, email `admin@clinicax.com`, rol `ADMIN`
- **Schema `appointment_service`:** Tablas `especialidades` (10 registros), `medicos` (2+ registros), `horarios_medico` (3+ registros por médico), `citas` (registros de pruebas E2E)
- **Schema `clinical_service`:** Tablas `consultas`, `ordenes_analisis` (modelos reales Fase 4)
- **Schema `file_service`:** Tabla `archivos` (modelo real Fase 4)

---

## Endpoints funcionales (testeados)

| Endpoint | Método | Auth | Estado |
|---|---|---|---|
| `POST /api/auth/register` | POST | Pública | ✅ Funciona |
| `POST /api/auth/login` | POST | Pública | ✅ Funciona (triple: DNI+Email+Password) |
| `GET /api/auth/me` | GET | JWT | ✅ Funciona |
| `PUT /api/auth/me` | PUT | JWT | ✅ Funciona |
| `GET /api/admin/doctors` | GET | JWT + ADMIN | ✅ Funciona (lista + métricas) |
| `POST /api/admin/doctors` | POST | JWT + ADMIN | ✅ Funciona (crea médico + usuario MEDICO) |
| `GET /api/admin/doctors/:id` | GET | JWT + ADMIN | ✅ Funciona |
| `PUT /api/admin/doctors/:id` | PUT | JWT + ADMIN | ✅ Funciona |
| `PATCH /api/admin/doctors/:id/status` | PATCH | JWT + ADMIN | ✅ Funciona |
| `GET /api/appointments/availability` | GET | JWT + PACIENTE | ✅ Funciona (slots por médico y fecha) |
| `GET /api/appointments/availability/specialty/:id` | GET | JWT + PACIENTE | ✅ Funciona (doctores con disponibilidad) |
| `POST /api/appointments/book/manual` | POST | JWT + PACIENTE | ✅ Funciona |
| `POST /api/appointments/book/automatic` | POST | JWT + PACIENTE | ✅ Funciona |
| `GET /api/appointments/patient/me` | GET | JWT + PACIENTE | ✅ Funciona |
| `PUT /api/appointments/patient/:id` | PUT | JWT + PACIENTE | ✅ Funciona (reprogramar) |
| `DELETE /api/appointments/patient/:id` | DELETE | JWT + PACIENTE | ✅ Funciona (cancelar) |
| `GET /api/appointments/doctor/calendar` | GET | JWT + MEDICO | ✅ Funciona |
| `PATCH /api/appointments/doctor/:id/status` | PATCH | JWT + MEDICO | ✅ Funciona |
| `POST /api/medical/doctor/consultation/start` | POST | JWT + MEDICO | ✅ Funciona |
| `POST /api/medical/doctor/consultation/:id/finalize` | POST | JWT + MEDICO | ✅ Funciona |
| `GET /api/medical/doctor/active-patient` | GET | JWT + MEDICO | ✅ Funciona |
| `GET /api/medical/doctor/patients` | GET | JWT + MEDICO | ✅ Funciona |
| `GET /api/medical/patient/history` | GET | JWT + PACIENTE | ✅ Funciona |
| `GET /api/medical/patient/consultation/:id` | GET | JWT + PACIENTE | ✅ Funciona |
| `POST /api/files/upload` | POST | JWT + PACIENTE/MEDICO | ✅ Funciona (multipart) |
| `GET /api/files/:id/signed-url` | GET | JWT | ✅ Funciona |
| `DELETE /api/files/:id` | DELETE | JWT + PACIENTE/MEDICO | ✅ Funciona |
| `GET /health` (todos los servicios) | GET | Pública | ✅ Funciona |

**Nota:** Todos los endpoints se acceden vía gateway en `http://localhost:8080/api/*`

---

## Testeo E2E de Fase 4 (realizado en esta sesión)

### Flujo clinical-service
```
Login admin → Crear médico (con especialidad real) → Login médico → Login paciente
→ POST /api/medical/doctor/consultation/start       ✅ 201
→ POST /api/medical/doctor/consultation/:id/finalize ✅ 200 (estado=FINALIZADA)
→ GET /api/medical/patient/history                  ✅ 200 (1 consulta finalizada)
→ GET /api/medical/patient/consultation/:id         ✅ 200 (estado=FINALIZADA)
```

### Flujo file-service
```
Login paciente
→ POST /api/files/upload (sin archivo)              ✅ 400 (archivo requerido)
→ POST /api/files/upload (tipo no permitido)        ✅ 400 (MIME rechazado)
→ POST /api/files/upload (PDF válido)               ⚠️ 500 (S3 InvalidAccessKeyId — credenciales placeholder en .env)
→ GET /api/files/:id/signed-url (inexistente)       ✅ 404
```
**Nota S3:** Las credenciales AWS en `services/file-service/.env` son placeholders (`change_this_key`). En producción deben reemplazarse por credenciales reales. El código de upload, validación y generación de signed URLs es correcto.

---

## Próximos pasos (Fase 5: Frontend paciente)

### 1. Portal paciente
- [ ] Landing page mejorada (hero, features, CTA)
- [ ] Login / registro paciente (usar axios cliente con `clinica_x_token`)
- [ ] Reservar cita: wizard paso a paso (manual + automática)
- [ ] Perfil paciente (3 tabs: datos, historial, cambiar contraseña)
- [ ] Visualización de historial clínico (`GET /api/medical/patient/history`)

### 2. Conexión con backend existente
- [ ] Asegurar que los endpoints de clinical/file retornan datos en formato que el frontend espera
- [ ] Manejo de estados de carga y errores (sonner para notificaciones)

### 3. Preparación Fase 6 (Frontend médico)
- [ ] Reutilizar componentes de calendario para vista médico

---

## Notas para el siguiente desarrollador

1. **Si agregas un nuevo servicio:** copia la estructura de `auth-service` (package.json, tsconfig.json, Dockerfile, env.ts, server.ts, prisma/schema.prisma). No olvides agregar `tsc-alias` al build.

2. **Si agregas un nuevo módulo hexagonal:** sigue la plantilla de `auth-service/src/modules/usuarios/` o `appointment-service/src/modules/citas/`. La estructura es:
   ```
   domain/{entities, value-objects, ports, exceptions, services}
   application/features/<feature>/{*.dto.ts, *.use-case.ts}
   infrastructure/{adapters/{in/http, out/persistence}, di.ts}
   ```

3. **Para imports cross-layer:** usa `@/` alias. `tsc-alias` los reescribirá en build.

4. **Para Prisma:** usa `pnpm --filter <service> exec prisma db push` en desarrollo (no interactivo). En producción usar `prisma migrate deploy`.

5. **Para probar endpoints:** el gateway es el punto único de entrada (`localhost:8080`). Los microservicios individuales (`:3000`, `:3001`, etc.) solo son accesibles directamente en desarrollo.

6. **El `.env` raíz y los `.env` de servicios contienen credenciales reales.** Nunca los comitees. Solo `.env.example` va al repo.

---

## Recursos clave en el repo

| Documento | Ubicación | Propósito |
|---|---|---|
| Plan maestro | `Plan-ClinicaX.md` | Roadmap, decisiones, estado por fase |
| Handoff (este doc) | `HANDOFF.md` | Contexto para nueva sesión |
| README técnico | `README.md` | Setup, ejecución, troubleshooting |
| Flujo Admin | `clinica-x-flujo-admin.md` | Especificación UI/UX del admin |
| Flujo Médico | `clinica-x-flujo-medico.md` | Especificación UI/UX del médico |
| Flujo Paciente | `clinica-x-flujo-paciente.md` | Especificación UI/UX del paciente |
| Plantilla DDD | `plantilla/` | Ejemplo de arquitectura hexagonal |

---

*Documento actualizado al finalizar la sesión #4 (Fase 4 completada).*
