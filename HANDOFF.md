# HANDOFF — Clínica X

> **Fecha de sesión:** 2026-05-15
> **Sesión #:** 6 (Fase 6 Frontend médico)
> **Estado:** Fase 0 ✅ | Fase 1 ✅ | Fase 2 ✅ | Fase 3 ✅ | Fase 4 ✅ | Fase 5 ✅ | Fase 6 ✅ | Listo para Fase 7

---

## Resumen ejecutivo

En la sesión #6 se implementó el **frontend del médico** (Fase 6), incluyendo login médico, calendario con 3 vistas, gestión de consultas y historial de pacientes.

**Logros clave de esta sesión:**
- Login médico con validación de rol (solo MEDICO puede acceder al portal médico)
- Store Zustand `useDoctorAuthStore` con persistencia en localStorage bajo `clinica_x_doctor_token` y `clinica_x_doctor_user`
- Layout del portal médico con sidebar de navegación (Calendario, Pacientes, Cerrar sesión)
- Calendario del médico con 3 vistas intercambiables:
  - **Mensual**: grilla con citas por día, colores por estado
  - **Semanal**: timeline horario con tarjetas de cita clickeables
  - **Diaria**: lista detallada con acciones (iniciar atención, completar, cancelar)
- Página de consulta médica:
  - Iniciar consulta (envía `POST /api/medical/doctor/consultation/start`)
  - Panel de consulta activa con campos de diagnóstico y notas
  - Finalizar consulta (envía `POST /api/medical/doctor/consultation/:id/finalize`)
  - Cambio de estado de cita (`PATCH /api/appointments/doctor/:id/status`)
  - Placeholder del Agente X (chat IA "Próximamente")
- Página de pacientes con historial agrupado por paciente
  - Filtro por rango de fechas
  - Indicador de consulta activa con botón rápido
  - Expandible para ver consultas por paciente
- API functions: `doctor.api.ts` con 6 endpoints médicos
- Route groups de Next.js para separar login del portal autenticado
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
| **5** | Frontend paciente | ✅ Completa | Landing, auth, reservas, perfil con 3 tabs |
| **6** | Frontend médico | ✅ **Completa** | Login médico, calendario 3 vistas, consulta, historial pacientes |
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
│   │   │   ├── login/page.tsx         # Placeholder
│   │   │   └── dashboard/page.tsx     # Placeholder
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
│   │   │   ├── DoctorLoginForm.tsx     # **NUEVO** Login médico con validación de rol
│   │   │   ├── DoctorSidebar.tsx       # **NUEVO** Sidebar navegación portal médico
│   │   │   ├── DoctorCalendar.tsx      # **NUEVO** Contenedor calendario (3 vistas)
│   │   │   ├── CalendarMonth.tsx       # **NUEVO** Vista mensual
│   │   │   ├── CalendarWeek.tsx         # **NUEVO** Vista semanal
│   │   │   ├── CalendarDay.tsx          # **NUEVO** Vista diaria con acciones
│   │   │   ├── ConsultationPanel.tsx    # **NUEVO** Panel iniciar/finalizar consulta
│   │   │   └── PatientHistory.tsx       # **NUEVO** Historial agrupado por paciente
│   │   └── Providers.tsx
│   ├── src/lib/api/
│   │   ├── axios.ts                   # Cliente con interceptor JWT (3 tokens)
│   │   ├── types.ts                   # DTOs (ampliado con CitaCalendarioDTO, ConsultaMedicoDTO, PacienteHistorialDTO)
│   │   ├── auth.api.ts
│   │   ├── appointments.api.ts
│   │   ├── medical.api.ts
│   │   └── doctor.api.ts              # **NUEVO** 6 endpoints médicos
│   ├── src/store/
│   │   ├── useAuthStore.ts            # Zustand paciente
│   │   ├── useBookingStore.ts
│   │   └── useDoctorAuthStore.ts      # **NUEVO** Zustand médico
│   └── tailwind.config.ts             # Paleta teal/indigo
│
├── services/                           # (sin cambios)
├── packages/                           # (sin cambios)
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

## Cambios de esta sesión (Fase 6)

### Frontend

1. **Nuevo store `useDoctorAuthStore`**:
   - Claves localStorage: `clinica_x_doctor_token`, `clinica_x_doctor_user`
   - Valida que el rol sea `MEDICO` al cargar auth persistida
   - Mismas acciones que `useAuthStore`: `setAuth`, `clearAuth`, `updateUser`

2. **Nuevo archivo `lib/api/doctor.api.ts`** con 6 funciones:
   - `getDoctorCalendar(params?)` → `GET /api/appointments/doctor/calendar`
   - `changeAppointmentStatus(id, estado)` → `PATCH /api/appointments/doctor/:id/status`
   - `startConsultation(data)` → `POST /api/medical/doctor/consultation/start`
   - `finalizeConsultation(id, data)` → `POST /api/medical/doctor/consultation/:id/finalize`
   - `getActivePatient()` → `GET /api/medical/doctor/active-patient`
   - `getDoctorPatients(params?)` → `GET /api/medical/doctor/patients`

3. **Nuevos tipos en `lib/api/types.ts`**:
   - `CitaCalendarioDTO` (extiende CitaDTO con datos del paciente)
   - `ConsultaMedicoDTO` (extiende ConsultaDTO con datos del paciente)
   - `PacienteHistorialDTO` (resumen por paciente)

4. **Route groups en Next.js**:
   - `/doctor/login` → sin sidebar, sin auth check
   - `/doctor/(portal)/calendario`, `/doctor/(portal)/pacientes`, `/doctor/(portal)/consulta` → con sidebar + auth check

5. **Componentes doctor nuevos** (7 archivos):
   - `DoctorLoginForm.tsx`: Login con validación Zod, verificación de rol MEDICO
   - `DoctorSidebar.tsx`: Navegación lateral con avatar, links y logout
   - `DoctorCalendar.tsx`: Contenedor con selector de vista y navegación de fechas
   - `CalendarMonth.tsx`: Grilla mensual con citas coloreadas por estado
   - `CalendarWeek.tsx`: Timeline semanal 7am-8pm con tarjetas de cita
   - `CalendarDay.tsx`: Vista diaria con lista detallada y botones de acción
   - `ConsultationPanel.tsx`: Panel de iniciar/finalizar consulta con form Zod
   - `PatientHistory.tsx`: Historial agrupado por paciente, expandible

6. **Páginas** (3 rutas nuevas):
   - `/doctor/calendario` → Calendario con 3 vistas, React Query para citas
   - `/doctor/pacientes` → Historial de pacientes con filtro de fechas
   - `/doctor/consulta` → Consulta activa (recibe `pacienteId`, `citaId` via query params)

7. **Layouts**:
   - `/doctor/layout.tsx` → Root layout (solo Providers, sin sidebar)
   - `/doctor/(portal)/layout.tsx` → Auth layout con sidebar y redirección

---

## Endpoints funcionales (sin cambios nuevos en backend)

Todos los endpoints de Fases 1-4 siguen funcionando. Los endpoints usados por el portal médico ya existían:

| Endpoint | Método | Auth | Uso en frontend |
|---|---|---|---|
| `POST /api/auth/login` | POST | Público | Login médico |
| `GET /api/auth/me` | GET | JWT | Verificar sesión |
| `GET /api/appointments/specialties` | GET | JWT + PACIENTE/MEDICO | No usado en médico |
| `GET /api/appointments/doctor/calendar` | GET | JWT + MEDICO | Calendario médico |
| `PATCH /api/appointments/doctor/:id/status` | PATCH | JWT + MEDICO | Cambiar estado cita |
| `POST /api/medical/doctor/consultation/start` | POST | JWT + MEDICO | Iniciar consulta |
| `POST /api/medical/doctor/consultation/:id/finalize` | POST | JWT + MEDICO | Finalizar consulta |
| `GET /api/medical/doctor/active-patient` | GET | JWT + MEDICO | Consulta activa |
| `GET /api/medical/doctor/patients` | GET | JWT + MEDICO | Historial pacientes |

---

## Próximos pasos (Fase 7: Frontend admin)

### 1. Portal admin
- [ ] Login admin (reusar LoginForm con rol)
- [ ] Dashboard con métricas KPI (`GET /api/admin/dashboard/metrics`)
- [ ] Tabla de médicos con filtros y toggle de estado
- [ ] Formulario de creación/edición de médico con grid de horarios
- [ ] Zona de peligro (desactivar médico)

### 2. Preparación Fase 8 (Integración E2E)
- [ ] Seed de datos demo
- [ ] Pulido responsive
- [ ] Tests manuales de flujos completos

---

## Notas para el siguiente desarrollador

1. **Tres stores Zustand separados.** `useAuthStore` (paciente), `useDoctorAuthStore` (médico). Faltará `useAdminAuthStore` en Fase 7. Cada uno usa su propia key de localStorage.

2. **El `axios.ts` ya maneja los 3 tokens** según el path (`/doctor` → `clinica_x_doctor_token`, `/admin` → `clinica_x_admin_token`, default → `clinica_x_token`).

3. **Los route groups de Next.js** (`(portal)`) no afectan la URL. Las rutas siguen siendo `/doctor/calendario`, `/doctor/pacientes`, `/doctor/consulta`.

4. **El login médico valida el rol.** Si el JWT no tiene `rol: 'MEDICO'`, se muestra un error y no se persiste la sesión.

5. **La vista diaria del calendario** muestra botones de acción contextuales según el estado de la cita:
   - `CONFIRMADA` → "Iniciar atención" (cambia a EN_ATENCION) + "Iniciar consulta" (navega a `/doctor/consulta`)
   - `EN_ATENCION` → "Completar" (cambia a COMPLETADA)
   - `CANCELADA`/`COMPLETADA` → sin acciones

6. **El panel de consulta** permite iniciar y finalizar una consulta. Al finalizar, navega de vuelta al calendario.

7. **El placeholder del Agente X** está en la página de consulta. El chat IA es un stub visual; se implementará cuando `AI_ENABLED=true`.

8. **Para probar el flujo completo del médico:**
   ```bash
   # 1. Levantar servicios
   pnpm dev:services

   # 2. En otra terminal, levantar frontend
   pnpm dev:frontend

   # 3. Crear un médico vía admin API (o usar un usuario con rol MEDICO)
   # 4. Login en /doctor/login
   # 5. Ver calendario en /doctor/calendario
   # 6. Gestionar citas y consultas
   # 7. Ver historial en /doctor/pacientes
   ```

9. **Limitaciones conocidas:**
   - El nombre del paciente en las citas (`pacienteNombre`, `pacienteApellido`) no viene del backend actualmente. El backend del calendario médico devuelve solo `pacienteId`. Se necesita un cross-service lookup o agregar estos campos al endpoint.
   - No hay paginación en el historial de pacientes.
   - No hay soporte para reprogramar citas desde el portal médico.

---

*Documento actualizado al finalizar la sesión #6 (Fase 6 completada).*