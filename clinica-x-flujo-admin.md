# Clínica X — Planificación de Flujo: ROL ADMINISTRADOR
**Versión:** 1.0.0 | **Fecha:** 2025 | **Para:** Claude Code

> Este documento cubre exclusivamente el flujo completo del **Administrador** en Clínica X.
> Los flujos de Paciente y Médico están en documentos separados.
> Complementar con: `Arquitectura Hexagonal + DDD — Guía de Implementación.md`

---

## Índice

1. [Rutas y páginas del Administrador](#1-rutas-y-páginas-del-administrador)
2. [Autenticación del Administrador](#2-autenticación-del-administrador)
3. [Header del Portal Admin](#3-header-del-portal-admin)
4. [Dashboard — Vista Principal](#4-dashboard--vista-principal)
5. [Formulario Nuevo Doctor / Editar Doctor](#5-formulario-nuevo-doctor--editar-doctor)
6. [Acciones sobre médicos desde el Dashboard](#6-acciones-sobre-médicos-desde-el-dashboard)
7. [Estados y transiciones de UI](#7-estados-y-transiciones-de-ui)
8. [Contratos de API que consume el Administrador](#8-contratos-de-api-que-consume-el-administrador)
9. [Estructura de carpetas frontend — Admin](#9-estructura-de-carpetas-frontend--admin)

---

## 1. Rutas y páginas del Administrador

### Rutas privadas (requieren JWT con role: ADMIN)

| Ruta | Componente/Page | Descripción |
|------|-----------------|-------------|
| `/admin/login` | `app/(admin)/login/page.tsx` | Login exclusivo del administrador |
| `/admin/dashboard` | `app/(admin)/dashboard/page.tsx` | Dashboard con métricas y tabla de médicos |
| `/admin/doctors/new` | `app/(admin)/doctors/new/page.tsx` | Formulario para registrar nuevo médico |
| `/admin/doctors/:id/edit` | `app/(admin)/doctors/[id]/edit/page.tsx` | Formulario para editar médico existente |

### Reglas de redirección

```
Si el admin NO está autenticado y accede a /admin/* → redirigir a /admin/login
Si el admin YA está autenticado y accede a /admin/login → redirigir a /admin/dashboard
El admin NO puede acceder a rutas del paciente ni del médico
Al hacer clic en "Nuevo Doctor" del header → navega a /admin/doctors/new
Al hacer clic en ícono de editar en la tabla → navega a /admin/doctors/:id/edit
Al hacer clic en "<< Regresar" desde el formulario → navega a /admin/dashboard
```

---

## 2. Autenticación del Administrador

### Página de Login (`/admin/login`)

El administrador **no puede registrarse** desde la plataforma.
El administrador **no puede restablecer contraseña** desde la plataforma.
Su cuenta existe de forma inicial (seeded en la base de datos al desplegar el sistema).

**Campos del formulario:**
1. Usuario — input text (email del admin)
2. Contraseña — input password

**Sin elementos adicionales:** no hay link de "¿Olvidaste tu contraseña?", no hay link de registro.

**Validaciones:**
```typescript
const adminLoginSchema = z.object({
  email: z.string().email("Usuario inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});
```

**Flujo post-login:**
1. Llamar `POST /api/auth/login` con `{ email, password }`
2. Verificar en la respuesta que `user.role === 'ADMIN'`
3. Si role no es ADMIN: mostrar "Credenciales inválidas" (mensaje genérico)
4. En éxito: guardar JWT en localStorage bajo `clinica_x_admin_token` → redirigir a `/admin/dashboard`
5. En error: mostrar "Usuario o contraseña incorrectos"

**Diseño de la página de login del admin:**
- Card centrado con logo "Portal Admin" + ícono de administración
- Formulario con solo los dos campos + botón "Ingresar"
- Sin opciones adicionales

---

## 3. Header del Portal Admin

```
┌──────────────────────────────────────────────────────────────────────┐
│  Portal Admin 🩺      [Dashboard]    [Nuevo Doctor]    Admin  [A]     │
│                                                        Cerrar sesión  │
└──────────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Izquierda: "Portal Admin" con ícono (diferenciado del portal médico)
- Centro: exactamente dos links de navegación
  - "Dashboard" → `/admin/dashboard`
  - "Nuevo Doctor" → `/admin/doctors/new`
  - El link activo tiene subrayado o color primario
- Derecha: nombre del admin autenticado + avatar con inicial + "Cerrar sesión"
  - "Cerrar sesión" limpia token → redirige a `/admin/login`

**Componente:** `components/admin/AdminHeader.tsx`

---

## 4. Dashboard — Vista Principal

**Ruta:** `/admin/dashboard`

### Layout general

```
┌──────────────────────────────────────────────────────────────────────┐
│  [TOTAL MÉDICOS: 10]  [ACTIVOS: 4]  [INACTIVO: 6]  [ESPECIALIDADES: 6] │
├──────────────────────────────────────────────────────────────────────┤
│  Médicos                          [Filtro dropdown ▼]  [Agregar +]  │
│  Gestiona los datos de tus médicos, sus horarios y más              │
├──────────────────────────────────────────────────────────────────────┤
│  Nombre       Especialidad   Horario              Turno   Estado  Acciones │
│  ─────────────────────────────────────────────────────────────────  │
│  Anghelina... Dermatología   Lunes, Miércoles...  Mañana  Activo ✏ 🔘 │
│  Anghelina... Dermatología   Lunes, Miércoles...  Mañana  Activo ✏ 🔘 │
│  ...                                                                │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Sección de métricas (KPI cards)

Cuatro cards en fila horizontal, cada una con:
- Fondo color primario (teal)
- Texto del label en mayúsculas (ej. "TOTAL MÉDICOS")
- Número grande debajo
- Colores del número según el card:
  - TOTAL MÉDICOS → número blanco o claro
  - ACTIVOS → número en verde claro
  - INACTIVO → número en rojo/coral
  - ESPECIALIDADES → número blanco o claro

**Datos de las métricas:**
```typescript
interface DashboardMetrics {
  totalDoctors: number;       // todos los médicos registrados
  activeDoctors: number;      // isActive === true
  inactiveDoctors: number;    // isActive === false
  totalSpecialties: number;   // número de especialidades distintas con al menos 1 médico activo
}
```

**Endpoint:** `GET /api/admin/doctors` (las métricas se calculan del mismo listado o hay un endpoint dedicado `GET /api/admin/dashboard/metrics`)

---

### Sección de tabla de médicos

#### Header de la tabla

- Título "Médicos" en negrita
- Subtítulo: "Gestiona los datos de tus médicos, sus horarios y más"
- Derecha: dropdown de filtro + botón "Agregar +"

**Dropdown de filtro:**
- Placeholder: vacío o "Filtrar por..."
- Opciones:
  - Todos
  - Activos
  - Inactivos
  - Por especialidad (una opción por cada especialidad disponible)
- Al seleccionar → filtra la tabla en tiempo real (client-side, ya que los datos ya están cargados)

**Botón "Agregar +":**
- Botón primario (teal) con ícono +
- Al hacer clic → navega a `/admin/doctors/new`

#### Columnas de la tabla

| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre completo del médico (ej. "Anghelina Alva Encinas") |
| **Especialidad** | Especialidad médica (ej. "Dermatología") |
| **Horario** | Días de atención resumidos (ej. "Lunes, Miércoles, Viernes") |
| **Turno** | Turno del médico (ej. "Mañana" o "Tarde") |
| **Estado** | "Activo" (texto verde) o "Inactivo" (texto rojo) |
| **Acciones** | Dos controles: ícono de editar + toggle de activar/desactivar |

**Especificaciones de la tabla:**
- Sin paginación en MVP (cargar todos los médicos en una sola llamada)
- Filas separadas por línea divisoria sutil
- Texto de nombre truncado con ellipsis si es muy largo
- Horario: mostrar los días abreviados separados por coma

#### Columna Acciones

```
✏  🔘
```

- **Ícono de lápiz (✏):** al hacer clic → navega a `/admin/doctors/:id/edit`
- **Toggle (🔘):** switch de encendido/apagado
  - Toggle ON (verde) = médico Activo
  - Toggle OFF (gris) = médico Inactivo
  - Al cambiar el toggle → llamar directamente `PATCH /api/admin/doctors/:id/status` con `{ isActive: boolean }`
  - Mostrar loading en el toggle mientras espera la respuesta
  - Si falla: revertir el toggle a su estado anterior + mostrar toast de error
  - No requiere modal de confirmación (acción directa e inmediata)
  - Al desactivar un médico activo: sus citas futuras siguen en el sistema (el backend no las cancela automáticamente en MVP)

---

## 5. Formulario Nuevo Doctor / Editar Doctor

**Ruta nueva:** `/admin/doctors/new`
**Ruta edición:** `/admin/doctors/:id/edit`

Ambas rutas usan el **mismo componente de formulario** (`DoctorForm.tsx`). La diferencia:
- En "new": formulario vacío, título "Nuevo Médico / Actualizar Médico", botón "Guardar cambios" crea el médico
- En "edit": formulario pre-cargado con datos del médico, misma estructura, botón "Guardar cambios" actualiza

### Layout general del formulario

```
┌──────────────────────────────────────────────────────────────────────┐
│  Nuevo Médico / Actualizar Médico              << Regresar           │
│  Aquí podrás registrar o actualizar los datos del médico indicado   │
├────────────────────────────┬─────────────────────────────────────────┤
│  PANEL IZQUIERDO           │  PANEL DERECHO                          │
│  (datos del médico)        │  (horario de atención)                  │
│                            │                                         │
│  [Avatar + foto]           │  Horario de atención                    │
│  [Nombre del médico]       │  Elige el horario                       │
│  [Especialidad badge]      │                                         │
│                            │  [Mes Año]                              │
│  Nombre completo [input]   │  L  M  M  J  V                          │
│  DNI           [input]     │  [slots de horas]  [grid de días]       │
│  Correo        [input]     │                                         │
│  Teléfono      [input]     │                                         │
│  Usuario       [input]     │                                         │
│  Turno [☑Mañana] [○Tarde]  │                                         │
│  Contraseña    [input 👁]  │                                         │
│                            │                                         │
│  [ZONA DE PELIGRO]         │                                         │
│  [🗑 Desactivar Médico]    │                  [Guardar cambios →]    │
└────────────────────────────┴─────────────────────────────────────────┘
```

**Link "<< Regresar":** alineado a la derecha del título → navega a `/admin/dashboard`

---

### Panel Izquierdo — Datos del Médico

#### Avatar y datos de cabecera

- Avatar circular grande (120px) con foto del médico o iniciales
- Ícono de cámara superpuesto en el avatar → al hacer clic abre file picker para subir foto (opcional en MVP, puede omitirse)
- Debajo del avatar: nombre del médico (se actualiza dinámicamente mientras escribe en el campo "Nombre completo")
- Badge de especialidad debajo del nombre (se actualiza al cambiar el campo de especialidad)

#### Campos del formulario

| Campo | Tipo | Validación | Placeholder |
|-------|------|-----------|-------------|
| Nombre completo | text | required, mín 3 chars | "Ej. Anghelina Rivera" |
| DNI | text | required, 8 dígitos numéricos | "71132904" |
| Correo | email | required, formato email | "doctor@gmail.com" |
| Teléfono | tel | required, mín 9 dígitos | "+51 (956) 123-4 (038)" |
| Usuario | text | required, mín 4 chars, sin espacios | "drAlicia" |
| Turno | radio | required, una opción | — |
| Contraseña | password | required en creación, opcional en edición (mín 8 chars) | "••••••••" |

**Campo Especialidad:**
- No aparece como un input de texto libre
- Es un campo `select` o `combobox` con las especialidades disponibles
- Las especialidades son un listado fijo (constante del sistema) o se obtienen de `GET /api/internal/specialties`
- Especialidades sugeridas: Medicina General, Cardiología, Traumatología, Dermatología, Pediatría, Neurología, Ginecología, Oftalmología, etc.
- El badge de especialidad en el avatar se actualiza al seleccionar

**Campo Turno:**
- Dos opciones con checkboxes/radio buttons en fila:
  - `[✓] Mañana` — turno de mañana (ej. 08:00 - 13:00)
  - `[ ] Tarde` — turno de tarde (ej. 14:00 - 19:00)
- Solo se puede seleccionar uno (radio behavior)
- El turno elegido define qué bloques horarios están disponibles en el panel derecho

**Campo Contraseña:**
- Input tipo password con ícono de ojo (👁) para mostrar/ocultar
- En creación (new): requerida
- En edición: opcional — si se deja vacío, la contraseña no se modifica
- En edición: mostrar texto auxiliar "Dejar vacío para mantener la contraseña actual"

**Validaciones Zod:**
```typescript
const doctorFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().length(8).regex(/^\d+$/, "DNI debe tener 8 dígitos"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  username: z.string().min(4, "Mínimo 4 caracteres").regex(/^\S+$/, "Sin espacios"),
  specialty: z.string().min(1, "Selecciona una especialidad"),
  shift: z.enum(['MORNING', 'AFTERNOON']),
  password: z.string().min(8, "Mínimo 8 caracteres").optional().or(z.literal(''))
});
```

#### Zona de Peligro (solo visible en modo edición)

```
┌────────────────────────────────────────────────────────┐
│  ⚠ ZONA DE PELIGRO                                     │
│  Esta acción no se puede deshacer fácilmente...        │
│  también cancelará todas las citas pendientes...       │
│                                                        │
│  [🗑 Desactivar Médico]                               │
└────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Solo aparece en modo edición (`/admin/doctors/:id/edit`), NO en el formulario de nuevo médico
- Fondo rojo muy claro (danger-50), borde rojo, texto explicativo de consecuencias
- Botón "Desactivar Médico" con ícono de papelera, color rojo
- Al hacer clic → abrir modal de confirmación:
  ```
  "¿Seguro que deseas desactivar al Dr. [nombre]?
  Sus citas futuras permanecerán en el sistema pero
  el médico no aparecerá disponible para nuevas reservas.
  Esta acción puede revertirse activando el toggle en el Dashboard."
  
  [Sí, desactivar]  [Cancelar]
  ```
- Si confirma: llama `PATCH /api/admin/doctors/:id/status` con `{ isActive: false }` → redirige a `/admin/dashboard` con toast "Médico desactivado"

---

### Panel Derecho — Horario de Atención

#### Selector de horario visual

```
Horario de atención
Elige el horario

        Abril 2026
        L   M   M   J   V
┌───┐  ┌───┬───┬───┬───┬───┐
│08:00│  │   │   │   │   │   │
│─08:30│  │   │   │   │   │   │
├───┤  ├───┼───┼───┼───┼───┤
│08:30│  │   │   │   │   │   │
│─09:00│  │   │   │   │   │   │
├───┤  ├───┼───┼───┼───┼───┤
│09:00│  │   │   │   │   │   │
│─09:30│  │   │   │   │   │   │
└───┘  └───┴───┴───┴───┴───┘
```

**Especificaciones:**
- Columna izquierda: slots de hora (ej. "08:00 - 08:30") con fondo teal — igual que el calendario del médico
- Grid derecho: columnas L, M, M, J, V (Lunes a Viernes)
- Celdas del grid: clickeables para marcar/desmarcar disponibilidad
  - Celda vacía = no disponible (fondo blanco/gris claro)
  - Celda marcada = disponible (fondo teal/primario con check o fondo relleno)
- El administrador selecciona qué combinaciones de hora + día el médico atiende
- Los slots de hora disponibles dependen del **Turno** seleccionado en el panel izquierdo:
  - Turno Mañana: bloques de 08:00 a 13:00
  - Turno Tarde: bloques de 14:00 a 19:00
- La duración de cada bloque es de 30 minutos (configurable por constante)

**Interacción:**
- Al hacer clic en una celda vacía → se marca (color primario)
- Al hacer clic en una celda marcada → se desmarca (vuelve a vacío)
- No hay botón de "seleccionar todo" ni "limpiar todo" en MVP
- Los datos del horario se guardan como `DoctorSchedule[]` donde cada registro es `{ dayOfWeek, startTime, endTime, slotDuration }`

**Mapeado de columnas a `dayOfWeek`:**
```
L = 1 (Lunes)
M = 2 (Martes)
M = 3 (Miércoles)
J = 4 (Jueves)
V = 5 (Viernes)
```

---

### Botón Guardar Cambios

- Alineado a la derecha inferior del layout completo
- Texto: "Guardar cambios"
- Botón primario (teal)
- Al hacer clic:
  1. Validar todo el formulario (React Hook Form + Zod)
  2. Mostrar errores inline bajo cada campo si hay validaciones fallidas
  3. Si es válido: mostrar loading en el botón
  4. **Creación:** llamar `POST /api/admin/doctors` con todos los datos + horario
  5. **Edición:** llamar `PUT /api/admin/doctors/:id` con datos modificados + horario actualizado
  6. En éxito: redirigir a `/admin/dashboard` con toast "Médico guardado correctamente"
  7. En error (email/DNI/usuario duplicado): mostrar mensaje de error inline bajo el campo correspondiente

---

## 6. Acciones sobre médicos desde el Dashboard

### Resumen de acciones disponibles

| Acción | Dónde | Llamada API |
|--------|-------|-------------|
| Crear médico | Botón "Agregar +" o "Nuevo Doctor" en header | `POST /api/admin/doctors` |
| Editar médico | Ícono ✏ en la tabla | `PUT /api/admin/doctors/:id` |
| Activar/desactivar (toggle) | Switch 🔘 en la tabla | `PATCH /api/admin/doctors/:id/status` |
| Desactivar (zona de peligro) | Botón en formulario de edición | `PATCH /api/admin/doctors/:id/status` |

### Flujo de creación de médico — end to end

```
1. Admin hace clic en "Nuevo Doctor" (header) o "Agregar +" (tabla)
2. Navega a /admin/doctors/new
3. Llena: nombre, DNI, correo, teléfono, usuario, especialidad, turno, contraseña
4. Configura el horario en el panel derecho (selecciona celdas)
5. Hace clic en "Guardar cambios"
6. Backend crea:
   a. User con role=DOCTOR, passwordHash=bcrypt(password)
   b. Doctor con userId, specialty, isActive=true
   c. DoctorSchedule[] con los bloques seleccionados
7. Redirige a /admin/dashboard
8. El nuevo médico aparece en la tabla
9. El médico ya puede hacer login con sus credenciales en /doctor/login
```

### Flujo de edición de médico — end to end

```
1. Admin hace clic en ícono ✏ en la fila del médico
2. Navega a /admin/doctors/:id/edit
3. Formulario pre-cargado con datos actuales del médico
4. Admin modifica los campos necesarios
5. Campo contraseña: si lo deja vacío, no se modifica; si escribe algo, se actualiza
6. Puede modificar el horario (agregar/quitar celdas)
7. Hace clic en "Guardar cambios"
8. Backend actualiza User y Doctor, reemplaza DoctorSchedule[] con los nuevos
9. Redirige a /admin/dashboard con toast de confirmación
```

---

## 7. Estados y transiciones de UI

### Estado de carga

- Skeleton loaders para la tabla de médicos al cargar el dashboard
- Spinner en el botón "Guardar cambios" mientras procesa
- Loading state en el toggle al cambiar estado activo/inactivo

### Estado vacío (empty states)

| Contexto | Mensaje |
|----------|---------|
| Sin médicos registrados | "Aún no has registrado médicos. Haz clic en 'Agregar +' para comenzar." |
| Sin resultados con el filtro | "No hay médicos que coincidan con el filtro seleccionado." |

### Toast/notificaciones

| Evento | Tipo | Mensaje |
|--------|------|---------|
| Médico creado | ✅ Success | "Médico registrado correctamente" |
| Médico actualizado | ✅ Success | "Datos del médico actualizados" |
| Médico desactivado | ✅ Success | "Médico desactivado correctamente" |
| Médico activado (toggle) | ✅ Success | "Médico activado correctamente" |
| Error al guardar | ❌ Error | "No se pudo guardar. Revisa los datos e intenta nuevamente." |
| Email/DNI duplicado | ❌ Error | "Ya existe un médico con ese [email / DNI / usuario]." |
| Error al cambiar estado | ❌ Error | "No se pudo cambiar el estado del médico." |

---

## 8. Contratos de API que consume el Administrador

### Auth Service (`/api/auth` y `/api/admin`)

```typescript
// POST /api/auth/login
Request: { email: string, password: string }
Response: { success: true, data: { token: string, user: UserDTO } }
// Validar user.role === 'ADMIN' en el frontend

// GET /api/admin/doctors
// Lista todos los médicos (activos e inactivos)
Response: {
  success: true,
  data: {
    doctors: DoctorAdminDTO[],
    metrics: DashboardMetrics
  }
}

interface DashboardMetrics {
  totalDoctors: number;
  activeDoctors: number;
  inactiveDoctors: number;
  totalSpecialties: number;
}

interface DoctorAdminDTO {
  id: string;           // doctorId
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni: string;
  username: string;
  specialty: string;
  shift: 'MORNING' | 'AFTERNOON';
  isActive: boolean;
  schedules: DoctorScheduleDTO[];
}

interface DoctorScheduleDTO {
  id: string;
  dayOfWeek: number;    // 1=Lunes ... 5=Viernes
  startTime: string;    // "08:00"
  endTime: string;      // "08:30"
  slotDuration: number; // 30
}

// POST /api/admin/doctors
Request: {
  firstName: string,
  lastName: string,
  dni: string,
  email: string,
  phone: string,
  username: string,
  specialty: string,
  shift: 'MORNING' | 'AFTERNOON',
  password: string,
  schedules: { dayOfWeek: number, startTime: string, endTime: string }[]
}
Response: { success: true, data: { doctor: DoctorAdminDTO } }

// GET /api/admin/doctors/:id
Response: { success: true, data: { doctor: DoctorAdminDTO } }

// PUT /api/admin/doctors/:id
Request: {
  firstName?: string,
  lastName?: string,
  dni?: string,
  email?: string,
  phone?: string,
  username?: string,
  specialty?: string,
  shift?: 'MORNING' | 'AFTERNOON',
  password?: string,    // si viene vacío o undefined, no actualizar
  schedules?: { dayOfWeek: number, startTime: string, endTime: string }[]
}
Response: { success: true, data: { doctor: DoctorAdminDTO } }

// PATCH /api/admin/doctors/:id/status
Request: { isActive: boolean }
Response: { success: true, data: { doctor: { id: string, isActive: boolean } } }
```

---

## 9. Estructura de carpetas frontend — Admin

```
frontend/src/
├── app/
│   └── (admin)/
│       ├── layout.tsx                          # Layout con AdminHeader
│       ├── login/
│       │   └── page.tsx                        # Login del administrador
│       ├── dashboard/
│       │   └── page.tsx                        # Dashboard con métricas y tabla
│       └── doctors/
│           ├── new/
│           │   └── page.tsx                    # Formulario nuevo médico
│           └── [id]/
│               └── edit/
│                   └── page.tsx                # Formulario editar médico
│
├── components/
│   └── admin/
│       ├── AdminHeader.tsx                     # Header del portal admin
│       ├── AdminLoginForm.tsx                  # Formulario de login
│       │
│       ├── dashboard/
│       │   ├── MetricCards.tsx                 # Las 4 tarjetas KPI
│       │   ├── DoctorsTable.tsx                # Tabla con filtro, acciones
│       │   ├── DoctorTableRow.tsx              # Fila de la tabla + toggle + editar
│       │   └── DoctorFilterDropdown.tsx        # Dropdown de filtro
│       │
│       └── doctor-form/
│           ├── DoctorForm.tsx                  # Formulario completo (new + edit)
│           ├── DoctorFormLeft.tsx              # Panel izquierdo (datos)
│           ├── DoctorFormRight.tsx             # Panel derecho (horario)
│           ├── ScheduleGrid.tsx                # Grid interactivo de horario
│           └── DangerZone.tsx                  # Zona de peligro (solo en edición)
│
├── hooks/
│   ├── useAdminAuth.ts                         # Hook de auth del admin
│   ├── useDoctors.ts                           # Hook para listado y métricas
│   └── useDoctorForm.ts                        # Hook para form (create/edit)
│
├── lib/
│   └── api/
│       └── admin.api.ts                        # Clientes HTTP del admin
│
└── store/
    ├── useAdminAuthStore.ts                    # Estado: adminUser, token
    └── useDoctorFormStore.ts                   # Estado temporal del formulario
```

### useAdminAuthStore (Zustand)

```typescript
interface AdminAuthStore {
  admin: AdminUserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (admin: AdminUserDTO, token: string) => void;
  clearAuth: () => void;
}

interface AdminUserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN';
}
```

### useDoctorFormStore (Zustand — estado del formulario y horario)

```typescript
interface ScheduleCell {
  dayOfWeek: number;    // 1-5
  startTime: string;    // "08:00"
  endTime: string;      // "08:30"
}

interface DoctorFormStore {
  // Datos del formulario
  formData: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    username: string;
    specialty: string;
    shift: 'MORNING' | 'AFTERNOON' | null;
    password: string;
  };
  // Horario seleccionado en el grid
  selectedSchedule: ScheduleCell[];
  // Helpers
  toggleScheduleCell: (cell: ScheduleCell) => void;
  isCellSelected: (dayOfWeek: number, startTime: string) => boolean;
  reset: () => void;
}
```

---

## Notas de implementación para Claude Code

1. **JWT storage del admin:** Guardar en localStorage bajo `clinica_x_admin_token` (distinto al del médico y paciente). El interceptor de Axios para el admin usa este token.

2. **Carga de datos en edición:** Al cargar `/admin/doctors/:id/edit`, hacer `GET /api/admin/doctors/:id` y pre-poblar el formulario con los datos retornados, incluyendo marcar las celdas del grid de horario.

3. **Grid de horario — generación de slots:** Los slots se generan dinámicamente según el turno seleccionado:
   ```typescript
   const MORNING_SLOTS = generarSlots('08:00', '13:00', 30); // ["08:00", "08:30", ...]
   const AFTERNOON_SLOTS = generarSlots('14:00', '19:00', 30);
   
   const generarSlots = (start: string, end: string, duracion: number) => {
     // Retorna array de { startTime: "08:00", endTime: "08:30" }
   };
   ```

4. **Toggle de activar/desactivar en tabla:** Usar estado optimista (actualizar la UI antes de que responda el servidor, revertir si falla). Esto hace la interacción más ágil.

5. **Password en edición:** Enviar `password` al backend solo si el campo tiene contenido. Si está vacío o undefined, el backend no lo incluye en el `update`:
   ```typescript
   const payload = { ...formData };
   if (!payload.password) delete payload.password;
   ```

6. **Horario al guardar:** Enviar el array completo de celdas seleccionadas. El backend hace un `deleteMany` + `createMany` para los `DoctorSchedule` del médico (no actualización parcial).

7. **Protección de rutas:** El middleware de Next.js verifica:
   - Rutas `/admin/*` solo accesibles con JWT donde `role === 'ADMIN'`
   - Si hay JWT de médico o paciente intentando acceder → redirigir a su portal correspondiente

8. **Filtro del dropdown en dashboard:** Implementar client-side con el array completo ya cargado:
   ```typescript
   const doctoresFiltrados = useMemo(() => {
     if (filtro === 'activos') return doctores.filter(d => d.isActive);
     if (filtro === 'inactivos') return doctores.filter(d => !d.isActive);
     if (filtro) return doctores.filter(d => d.specialty === filtro);
     return doctores;
   }, [doctores, filtro]);
   ```
