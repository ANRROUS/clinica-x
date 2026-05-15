# HANDOFF — Clínica X

> **Fecha de sesión:** 2026-05-15
> **Sesión #:** 5 (Fase 5 Frontend paciente)
> **Estado:** Fase 0 ✅ | Fase 1 ✅ | Fase 2 ✅ | Fase 3 ✅ | Fase 4 ✅ | Fase 5 ✅ | Listo para Fase 6

---

## Resumen ejecutivo

En la sesión #5 se implementó el **frontend del paciente** (Fase 5), incluyendo la landing page mejorada, autenticación, reserva de citas y perfil con tabs.

**Logros clave de esta sesión:**
- Landing page mejorada con hero, sección de características y formulario de contacto
- Login/Registro completos con validación Zod + React Hook Form
- Stores Zustand: `useAuthStore` (auth persistido en localStorage) y `useBookingStore` (flujo de reserva)
- Cliente axios configurado con interceptor de JWT y auto-logout en 401
- Página de reserva de citas con wizard paso a paso:
  - Panel izquierdo con lista de especialidades (desde API)
  - Selección de médico, día y horario (desde API de disponibilidad)
  - Modal de confirmación de reserva
  - Modo automático (reserva el primer slot disponible)
- Página de perfil con 3 tabs:
  - **Consultas**: Historial de consultas médicas (`GET /api/medical/patient/history`)
  - **Tratamiento**: Placeholder (se implementará en Fase 6/8)
  - **Reservas**: Citas activas con opción de cancelar (`GET /api/appointments/patient/me`)
- Header dinámico (estado autenticado vs no autenticado) con soporte responsive
- React Query Provider + Sonner para notificaciones toast
- Nuevo endpoint backend: `GET /api/appointments/specialties` (lista especialidades)
- Componentes reutilizables: LoginForm, RegisterForm, SpecialtySidebar, DoctorSelector, DaySelector, SlotSelector, ConfirmBookingModal, ProfileHeader, ProfileTabs
- Toda la app compila sin errores TypeScript y linting pasa limpio

---

## Estado por fase

| Fase | Descripción | Estado | Notas |
|---|---|---|---|
| **0** | Bootstrap del monorepo | ✅ Completa | Todo compila y levanta |
| **1** | auth-service (usuarios) | ✅ Completa | Registro, login, perfil, JWT funcionan |
| **2** | appointment-service (admin) | ✅ Completa | CRUD médicos, horarios, dashboard KPI, cross-service auth |
| **3** | appointment-service (booking) | ✅ Completa | Reservas manual/automática, disponibilidad, cancelar, reprogramar, calendario médico |
| **4** | clinical-service + file-service | ✅ Completa | Módulo consultas (iniciar/finalizar/historial), uploads S3, signed URLs |
| **5** | Frontend paciente | ✅ **Completa** | Landing, auth, reservas, perfil con 3 tabs |
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
| Auth | Propia con JWT + **bcryptjs** |
| Idioma código | **Español** (entidades, VOs, métodos, comentarios) |
| Chat IA | Stub "Próximamente" (`AI_ENABLED=false`) |
| Alias de imports | `@/` para rutas absolutas dentro de cada servicio |
| Build post-proceso | **`tsc-alias`** reescribe `@/` a rutas relativas en `dist/` |
| Estado frontend | **Zustand** (auth store, booking store) |
| Data fetching frontend | **TanStack React Query** |
| Validación forms | **React Hook Form + Zod** |
| Notificaciones frontend | **Sonner** |
| HTTP cliente frontend | **axios** (3 tokens: paciente, médico, admin) |

---

## Estructura del repo (lo que existe ahora)

```
clinica-x/
├── frontend/                          # Next.js 14 (puerto 3100)
│   ├── src/app/
│   │   ├── page.tsx                   # Landing mejorada (hero + features + contacto)
│   │   ├── layout.tsx                 # Root layout con Providers + Toaster
│   │   ├── globals.css
│   │   ├── login/page.tsx             # Login paciente (DNI + Email + Password)
│   │   ├── register/page.tsx          # Registro paciente
│   │   ├── reservar-cita/page.tsx     # Wizard de reserva completo
│   │   ├── perfil/page.tsx            # Perfil con 3 tabs
│   │   ├── doctor/login/page.tsx      # Placeholder
│   │   ├── doctor/calendario/page.tsx # Placeholder
│   │   ├── doctor/pacientes/page.tsx  # Placeholder
│   │   ├── admin/login/page.tsx       # Placeholder
│   │   └── admin/dashboard/page.tsx   # Placeholder
│   ├── src/components/
│   │   ├── shared/
│   │   │   ├── Header.tsx             # Header dinámico (auth/no-auth, responsive)
│   │   │   └── Footer.tsx
│   │   ├── landing/
│   │   │   └── ContactForm.tsx        # Formulario de contacto
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Formulario login con Zod
│   │   │   └── RegisterForm.tsx       # Formulario registro con Zod
│   │   ├── booking/
│   │   │   ├── SpecialtySidebar.tsx   # Panel de especialidades con búsqueda
│   │   │   ├── DoctorSelector.tsx     # Grid de médicos
│   │   │   ├── DaySelector.tsx        # Chips de días disponibles
│   │   │   ├── SlotSelector.tsx      # Chips de horarios disponibles
│   │   │   └── ConfirmBookingModal.tsx # Modal confirmación reserva
│   │   ├── patient-profile/
│   │   │   ├── ProfileHeader.tsx      # Avatar + datos editables
│   │   │   ├── ProfileTabs.tsx        # Tabs (Consultas/Tratamiento/Reservas)
│   │   │   ├── ConsultationsTab.tsx    # Historial de consultas
│   │   │   ├── TreatmentTab.tsx        # Placeholder tratamiento
│   │   │   └── AppointmentsTab.tsx     # Reservas activas con cancelar
│   │   └── Providers.tsx              # React Query + Sonner providers
│   ├── src/hooks/                     # Hooks personalizados (pendiente)
│   ├── src/lib/api/
│   │   ├── axios.ts                   # Cliente HTTP con interceptor JWT + auto-logout
│   │   ├── types.ts                   # DTOs compartidos del frontend
│   │   ├── auth.api.ts                # login, register, getMe, updateMe
│   │   ├── appointments.api.ts        # specialties, availability, booking, cancel
│   │   └── medical.api.ts             # patientHistory, consultation, file upload
│   ├── src/store/
│   │   ├── useAuthStore.ts            # Zustand: user, token, isAuthenticated, persist localStorage
│   │   └── useBookingStore.ts         # Zustand: flujo de reserva temporal
│   └── tailwind.config.ts             # Paleta teal/indigo
│
├── services/
│   ├── auth-service/                  # 3000 → /api/auth/*
│   │   └── ... (sin cambios)
│   ├── appointment-service/           # 3001 → /api/admin/* + /api/appointments/*
│   │   └── ... (nuevo endpoint GET /specialties)
│   ├── clinical-service/              # 3002 → /api/medical/*
│   │   └── ... (sin cambios)
│   ├── file-service/                   # 3003 → /api/files/*
│   │   └── ... (sin cambios)
│   └── api-gateway/                   # 8080 → Proxy + JWT + rate limit
│
├── packages/
│   ├── shared-kernel/                 # Result<T,E>, ErrorDominio, EntidadBase, VOBase
│   ├── shared-middleware/             # jwtMiddleware, requireRole, errorHandler, requestId
│   └── shared-types/                  # Rol, UsuarioDTO, ApiResponse, enums de estados
│
├── scripts/
├── plantilla/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .env / .env.example
├── .gitignore
├── HANDOFF.md
├── Plan-ClinicaX.md
└── README.md
```

---

## Cambios de esta sesión (Fase 5)

### Backend

1. **Nuevo endpoint `GET /api/appointments/specialties`** en appointment-service:
   - Agregado `EspecialidadDTO` y método `listarEspecialidades()` al puerto `IMedicoConsultaPort`
   - Implementado en `PrismaMedicoConsulta` (consulta `prisma.especialidad.findMany`)
   - Agregado método `listarEspecialidades` al `CitasController`
   - Agregada ruta en `citas.router.ts` con `requireRole(['PACIENTE', 'MEDICO'])`

### Frontend

2. **Stores Zustand**:
   - `useAuthStore`: gestiona user, token, isAuthenticated; persiste en localStorage bajo `clinica_x_token` y `clinica_x_user`
   - `useBookingStore`: gestiona el flujo de reserva (especialidad, médico, fecha, slot, modo)

3. **Módulos API** (`lib/api/`):
   - `axios.ts`: cliente configurado con interceptor que agrega JWT y redirige en 401
   - `types.ts`: DTOs tipados (UsuarioDTO, EspecialidadDTO, SlotDTO, CitaDTO, ConsultaDTO, ApiResponse)
   - `auth.api.ts`: login, register, getMe, updateMe
   - `appointments.api.ts`: specialties, availability, booking (manual + auto), reschedule, cancel
   - `medical.api.ts`: patientHistory, consultationById, file upload/signed URL

4. **Providers**: `QueryClientProvider` (React Query) + `Toaster` (Sonner)

5. **Componentes compartidos**:
   - `Header.tsx`: responsive, muestra navegación según auth state, avatar con iniciales, logout
   - `Footer.tsx`: footer simple con links
   - `ContactForm.tsx`: formulario de contacto con validación

6. **Auth components**:
   - `LoginForm.tsx`: formulario con DNI + Email + Password, validación Zod, redirect post-login
   - `RegisterForm.tsx`: formulario con nombre, apellido, DNI, email, teléfono, contraseña

7. **Booking components**:
   - `SpecialtySidebar.tsx`: panel con búsqueda de especialidades
   - `DoctorSelector.tsx`: grid de médicos disponibles
   - `DaySelector.tsx`: chips de días con disponibilidad
   - `SlotSelector.tsx`: chips de horarios disponibles
   - `ConfirmBookingModal.tsx`: modal de confirmación con resumen

8. **Profile components**:
   - `ProfileHeader.tsx`: avatar + datos editables (email, teléfono) inline
   - `ProfileTabs.tsx`: tabs navegables (Consultas/Tratamiento/Reservas)
   - `ConsultationsTab.tsx`: historial de consultas médicas con detalle expandible
   - `TreatmentTab.tsx`: placeholder
   - `AppointmentsTab.tsx`: reservas activas con cancelar y confirmación

9. **Pages actualizadas**:
   - Landing page mejorada con hero, features, contacto
   - `/login` → LoginForm
   - `/register` → RegisterForm
   - `/reservar-cita` → wizard completo con React Query
   - `/perfil` → ProfileHeader + tabs
   - Páginas doctor/admin permanecen como placeholders

---

## Endpoints funcionales (testeados, sin cambios nuevos excepto specialties)

| Endpoint | Método | Auth | Estado |
|---|---|---|---|
| *(todos los de Fase 4)* | | | ✅ Sin cambios |
| `GET /api/appointments/specialties` | GET | JWT + PACIENTE/MEDICO | ✅ **Nuevo** |

---

## Próximos pasos (Fase 6: Frontend médico)

### 1. Portal médico
- [ ] Login médico (reusar LoginForm con rol)
- [ ] Calendario del médico (3 vistas: mensual/semanal/diaria)
- [ ] Sidebar de pacientes del día
- [ ] Vista de consulta activa (diagnóstico + notas)
- [ ] Historial de pacientes

### 2. Preparación Fase 7 (Frontend admin)
- [ ] Reutilizar componentes de calendario para vista admin

---

## Notas para el siguiente desarrollador

1. **El `useAuthStore` persiste en localStorage.** Se usa `clinica_x_token` para el JWT y `clinica_x_user` para el objeto usuario. El interceptor de axios en `lib/api/axios.ts` usa la key correspondiente según la ruta.

2. **Las páginas doctor/admin siguen siendo placeholders.** Están en `src/app/doctor/` y `src/app/admin/`.

3. **El tab de Tratamiento es un placeholder.** Requiere que el backend tenga endpoints de recetas y órdenes de análisis, que no están implementados todavía (solo está el modelo `OrdenAnalisis` en Prisma, sin endpoints).

4. **El modo "Reprogramar cita" no está implementado en el frontend.** El botón está deshabilitado. Se necesita un modal similar al de reserva pero pre-seleccionando médico y especialidad, y usando `PUT /api/appointments/patient/:id`.

5. **El formulario de contacto en la landing page es demo.** No tiene endpoint backend.

6. **Para probar el flujo completo:**
   ```bash
   # 1. Levantar servicios
   pnpm dev:services
   
   # 2. En otra terminal, levantar frontend
   pnpm dev:frontend
   
   # 3. Registrar un paciente en POST /api/auth/register
   # 4. Login en /login
   # 5. Navegar a /reservar-cita y reservar
   # 6. Ver reservas en /perfil → tab Reservas
   ```

7. **Si se agrega un nuevo servicio o módulo:** seguir la plantilla hexagonal. Ver notas en HANDOFF previo.

---

*Documento actualizado al finalizar la sesión #5 (Fase 5 completada).*