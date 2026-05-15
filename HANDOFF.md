# HANDOFF — Clínica X

> **Fecha de sesión:** 2026-05-15
> **Sesión #:** 8 (Fase 8 Integración E2E - Seed y Tests)
> **Estado:** Fase 0 ✅ | Fase 1 ✅ | Fase 2 ✅ | Fase 3 ✅ | Fase 4 ✅ | Fase 5 ✅ | Fase 6 ✅ | Fase 7 ✅ | Fase 8 🔄 En progreso

---

## Resumen ejecutivo

En la sesión #8 se inició la **Fase 8 (Integración E2E)** con la creación de scripts de seed demo y tests E2E automatizados.

**Logros clave de esta sesión:**
- Script `scripts/seed-demo.js` que genera datos coherentes para los 3 flujos (admin, médico, paciente):
  - Admin existente (del Prisma seed)
  - 5 médicos con horarios variados (Medicina General, Cardiología, Dermatología, Traumatología, Pediatría)
  - 4 pacientes
  - Citas entre pacientes y médicos
  - Consultas finalizadas para el historial
- Script `scripts/test-e2e.js` que valida automáticamente los 3 flujos completos
- Scripts agregados al `package.json` raíz: `seed:all`, `seed:demo`, `test:e2e`
- Credenciales demo documentadas para testing manual

---

## Estado por fase

| Fase | Descripción | Estado | Notas |
|---|---|---|---|
| **0** | Bootstrap del monorepo | ✅ Completa | Todo compila y levanta |
| **1** | auth-service (usuarios) | ✅ Completa | Registro, login, perfil, JWT funcionan |
| **2** | appointment-service (admin) | ✅ Completa | CRUD médicos, horarios, dashboard KPI, cross-service auth |
| **3** | appointment-service (booking) | ✅ Completa | Reservas manual/automática, disponibilidad, cancelar, reprogramar, calendario médico |
| **4** | clinical-service + file-service | ✅ Completa | Módulo consultas (iniciar/finalizar/historial), uploads S3, signed URLs |
| **5** | Frontend paciente | ✅ Completa | Landing, auth, reservas, perfil con 3 tabs |
| **6** | Frontend médico | ✅ **Completa** | Login médico, calendario 3 vistas, consulta, historial pacientes |
| **7** | Frontend admin | ✅ **Completa** | Login admin, dashboard KPI, tabla médicos, formulario médico con grid horarios |
| **8** | Integración E2E | 🔄 En progreso | Seed demo, tests E2E, pulido |

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
| Estado frontend | **Zustand** (3 stores: paciente, médico, admin) |
| Data fetching frontend | **TanStack React Query** |
| Validación forms | **React Hook Form + Zod** |
| Notificaciones frontend | **Sonner** |
| HTTP cliente frontend | **axios** (3 tokens: paciente, médico, admin) |
| Route groups doctor | `(portal)` agrupa rutas autenticadas con sidebar; `/login` fuera |

---

## Estructura del repo (lo que existe ahora)

```
clinica-x/
├── frontend/                          # Next.js 14 (puerto 3100)
│   ├── src/app/
│   │   ├── page.tsx                   # Landing mejorada
│   │   ├── layout.tsx                 # Root layout con Providers + Toaster
│   │   ├── globals.css
│   │   ├── login/page.tsx             # Login paciente
│   │   ├── register/page.tsx          # Registro paciente
│   │   ├── reservar-cita/page.tsx    # Wizard de reserva
│   │   ├── perfil/page.tsx            # Perfil paciente (3 tabs)
│   │   ├── doctor/
│   │   │   ├── layout.tsx             # Root layout doctor (solo Providers)
│   │   │   ├── login/page.tsx         # Login médico (fuera del portal)
│   │   │   └── (portal)/
│   │   │       ├── layout.tsx         # Layout autenticado con sidebar
│   │   │       ├── calendario/page.tsx # Calendario médico (3 vistas)
│   │   │       ├── pacientes/page.tsx  # Historial de pacientes
│   │   │       └── consulta/page.tsx   # Consulta médica activa
│   │   ├── admin/
│   │   │   ├── layout.tsx             # Root layout admin (solo Providers)
│   │   │   ├── login/page.tsx         # Login admin (fuera del portal)
│   │   │   └── (portal)/
│   │   │       ├── layout.tsx         # Layout autenticado con sidebar
│   │   │       ├── dashboard/page.tsx # Dashboard KPI + tabla médicos
│   │   │       ├── medicos/page.tsx   # Lista de médicos con filtros
│   │   │       ├── medicos/nuevo/page.tsx   # Crear médico
│   │   │       └── medicos/[id]/editar/page.tsx  # Editar médico
│   ├── src/components/
│   │   ├── shared/
│   │   │   ├── Header.tsx             # Header dinámico (paciente)
│   │   │   └── Footer.tsx
│   │   ├── landing/ContactForm.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
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
│   │   │   ├── CalendarMonth.tsx       # Vista mensual
│   │   │   ├── CalendarWeek.tsx         # Vista semanal
│   │   │   ├── CalendarDay.tsx          # Vista diaria con acciones
│   │   │   ├── ConsultationPanel.tsx    # Panel iniciar/finalizar consulta
│   │   │   └── PatientHistory.tsx       # Historial agrupado por paciente
│   │   ├── admin/
│   │   │   ├── AdminLoginForm.tsx     # **NUEVO** Login admin con validación de rol
│   │   │   ├── AdminSidebar.tsx       # **NUEVO** Sidebar navegación portal admin
│   │   │   ├── DashboardKPI.tsx       # **NUEVO** Tarjetas de métricas KPI
│   │   │   ├── DoctorsTable.tsx        # **NUEVO** Tabla médicos con filtros y toggle
│   │   │   ├── DoctorForm.tsx          # **NUEVO** Formulario crear/editar médico
│   │   │   └── ScheduleGrid.tsx        # **NUEVO** Grid horarios dinámico
│   │   └── Providers.tsx
│   ├── src/lib/api/
│   │   ├── axios.ts                   # Cliente con interceptor JWT (3 tokens)
│   │   ├── types.ts                   # DTOs (ampliado con MedicoDTO, MetricasDashboardDTO, etc.)
│   │   ├── auth.api.ts
│   │   ├── appointments.api.ts
│   │   ├── medical.api.ts
│   │   ├── doctor.api.ts              # 6 endpoints médico
│   │   └── admin.api.ts               # **NUEVO** 7 endpoints admin
│   ├── src/store/
│   │   ├── useAuthStore.ts            # Zustand paciente
│   │   ├── useBookingStore.ts
│   │   ├── useDoctorAuthStore.ts      # Zustand médico
│   │   └── useAdminAuthStore.ts       # **NUEVO** Zustand admin
│   └── tailwind.config.ts             # Paleta teal/indigo
│
├── services/                           # (sin cambios)
├── packages/                           # (sin cambios)
├── scripts/
│   ├── clean-schemas.sql              # DROP/CREATE de los 4 schemas
│   ├── clean-schemas.js               # Wrapper Node (usa `pg`)
│   ├── seed-demo.js                   # **NUEVO** Seed E2E completo
│   ├── test-e2e.js                    # **NUEVO** Tests E2E automatizados
│   └── ...                             # Otros scripts test/debug
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

## Cambios de esta sesión (Fase 8 - parcial)

### Scripts nuevos

1. **`scripts/seed-demo.js`** — Seed E2E completo:
   - Login admin existente
   - Obtiene especialidades de la API
   - Crea 5 médicos con horarios variados (0-5 días/semana, turnos MAÑANA/TARDE)
   - Login de cada médico para obtener tokens
   - Registra 4 pacientes vía API
   - Crea citas manuales y automáticas entre pacientes y médicos
   - Inicia y finaliza consultas para tener historial
   - Imprime credenciales demo al finalizar

2. **`scripts/test-e2e.js`** — Tests E2E automatizados (3 flujos):
   - Flujo admin: login → me → dashboard → crear médico → editar → toggle estado
   - Flujo paciente: login → perfil → especialidades → disponibilidad → reservar → listar → cancelar → historial
   - Flujo médico: login → me → calendario → consulta activa → iniciar → finalizar → historial
   - Reporte final con PASARON / FALLARON

3. **Scripts en `package.json` raíz:**
   - `pnpm seed:demo` — Ejecuta `node scripts/seed-demo.js`
   - `pnpm seed:all` — Ejecuta Prisma seeds + seed demo
   - `pnpm test:e2e` — Ejecuta `node scripts/test-e2e.js`

### Datos demo generados

| Rol | DNI | Email | Password | Portal |
|---|---|---|---|---|
| ADMIN | 00000000 | admin@clinicax.com | Admin123! | /admin/login |
| Médico | 10101010 | maria.garcia@clinicax.com | Medico123! | /doctor/login |
| Médico | 20202020 | carlos.lopez@clinicax.com | Medico123! | /doctor/login |
| Médico | 30303030 | ana.martinez@clinicax.com | Medico123! | /doctor/login |
| Médico | 40404040 | roberto.sanchez@clinicax.com | Medico123! | /doctor/login |
| Médico | 50505050 | laura.fernandez@clinicax.com | Medico123! | /doctor/login |
| Paciente | 60606060 | juan.perez@email.com | Paciente123! | /login |
| Paciente | 70707070 | lucia.rodriguez@email.com | Paciente123! | /login |
| Paciente | 80808080 | pedro.gomez@email.com | Paciente123! | /login |
| Paciente | 90909090 | sofia.torres@email.com | Paciente123! | /login |

---

## Endpoints funcionales (sin cambios nuevos en backend)

Todos los endpoints de Fases 1-4 siguen funcionando. Los endpoints usados por los portales médico y admin ya existían:

| Endpoint | Método | Auth | Uso en frontend |
|---|---|---|---|
| `POST /api/auth/login` | POST | Público | Login médico, admin |
| `GET /api/auth/me` | GET | JWT | Verificar sesión |
| `GET /api/admin/doctors` | GET | JWT + ADMIN | Dashboard + lista médicos |
| `POST /api/admin/doctors` | POST | JWT + ADMIN | Crear médico |
| `GET /api/admin/doctors/:id` | GET | JWT + ADMIN | Obtener médico por ID |
| `PUT /api/admin/doctors/:id` | PUT | JWT + ADMIN | Actualizar médico |
| `PATCH /api/admin/doctors/:id/status` | PATCH | JWT + ADMIN | Activar/desactivar médico |
| `GET /api/appointments/specialties` | GET | JWT | Dropdown especialidades en form |
| `GET /api/appointments/doctor/calendar` | GET | JWT + MEDICO | Calendario médico |
| `PATCH /api/appointments/doctor/:id/status` | PATCH | JWT + MEDICO | Cambiar estado cita |
| `POST /api/medical/doctor/consultation/start` | POST | JWT + MEDICO | Iniciar consulta |
| `POST /api/medical/doctor/consultation/:id/finalize` | POST | JWT + MEDICO | Finalizar consulta |
| `GET /api/medical/doctor/active-patient` | GET | JWT + MEDICO | Consulta activa |
| `GET /api/medical/doctor/patients` | GET | JWT + MEDICO | Historial pacientes |

---

## Próximos pasos (Fase 8: continuar)

### 2. Pulido
- [ ] Responsive: verificar que las tablas y formularios funcionen en mobile
- [ ] Loading states: skeletons o spinners en todas las páginas
- [ ] Error boundaries: manejar errores de red gracefulmente

### 3. Tests manuales de flujos completos
- [ ] Flujo paciente: registro → login → reservar cita → ver perfil
- [ ] Flujo médico: login → calendario → iniciar consulta → finalizar
- [ ] Flujo admin: login → dashboard → crear médico → editar → toggle estado

---

## Notas para el siguiente desarrollador

1. **Tres stores Zustand separados.** `useAuthStore` (paciente), `useDoctorAuthStore` (médico), `useAdminAuthStore` (admin). Cada uno usa su propia key de localStorage.

2. **El `axios.ts` ya maneja los 3 tokens** según el path (`/doctor` → `clinica_x_doctor_token`, `/admin` → `clinica_x_admin_token`, default → `clinica_x_token`). Auto-logout en 401 redirige al login correspondiente.

3. **Los route groups de Next.js** (`(portal)`) no afectan la URL. Las rutas admin son `/admin/dashboard`, `/admin/medicos`, `/admin/medicos/nuevo`, `/admin/medicos/[id]/editar`.

4. **El login admin valida el rol.** Si el JWT no tiene `rol: 'ADMIN'`, se muestra un error y no se persiste la sesión.

5. **La paleta de colores por portal:**
   - Paciente: teal/brand (`brand-500`, `brand-700`)
   - Médico: indigo (`indigo-600`, `indigo-700`)
   - Admin: emerald (`emerald-600`, `emerald-700`)

6. **El formulario DoctorForm** tiene 3 secciones: Datos Personales, Datos Profesionales y Horarios. Al editar, los datos del médico se populan automáticamente desde la API. La contraseña es opcional al editar (dejar vacío para no cambiar).

7. **El ScheduleGrid** permite agregar/eliminar filas de horarios dinámicamente. Cada fila tiene selector de día (1-7), hora inicio y hora fin (inputs time). Al crear un médico, al menos 1 horario es requerido.

8. **La función `getAdminDashboard`** devuelve `{ doctors: MedicoDTO[], metrics: MetricasDashboardDTO }`. La tabla de médicos se muestra tanto en `/admin/dashboard` como en `/admin/medicos`.

9. **Los datos personales del médico** (nombre, apellido, dni, email) en el listado pueden aparecer como `"--"` si el backend no llama a auth-service. Solo el endpoint de creación sí sincroniza con auth-service. Esto es una limitación conocida del backend.

10. **Para probar el flujo completo del admin:**
    ```bash
    # 1. Levantar servicios
    pnpm dev:services

    # 2. En otra terminal, levantar frontend
    pnpm dev:frontend

    # 3. Ejecutar seed completo (Prisma seeds + datos demo)
    pnpm seed:all

    # 4. Ejecutar tests E2E automatizados
    pnpm test:e2e

    # O ejecutar solo el seed demo (si ya corriste los Prisma seeds antes)
    pnpm seed:demo
    ```

11. **Credenciales demo** (ver tabla arriba en esta sección):
    - Admin: `00000000` / `admin@clinicax.com` / `Admin123!`
    - Médico: `10101010` / `maria.garcia@clinicax.com` / `Medico123!`
    - Paciente: `60606060` / `juan.perez@email.com` / `Paciente123!`

12. **Limitaciones conocidas:**
    - Los datos personales (nombre, apellido, dni, email) del listado de médicos vienen como `"--"` desde el backend. Se necesita un cross-service lookup o agregar estos campos al endpoint de listado.
    - No hay paginación en la lista de médicos.
    - No hay confirmación modal antes de desactivar un médico (toggle directo).
    - El seed de datos usa la API Gateway, por lo que requiere que todos los servicios estén levantados.

*Documento actualizado al finalizar la sesión #8 (Fase 8 parcial - seed y tests E2E completados).*