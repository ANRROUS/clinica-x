# Clínica X

Sistema integral de gestión clínica con arquitectura de microservicios + Arquitectura Hexagonal + DDD por módulo, monorepo `pnpm`, Next.js para el frontend y Prisma + Supabase Postgres para la persistencia.

> Este README documenta la **Fase 0** del proyecto: bootstrap del monorepo. La lógica de negocio (entidades, casos de uso, controladores) se implementa en Fases 1-7.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind v3, lucide-react, react-icons, Zustand, React Query, React Hook Form + Zod |
| Backend | Node.js 20, Express, TypeScript estricto, Prisma, Zod |
| BD | Supabase Postgres (1 proyecto, 4 schemas separados) |
| Storage | AWS S3 (bucket privado, signed URLs) |
| Auth | JWT + bcrypt (propio, no Supabase Auth) |
| Orquestación | pnpm workspaces + Docker Compose |
| Gateway | Express + http-proxy-middleware |

---

## Arquitectura

```
                       ┌──────────────────┐
                       │     Frontend     │
                       │  Next.js (3100)  │
                       └────────┬─────────┘
                                │ http://localhost:8080
                       ┌────────▼─────────┐
                       │   api-gateway    │  ← valida JWT, CORS, rate limit
                       │      (8080)      │
                       └────────┬─────────┘
        ┌───────────────┬───────┴───────┬─────────────────┐
        │               │               │                 │
┌───────▼──────┐ ┌──────▼─────────┐ ┌───▼──────────┐ ┌────▼────────┐
│ auth-service │ │ appointment-   │ │ clinical-    │ │ file-       │
│   (3000)     │ │ service (3001) │ │ service(3002)│ │ service(3003)│
│              │ │ + admin CRUD   │ │ + chat IA*   │ │ + AWS S3    │
└──────┬───────┘ └──────┬─────────┘ └──────┬───────┘ └─────┬───────┘
       │                │                  │               │
       └────────────────┴──────────────────┴───────────────┘
                                │
                       ┌────────▼─────────┐
                       │ Supabase Postgres│
                       │  schemas:        │
                       │   auth_service   │
                       │   appointment_service │
                       │   clinical_service    │
                       │   file_service        │
                       └──────────────────┘

* El chat IA "Agente X" está en stub "Próximamente" hasta activar AI_ENABLED=true
```

Cada microservicio replica la estructura de la plantilla hexagonal:

```
src/modules/<contexto>/
  ├── domain/        # entities, value-objects, ports, services, events, types
  ├── application/   # features/<use-case>/  (use-case + dto + handlers)
  └── infrastructure/
      ├── adapters/in/http/      # controllers + routers
      ├── adapters/out/persistence/  # Prisma repositories
      └── di.ts                  # Composition root del módulo
```

---

## Estructura del repo

```
clinica-x/
├── frontend/                  # Next.js (puerto 3100)
├── services/
│   ├── auth-service/          # 3000 → /api/auth/*
│   ├── appointment-service/   # 3001 → /api/admin/*, /api/appointments/*
│   ├── clinical-service/      # 3002 → /api/medical/*
│   ├── file-service/          # 3003 → /api/files/*
│   └── api-gateway/           # 8080 → reverse proxy
├── packages/
│   ├── shared-kernel/         # Result<T,E>, ErrorDominio, EntidadBase, ValueObjectBase
│   ├── shared-middleware/     # jwtMiddleware, requireRole, errorHandler, requestId
│   └── shared-types/          # Rol, UsuarioDTO, ApiResponse, enums de estados
├── scripts/
│   ├── clean-schemas.sql      # SQL para limpiar los 4 schemas
│   └── clean-schemas.js       # Wrapper Node para ejecutarlo
├── plantilla/                 # Plantilla de referencia DDD/Hexagonal (no se compila)
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .env                       # ⚠ contiene credenciales reales, NO se comitea
└── .env.example               # Plantilla pública sin secretos
```

---

## Requisitos

- **Node.js** 20+
- **pnpm** 8+ (`corepack enable && corepack prepare pnpm@8.15.0 --activate`)
- **Docker** y **Docker Compose** v2 (opcional, para ejecución contenedorizada)
- Acceso al proyecto **Supabase** (URLs Postgres del `.env`)
- Credenciales **AWS** con permisos sobre el bucket S3 (opcional hasta Fase 4)

---

## Setup inicial

### 1. Copiar variables de entorno

Cada servicio tiene su propio `.env`. Los archivos ya están creados con las credenciales que se compartieron al inicio (no se comitean al repo). Si necesitas regenerarlos:

```bash
cp .env.example .env
cp services/auth-service/.env.example services/auth-service/.env
cp services/appointment-service/.env.example services/appointment-service/.env
cp services/clinical-service/.env.example services/clinical-service/.env
cp services/file-service/.env.example services/file-service/.env
cp services/api-gateway/.env.example services/api-gateway/.env
cp frontend/.env.local.example frontend/.env.local
```

Luego edita cada archivo con tus credenciales reales.

### 2. Instalar dependencias

```bash
pnpm install
```

Esto instala todas las dependencias del workspace, incluyendo `pg` que usa el script de limpieza de schemas.

### 3. Limpiar schemas previos en Supabase

Los 4 schemas (`auth_service`, `appointment_service`, `clinical_service`, `file_service`) pueden tener tablas de un proyecto previo. **Esto los elimina y los recrea vacíos**:

```bash
pnpm db:reset
```

> ⚠ **Destructivo**: borra todos los datos de esos schemas. Solo correr en dev.

### 4. Generar los clientes Prisma

Cada servicio tiene su propio `schema.prisma`. Antes de compilar o arrancar, hay que generar los clientes:

```bash
pnpm prisma:generate:all
```

### 5. Aplicar migraciones

> En Fase 0 los `schema.prisma` solo tienen `datasource` y `generator`, sin modelos. No hay migraciones que aplicar todavía.
>
> A partir de Fase 1 (cuando se definan entidades), ejecutar:
>
> ```bash
> pnpm prisma:migrate:all
> ```

---

## Ejecución

### Opción A — Con Docker Compose (recomendado)

Levanta los 5 servicios del backend en contenedores bindeados a `127.0.0.1`:

```bash
docker compose up --build
```

Para detener:

```bash
docker compose down
```

El frontend Next.js se arranca por separado (ver Opción B paso por paso o levantarlo con `pnpm dev:frontend` en otra terminal).

### Opción B — Sin Docker, todos los procesos en paralelo

```bash
pnpm dev
```

Esto levanta los 5 servicios + el frontend en paralelo. Puede ser ruidoso; usa los scripts específicos si solo quieres uno:

```bash
pnpm dev:auth          # solo auth-service (3000)
pnpm dev:appointment   # solo appointment-service (3001)
pnpm dev:clinical      # solo clinical-service (3002)
pnpm dev:file          # solo file-service (3003)
pnpm dev:gateway       # solo api-gateway (8080)
pnpm dev:frontend      # solo el frontend Next.js (3100)
```

### Verificar que todo arrancó

Endpoints `/health` de cada servicio:

```bash
curl http://localhost:3000/health   # auth-service
curl http://localhost:3001/health   # appointment-service
curl http://localhost:3002/health   # clinical-service
curl http://localhost:3003/health   # file-service
curl http://localhost:8080/health   # api-gateway (responde sin JWT)
```

Frontend: abrir [http://localhost:3100](http://localhost:3100).

---

## Mapa de endpoints (vía gateway en 8080)

| Ruta | Servicio destino |
|---|---|
| `POST /api/auth/login`, `register`, `me`, `forgot-password` | auth-service |
| `GET/POST/PUT /api/admin/doctors/*` | appointment-service |
| `GET /api/admin/dashboard/metrics` | appointment-service |
| `GET /api/appointments/availability` | appointment-service |
| `POST /api/appointments/book/{manual,automatic}` | appointment-service |
| `GET /api/appointments/patient/me` | appointment-service |
| `GET /api/appointments/doctor/calendar` | appointment-service |
| `POST /api/medical/doctor/consultation/{start,finalize}` | clinical-service |
| `GET /api/medical/patient/history` | clinical-service |
| `POST /api/medical/doctor/ai/chat` | clinical-service (devuelve `coming_soon`) |
| `POST /api/files/upload` | file-service |
| `GET /api/files/:id/signed-url` | file-service |

> Las rutas `/api/auth/login` y `/api/auth/register` son públicas (sin JWT).

---

## Roadmap de fases

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Bootstrap del monorepo, configs, packages compartidos, esqueletos | ✅ Hecho |
| 1 | `auth-service` completo (módulo usuarios, login, register, JWT) | ⏳ Siguiente |
| 2 | `appointment-service`: CRUD médicos + horarios + dashboard admin | Pendiente |
| 3 | `appointment-service`: disponibilidad + reservas + calendario | Pendiente |
| 4 | `clinical-service` + `file-service` (consultas, análisis, uploads) | Pendiente |
| 5 | Frontend paciente (landing, auth, reservas, perfil) | Pendiente |
| 6 | Frontend médico (calendario, pacientes, consulta, historial) | Pendiente |
| 7 | Frontend admin (dashboard, formulario médico con grid horario) | Pendiente |

---

## Convenciones

- **Idioma**: identificadores y comentarios en **español** (entidades, VOs, métodos). DTOs públicos también.
- **Errores**: las operaciones de dominio retornan `Result<T, E>` (no `throw`). Solo el `errorHandler` HTTP captura excepciones.
- **Entidades**: constructor privado + factory `create()` que valida invariantes.
- **VOs**: inmutables, validados en `create()`, comparación estructural.
- **Capa de dominio**: no importa Express, Prisma, fetch, ni nada de infraestructura.
- **`di.ts`**: único archivo que conoce las implementaciones concretas.
- **Cada módulo** solo exporta su router como API pública (`index.ts`).

---

## Seguridad

- `.env` está en `.gitignore` — **nunca** comitear secretos.
- Los puertos del backend se bindean a `127.0.0.1` (variable `HOST_BIND_IP`); solo el gateway es accesible desde el frontend.
- JWT validado dos veces: en el gateway y en cada servicio (defensa en profundidad).
- Bcrypt con `cost factor 10+` para hashes de password.
- Helmet activado en todos los servicios + gateway.
- Rate limit global en el gateway (300 req/min/IP).
- AWS S3: bucket privado, accesible solo vía signed URLs generados por `file-service`.

---

## Troubleshooting

**Error `Cannot find module '@prisma/client'`**
→ Ejecutar `pnpm prisma:generate:all`.

**Error `connect ECONNREFUSED 127.0.0.1:3000`** desde otro servicio
→ Asegurar que `auth-service` esté arriba. En Docker Compose `depends_on` lo maneja.

**Schemas con tablas previas que ensucian las migraciones**
→ `pnpm db:reset` (¡destructivo!).

**El front no llega al backend**
→ Verificar que `NEXT_PUBLIC_API_BASE_URL` apunta al gateway (`http://localhost:8080`) y que el gateway está arriba.

---

## Licencia

Proyecto académico — Curso Integrador II.
