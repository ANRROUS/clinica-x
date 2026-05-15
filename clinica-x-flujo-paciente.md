# Clínica X — Planificación de Flujo: ROL PACIENTE
**Versión:** 1.0.0 | **Fecha:** 2025 | **Para:** Claude Code

> Este documento cubre exclusivamente el flujo completo del **Paciente** en Clínica X.
> Los flujos de Médico y Administrador están en documentos separados.
> Complementar con: `Arquitectura Hexagonal + DDD — Guía de Implementación.md`

---

## Índice

1. [Rutas y páginas del Paciente](#1-rutas-y-páginas-del-paciente)
2. [Header — Estados autenticado y no autenticado](#2-header--estados-autenticado-y-no-autenticado)
3. [Landing Page (pública)](#3-landing-page-pública)
4. [Autenticación — Registro y Login](#4-autenticación--registro-y-login)
5. [Flujo de Reserva de Cita](#5-flujo-de-reserva-de-cita)
6. [Perfil del Paciente](#6-perfil-del-paciente)
7. [Estados y transiciones de UI](#7-estados-y-transiciones-de-ui)
8. [Contratos de API que consume el Paciente](#8-contratos-de-api-que-consume-el-paciente)
9. [Validaciones y reglas de negocio en frontend](#9-validaciones-y-reglas-de-negocio-en-frontend)
10. [Estructura de carpetas frontend — Paciente](#10-estructura-de-carpetas-frontend--paciente)

---

## 1. Rutas y páginas del Paciente

### Rutas públicas (sin autenticación requerida)

| Ruta | Componente/Page | Descripción |
|------|-----------------|-------------|
| `/` | `app/(public)/page.tsx` | Landing page principal |
| `/login` | `app/(public)/login/page.tsx` | Inicio de sesión |
| `/register` | `app/(public)/register/page.tsx` | Registro de paciente |
| `/reservar-cita` | `app/(public)/reservar-cita/page.tsx` | Flujo de reserva (requiere auth, redirige a login si no está autenticado) |

### Rutas privadas (requieren JWT de paciente)

| Ruta | Componente/Page | Descripción |
|------|-----------------|-------------|
| `/perfil` | `app/(patient)/perfil/page.tsx` | Perfil con tabs: Consultas / Tratamiento / Reservas |
| `/perfil/consultas` | Tab dentro de `/perfil` | Historial de consultas y diagnósticos |
| `/perfil/tratamiento` | Tab dentro de `/perfil` | Análisis a realizar y medicación actual |
| `/perfil/reservas` | Tab dentro de `/perfil` | Reservas confirmadas activas |

### Regla de redirección

```
Si el usuario NO está autenticado y navega a /reservar-cita → redirigir a /login
Después del login exitoso → redirigir a /reservar-cita (guardar returnUrl en sessionStorage)
Si el usuario está autenticado y navega a /login o /register → redirigir a /perfil
```

---

## 2. Header — Estados autenticado y no autenticado

### Estado NO autenticado

```
┌─────────────────────────────────────────────────────────────────────┐
│  Clínica X          [Inicio]  [Reservar Cita]      [Ingresar] [Registrarse] │
└─────────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Izquierda: Logo / nombre "Clínica X" — enlaza a `/`
- Centro: dos links de navegación
  - "Inicio" → ancla a sección hero de `/` o navega a `/`
  - "Reservar Cita" → navega a `/reservar-cita` (si no autenticado → primero a `/login`)
- Derecha: dos botones
  - "Ingresar" → variante outline/secundario → navega a `/login`
  - "Registrarse" → variante sólido/primario → navega a `/register`

### Estado AUTENTICADO (paciente logueado)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Clínica X    [Inicio]  [Reservar Cita]  [Mi Perfil]    [Avatar] Nombre  [Cerrar sesión] │
└─────────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Izquierda: Logo / nombre "Clínica X" — enlaza a `/`
- Centro: tres links de navegación
  - "Inicio" → `/`
  - "Reservar Cita" → `/reservar-cita`
  - "Mi Perfil" → `/perfil`
- Derecha: grupo de usuario
  - Avatar circular (iniciales del nombre si no hay foto, fondo color primario)
  - Nombre del paciente (firstName + primera letra de lastName)
  - Botón "Cerrar sesión" → ejecuta logout (limpia JWT de localStorage/cookie) → redirige a `/`

**Componente:** `components/shared/Header.tsx`
- Usa Zustand store `useAuthStore` para leer estado de autenticación
- Renderiza condicionalmente según `isAuthenticated` y `user.role === 'PATIENT'`

---

## 3. Landing Page (pública)

### Sección 1: Hero

**Layout:** dos columnas (50/50 en desktop, columna única en mobile con imagen arriba)

**Columna izquierda:**
- Título H1: copy de la clínica (ej. "Tu salud, nuestra prioridad")
- Párrafo descriptivo breve (2-3 líneas)
- Dos botones en fila:
  - Botón primario: "Reserva tu cita" → navega a `/reservar-cita`
  - Botón outline/link: "¿Por qué elegirnos?" → scroll suave a `#por-que-elegirnos`

**Columna derecha:**
- Imagen ilustrativa (médico/salud) — puede ser SVG placeholder o imagen estática en `/public`

### Sección 2: ¿Por qué elegirnos? (`id="por-que-elegirnos"`)

**Layout:** dos columnas (imagen izquierda, contenido derecha) — en mobile, imagen oculta o debajo

**Columna izquierda:** imagen decorativa

**Columna derecha:**
- Título H2
- Párrafo introductorio
- Lista de razones (icono + texto), mínimo 3-4 ítems, ejemplos:
  - ✓ Médicos certificados y con experiencia
  - ✓ Agendamiento digital 24/7
  - ✓ Historial clínico digitalizado
  - ✓ Atención personalizada

### Sección 3: Contacto y Ubicación

**Layout:** dos columnas (mapa izquierda, formulario derecha) — en mobile, formulario arriba, mapa abajo

**Columna izquierda:** mapa embebido (Google Maps iframe o componente de mapa) — mostrar ubicación de la clínica

**Columna derecha — Formulario de contacto:**
- Campo: Nombre (text, requerido)
- Campo: Apellido (text, requerido)
- Campo: Email (email, requerido, validación formato)
- Campo: Número de celular (tel, requerido, validación numérica, mínimo 9 dígitos)
- Botón: "Enviar mensaje" (primario)
- Este formulario es de contacto estático — puede ser un `mailto:` o un endpoint simple; **no** afecta la BD del sistema

### Footer

- Footer simple, una sola fila o dos
- Contenido mínimo: nombre de la clínica, año, derechos reservados
- Opcional: links rápidos (Inicio, Reservar Cita, Contacto)

---

## 4. Autenticación — Registro y Login

### Página de Registro (`/register`)

**Campos del formulario (en orden):**
1. DNI — input numérico, 8 dígitos exactos (validación Zod)
2. Correo electrónico — input email, validación formato
3. Contraseña — input password, mínimo 8 caracteres
4. Confirmar contraseña — input password, debe coincidir con contraseña

**Validaciones (Zod + React Hook Form):**
```typescript
const registerSchema = z.object({
  dni: z.string().length(8, "El DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});
```

**Flujo post-registro:**
1. Llamar `POST /api/auth/register` con `{ dni, email, password, firstName?, lastName? }`
2. En éxito: guardar JWT en localStorage → redirigir a `/perfil` o a `returnUrl`
3. En error (email duplicado, DNI duplicado): mostrar mensaje de error inline bajo el campo

**Nota sobre Supabase:** Si se usa Supabase Auth para verificación de email, mostrar pantalla intermedia "Revisa tu correo para confirmar tu cuenta". Definir en decisión de arquitectura (ver documento maestro, sección 20).

**Link en footer del form:** "¿Ya tienes cuenta? Ingresar" → `/login`

---

### Página de Login (`/login`)

**Campos del formulario:**
1. DNI — input numérico, 8 dígitos
2. Correo electrónico — input email
3. Contraseña — input password

> **Nota:** Login requiere DNI + Email + Password (triple factor de identificación). No solo email+password.

**Validaciones:**
```typescript
const loginSchema = z.object({
  dni: z.string().length(8).regex(/^\d+$/),
  email: z.string().email(),
  password: z.string().min(1, "La contraseña es requerida")
});
```

**Elementos adicionales:**
- Link "¿Olvidaste tu contraseña?" → flujo de recuperación (puede ser pantalla simple con campo email → envía email de reset vía Supabase Auth o endpoint propio)
- Link en footer del form: "¿No tienes cuenta? Regístrate" → `/register`

**Flujo post-login:**
1. Llamar `POST /api/auth/login` con `{ dni, email, password }`
2. En éxito: guardar JWT → redirigir a `returnUrl` (si existe en sessionStorage) o a `/perfil`
3. En error: mostrar "Credenciales inválidas" debajo del formulario (no especificar cuál campo está mal)

---

## 5. Flujo de Reserva de Cita

**Ruta:** `/reservar-cita`
**Requiere autenticación:** Sí — redirige a `/login?returnUrl=/reservar-cita` si no está autenticado

### Layout de la página de reserva

```
┌──────────────────────┬────────────────────────────────────────────────┐
│  PANEL IZQUIERDO     │  PANEL DERECHO (contenido dinámico)            │
│  Especialidades      │                                                │
│  (sidebar fijo)      │  Paso 1: Selección de especialista y horario   │
│                      │  Paso 2: Confirmación (modal)                  │
│                      │  Automático: va directo al modal               │
└──────────────────────┴────────────────────────────────────────────────┘
```

### Panel Izquierdo — Lista de Especialidades

- Input de búsqueda con icono lupa: placeholder "Ej. Medicina General"
- Lista de especialidades disponibles (vienen de `GET /api/appointments/availability?...`)
- Al hacer clic en una especialidad → se activa (color primario, fondo destacado) y carga su contenido en el panel derecho
- La especialidad activa queda marcada visualmente

**Especialidades a mostrar** (definidas en constante del sistema, se validan contra las disponibles):
- Medicina General
- Cardiología
- Traumatología
- Dermatología
- Pediatría
- (etc., según configuración de la clínica)

### Panel Derecho — Paso 1: Selección Manual

**Header del panel:**
- Título H2: nombre de la especialidad seleccionada (ej. "MEDICINA GENERAL")
- Botón en la esquina superior derecha: "Automático ✦" — activa el modo automático

#### Subsección: Elige al especialista

- Grid de cards de médicos (2 columnas en desktop, 1 en mobile)
- Cada card de médico contiene:
  - Avatar circular del médico (iniciales si no hay foto)
  - Nombre completo (ej. "Dra. Beatriz Adame Avila")
- Al seleccionar un médico → card se resalta con borde y fondo del color primario
- Solo se muestran médicos activos con esa especialidad
- Datos vienen de `GET /api/appointments/availability/specialty/:specialty`

#### Subsección: Elige el Día

- Solo aparece después de seleccionar un médico
- Muestra los próximos días disponibles (con turnos libres) en formato chips/pills:
  - Cada chip muestra: nombre del día abreviado + número (ej. "Lunes / 10", "Miércoles / 12")
  - Chips deshabilitados = días sin disponibilidad (color gris, no clickeables)
  - Chip seleccionado = color primario relleno
- **Regla de negocio:** solo mostrar slots con > 4 horas de diferencia a `Date.now()` del servidor

#### Subsección: Elige la Hora

- Solo aparece después de seleccionar un día
- Grid de chips de horarios disponibles (ej. "09:00 - 09:30")
- Chips deshabilitados = ya ocupados o dentro de las 4 horas prohibidas
- Chip seleccionado = color primario relleno
- Máximo 2 filas visibles (4 por fila en desktop), scroll si hay más

#### Botón final

- "Confirmar Reserva" — botón primario, alineado a la derecha
- Habilitado solo cuando: médico + día + hora están seleccionados
- Al hacer clic → abre modal de confirmación (ver abajo)

---

### Modal de Confirmación de Reserva

**Trigger:** clic en "Confirmar Reserva" (manual) o "Automático" (salta a este paso directamente con datos del sistema)

**Contenido del modal:**

```
┌──────────────────────────────────────────────────────────┐
│  CONFIRMAR RESERVA                          [X]   [imagen médico] │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Especialidad: Traumatología                       │   │
│  │ Especialista: Dra. Anghelina Alva Encinas        │   │
│  │ Fecha y turno: 24 de Abril (8:20am - 8:40am)    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Al hacer clic en Aceptar, confirmas tu reserva.        │
│  Ten en cuenta que solo podrás reprogramar o cancelar   │
│  hasta un máximo de una hora antes de la cita.          │
│                                                          │
│  ⚠ Atención: Si reservas una cita que falta menos de    │
│  una hora para realizarse, no podrás reprogramarla ni   │
│  cancelarla, de acuerdo a los términos y condiciones.   │
│                                                          │
│            [Aceptar]          [Cancelar]                 │
└──────────────────────────────────────────────────────────┘
```

**Especificaciones del modal:**
- La imagen del médico en la esquina superior derecha del modal puede ser un avatar genérico o la foto del médico
- El bloque de resumen (especialidad, especialista, fecha) tiene fondo color primario suave (teal/verde clínica)
- El mensaje de advertencia (⚠) tiene fondo amarillo/gris claro, ícono de alerta, texto en tamaño pequeño
- "términos y condiciones" es un enlace subrayado
- Botón "Aceptar" = primario (azul oscuro según diseño)
- Botón "Cancelar" = secundario (gris)

**Flujo al hacer clic en Aceptar:**
1. Llamar `POST /api/appointments/book/manual` (o `book/automatic` si fue modo automático)
2. Mostrar loading spinner en el botón
3. En éxito:
   - Cerrar modal
   - Mostrar toast/banner "¡Reserva confirmada!" con código de voucher
   - Redirigir a `/perfil/reservas` después de 2 segundos
4. En error:
   - Mostrar mensaje de error dentro del modal ("El horario ya no está disponible, elige otro")
   - El modal permanece abierto, no redirige

### Modo Automático

**Trigger:** clic en botón "Automático ✦" en el panel derecho

**Flujo:**
1. El sistema hace `POST /api/appointments/book/automatic` con `{ specialty: "especialidad_activa", patientId }`
2. Mientras espera: mostrar un loader/spinner con texto "Buscando el turno más próximo..."
3. El backend responde con el slot asignado (médico + fecha + hora)
4. Abrir directamente el modal de confirmación pre-cargado con esos datos
5. El paciente solo puede Aceptar o Cancelar (no puede modificar el slot en modo automático)
6. Si no hay slots disponibles: mostrar mensaje "No hay turnos disponibles para esta especialidad en los próximos días. Intenta la reserva manual."

---

## 6. Perfil del Paciente

**Ruta:** `/perfil`
**Requiere autenticación:** Sí (role: PATIENT)

### Header de perfil (componente fijo en la parte superior)

```
┌───────────────────────────────────────────────────────────────────┐
│  [A]  Andrés Arthuro Pineda Paredes          ✏ Correo electrónico: anrrous@gmail.com │
│       DNI: 71132902                          ✏ Teléfono: 903154571                  │
└───────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Avatar circular grande con letra inicial (color primario, fondo)
- Nombre completo en negrita
- Badge DNI: pastilla redondeada con fondo morado/primary oscuro, texto blanco
- Lado derecho: email y teléfono con ícono de lápiz (✏) que permite edición inline
- Al hacer clic en el ícono de lápiz: el campo pasa a ser un input editable, aparece botón "Guardar"
- Guardar llama `PUT /api/auth/me` con los campos modificados

### Tabs de navegación

```
  [Consultas]    [Tratamiento]    [Reservas]
```

- Tab activo: borde inferior color primario, texto color primario
- Tab inactivo: texto gris, sin borde
- La URL no cambia al cambiar tab (o se puede usar hash: `/perfil#consultas`)

---

### Tab 1: Consultas

**Layout:** dos columnas

**Columna izquierda — Historial de consultas:**
- Título: "Historial de consultas del paciente:"
- Input de fecha (dos campos: desde / hasta) con ícono de búsqueda para filtrar
- Lista de cards de consultas anteriores:
  ```
  ┌──────────────────────────────┐
  │ Dra. Anghelina Alva          │
  │ Fecha: 05 de enero del 2026  │
  │ Especialidad: Medicina General│
  └──────────────────────────────┘
  ```
  - Card activa/seleccionada: borde color primario, fondo suave
  - Al hacer clic en una card → carga el detalle en la columna derecha

**Columna derecha — Detalle de la consulta seleccionada:**

#### Sección: Tu Diagnóstico
- Título "Tu Diagnóstico"
- Subtítulo: "Este es el diagnóstico que el doctor te recetó"
- Área de texto de solo lectura (textarea disabled) con el texto del diagnóstico
- Placeholder si vacío: "El paciente presentó ..."
- Estilo: borde suave, fondo ligeramente gris, sin cursor de edición

#### Sección: Tu Análisis Clínico
- Título "Tu Análisis Clínico"
- Subtítulo: "En caso tu paciente requiera análisis, ingresa cuales tiene que realizarse"
- Lista de chips/badges por cada orden de análisis (ej. "Hemograma completo ×", "Examen de orina ×")
  - El ícono × no elimina (es solo visual, el paciente no puede editar)
  - Cada chip es clickeable → abre el resultado del análisis si está subido (PDF/imagen en modal o nueva pestaña)
  - Si no hay resultado subido: el chip simplemente muestra la orden, no abre nada

#### Visualización de PDF de análisis

Cuando el paciente hace clic en un análisis que ya tiene resultado subido:
- Se abre un modal (o panel lateral) con:
  - Header: nombre del análisis + botón "Descargar PDF" (→ descarga el archivo de S3)
  - Cuerpo: render del PDF inline (usando `<iframe>` o librería de PDF viewer)
  - El diseño del PDF mostrado en la imagen adjunta es el de la Clínica Alemana como ejemplo de referencia del resultado real que sube el paciente

**Datos vienen de:** `GET /api/medical/patient/history` y `GET /api/medical/patient/consultation/:id`

---

### Tab 2: Tratamiento

**Layout:** columna única

#### Subsección: Análisis a realizar

```
Análisis a realizar:
El doctor en tu última consulta te ha asignado realizarte los siguientes análisis,
puedes reservar o subirlo en PDF
```

- Grid de 2 columnas con cards por cada análisis ordenado:
  ```
  ┌──────────────────────────┐  ┌──────────────────────────┐
  │   Hemograma completo     │  │   Examen de orina        │
  │  [Reservar]  [Subir ↑]  │  │  [Reservar]  [Subir ↑]  │
  └──────────────────────────┘  └──────────────────────────┘
  ```
  - Botón "Reservar" (primario outline) → inicia flujo de reserva con especialidad pre-cargada desde la orden de análisis → navega a `/reservar-cita` con estado pre-cargado
  - Botón "Subir ↑" (primario outline) → abre file picker, acepta PDF/JPG/PNG, máx 10MB → llama `POST /api/medical/patient/analysis-results` (multipart)
  - Después de subir: mostrar toast "Análisis subido correctamente" y actualizar el card

#### Subsección: Medicación actual

```
Medicación actual:
El doctor en tu última consulta te ha asignado la siguiente medicación:
```

- Tabla con columnas:
  | Nombre | Nº Días | Hora |
  |--------|---------|------|
  | Paracetamol | 5 | 8hrs. |
  | Paracetamol | 10 | 12hrs. |
  | Paracetamol | 7 | 8hrs. |

- Tabla de solo lectura (no editable por el paciente)
- Colores de cabecera: fondo color primario (teal), texto blanco
- Filas alternadas o separadas por línea divisoria sutil

**Datos vienen de:** `GET /api/medical/patient/history` (última consulta finalizada con prescriptions y analysisOrders)

---

### Tab 3: Reservas

**Layout:** columna única

```
Reservas Confirmadas
Aqui podrás ver todas tus reservas que se encuentran activas
```

- Grid de 2 columnas (1 en mobile) con cards de reservas:
  ```
  ┌───────────────────────────────┐  ┌───────────────────────────────┐
  │  Medicina General             │  │  Medicina General             │
  │  Dra. Anghelina Alva          │  │  Dra. Anghelina Alva          │
  │  Fecha: Sábado, 24 de Mayo... │  │  Fecha: Sábado, 24 de Mayo... │
  │                               │  │                               │
  │  [Reprogramar]  [Cancelar]    │  │  [Reprogramar]  [Cancelar]    │
  └───────────────────────────────┘  └───────────────────────────────┘
  ```

**Especificaciones de cada card:**
- Especialidad en negrita (H3 o similar)
- Nombre del médico
- Fecha en formato: "Sábado, 24 de Mayo, 2026" + hora del turno
- Botón "Reprogramar" (primario, verde/teal)
- Botón "Cancelar" (secundario, gris)

**Flujo Reprogramar:**
1. Abre un modal con el mismo selector de fecha/hora del flujo de reserva
2. Preselecciona el mismo médico y especialidad
3. Paciente elige nueva fecha y hora
4. Confirma → llama `PUT /api/appointments/patient/:appointmentId`
5. Si la cita es en menos de 1 hora: mostrar mensaje de error "No puedes reprogramar esta cita" (regla de negocio)

**Flujo Cancelar:**
1. Mostrar modal de confirmación: "¿Seguro que quieres cancelar esta cita con [médico] el [fecha]?"
2. Botones: [Sí, cancelar] / [No, volver]
3. Si confirma → llama `DELETE /api/appointments/patient/:appointmentId`
4. Si la cita es en menos de 1 hora: mostrar mensaje de error "No puedes cancelar esta cita"
5. En éxito: remover la card de la lista con animación suave

**Datos vienen de:** `GET /api/appointments/patient/me`

---

## 7. Estados y transiciones de UI

### Estado de carga

- Usar skeleton loaders (no spinners genéricos) para:
  - Lista de médicos en el panel de reserva
  - Cards de consultas en el historial
  - Cards de reservas en el perfil
- Usar spinner solo para acciones puntuales (confirmar reserva, subir archivo)

### Estado vacío (empty states)

| Contexto | Mensaje |
|----------|---------|
| Sin consultas en historial | "Aún no tienes consultas registradas" |
| Sin reservas activas | "No tienes reservas activas. ¡Agenda tu primera cita!" + botón "Reservar cita" |
| Sin análisis pendientes | "No tienes análisis pendientes" |
| Sin medicación | "No tienes medicación asignada actualmente" |
| Sin slots disponibles | "No hay turnos disponibles para esta especialidad. Intenta con otra fecha o especialidad." |

### Toast/notificaciones

Usar una librería de toasts (ej. `react-hot-toast` o `sonner`):

| Evento | Tipo | Mensaje |
|--------|------|---------|
| Reserva confirmada | ✅ Success | "¡Tu cita ha sido confirmada! Código: [voucher_code]" |
| Reserva cancelada | ✅ Success | "Cita cancelada correctamente" |
| Error al reservar | ❌ Error | "No se pudo confirmar la reserva. Intenta nuevamente." |
| Análisis subido | ✅ Success | "Análisis subido correctamente" |
| Error al subir | ❌ Error | "Error al subir el archivo. Máximo 10MB, formatos: PDF, JPG, PNG" |
| Perfil actualizado | ✅ Success | "Información actualizada correctamente" |

---

## 8. Contratos de API que consume el Paciente

### Auth Service (`/api/auth`)

```typescript
// POST /api/auth/register
Request: { dni: string, email: string, password: string, firstName?: string, lastName?: string }
Response: { success: true, data: { token: string, user: UserDTO } }

// POST /api/auth/login
Request: { dni: string, email: string, password: string }
Response: { success: true, data: { token: string, user: UserDTO } }

// GET /api/auth/me (requiere JWT en header Authorization: Bearer <token>)
Response: { success: true, data: UserDTO }

// PUT /api/auth/me
Request: { email?: string, phone?: string, firstName?: string, lastName?: string }
Response: { success: true, data: UserDTO }
```

### Appointment Service (`/api/appointments`)

```typescript
// GET /api/appointments/availability?specialty=MedicinaGeneral
Response: { success: true, data: { doctors: DoctorAvailabilityDTO[] } }

// GET /api/appointments/availability/doctor/:doctorId?date=2025-01-10
Response: { success: true, data: { slots: TimeSlotDTO[] } }

// POST /api/appointments/book/manual
Request: { doctorId: string, scheduledAt: string (ISO), specialty: string }
Response: { success: true, data: { appointment: AppointmentDTO, voucher: VoucherDTO } }

// POST /api/appointments/book/automatic
Request: { specialty: string }
Response: { success: true, data: { appointment: AppointmentDTO, voucher: VoucherDTO } }

// POST /api/appointments/book/from-order
Request: { analysisOrderId: string, specialty: string }
Response: { success: true, data: { redirectTo: '/reservar-cita', prefill: { specialty, doctorId? } } }

// GET /api/appointments/patient/me
Response: { success: true, data: { appointments: AppointmentDTO[] } }

// PUT /api/appointments/patient/:appointmentId
Request: { scheduledAt: string }
Response: { success: true, data: { appointment: AppointmentDTO } }

// DELETE /api/appointments/patient/:appointmentId
Response: { success: true, data: { message: "Cita cancelada" } }
```

### Medical Records Service (`/api/medical`)

```typescript
// GET /api/medical/patient/history
Response: { success: true, data: { consultations: ConsultationSummaryDTO[] } }

// GET /api/medical/patient/consultation/:id
Response: { success: true, data: { consultation: ConsultationDetailDTO } }
// ConsultationDetailDTO incluye: diagnosis, prescriptions (con medications), analysisOrders, analysisResults

// POST /api/medical/patient/analysis-results (multipart/form-data)
Request: FormData { file: File, consultationId?: string, analysisOrderId?: string }
Response: { success: true, data: { result: AnalysisResultDTO } }
```

### DTOs relevantes para el frontend

```typescript
interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

interface DoctorAvailabilityDTO {
  doctorId: string;
  name: string;
  specialty: string;
  availableDays: { date: string; slots: TimeSlotDTO[] }[];
}

interface TimeSlotDTO {
  id: string;
  startTime: string; // ISO datetime
  endTime: string;
  isAvailable: boolean;
}

interface AppointmentDTO {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  scheduledAt: string; // ISO
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS';
  type: 'MANUAL' | 'AUTOMATIC';
  voucher?: { code: string };
}

interface ConsultationSummaryDTO {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: 'ACTIVE' | 'FINALIZED';
}

interface ConsultationDetailDTO {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosis?: { description: string; icdCode?: string };
  prescriptions: PrescriptionDTO[];
  analysisOrders: AnalysisOrderDTO[];
  analysisResults: AnalysisResultDTO[];
}

interface AnalysisOrderDTO {
  id: string;
  examName: string;
  specialty?: string;
  result?: AnalysisResultDTO;
}

interface AnalysisResultDTO {
  id: string;
  fileName: string;
  s3Url: string;
  fileType: string;
  uploadedAt: string;
}
```

---

## 9. Validaciones y reglas de negocio en frontend

### Reglas de slots (deben replicarse en frontend para UX, la fuente de verdad es el backend)

```typescript
// Un slot está disponible si:
// 1. No tiene cita confirmada
// 2. La hora del slot - Date.now() > 4 horas
const isSlotAvailable = (slot: TimeSlotDTO) => {
  const slotTime = new Date(slot.startTime).getTime();
  const now = Date.now();
  const fourHoursMs = 4 * 60 * 60 * 1000;
  return slot.isAvailable && (slotTime - now) > fourHoursMs;
};
```

### Regla de cancelación/reprogramación

```typescript
// El paciente puede cancelar/reprogramar si faltan más de 1 hora para la cita
const canModifyAppointment = (appointment: AppointmentDTO) => {
  const appointmentTime = new Date(appointment.scheduledAt).getTime();
  const now = Date.now();
  const oneHourMs = 60 * 60 * 1000;
  return (appointmentTime - now) > oneHourMs;
};
```

### Validación de archivos

```typescript
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) return "Formato no permitido. Solo PDF, JPG o PNG.";
  if (file.size > MAX_SIZE_BYTES) return "El archivo supera los 10MB.";
  return null;
};
```

---

## 10. Estructura de carpetas frontend — Paciente

Solo las rutas y componentes específicos del paciente:

```
frontend/src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                          # Landing page
│   │   ├── login/
│   │   │   └── page.tsx                      # Página de login
│   │   └── register/
│   │       └── page.tsx                      # Página de registro
│   └── (patient)/
│       ├── layout.tsx                        # Layout con header autenticado
│       ├── reservar-cita/
│       │   └── page.tsx                      # Flujo de reserva completo
│       └── perfil/
│           └── page.tsx                      # Perfil con tabs
│
├── components/
│   ├── shared/
│   │   ├── Header.tsx                        # Header (ambos estados)
│   │   └── Footer.tsx                        # Footer simple
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── WhyUsSection.tsx
│   │   └── ContactSection.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── booking/
│   │   ├── SpecialtySidebar.tsx              # Panel izquierdo de especialidades
│   │   ├── DoctorSelector.tsx                # Grid de médicos
│   │   ├── DaySelector.tsx                   # Chips de días
│   │   ├── SlotSelector.tsx                  # Chips de horarios
│   │   └── ConfirmBookingModal.tsx           # Modal de confirmación
│   └── patient-profile/
│       ├── ProfileHeader.tsx                 # Header con avatar y datos editables
│       ├── ProfileTabs.tsx                   # Tabs (Consultas/Tratamiento/Reservas)
│       ├── ConsultationsTab.tsx              # Tab consultas
│       ├── TreatmentTab.tsx                  # Tab tratamiento
│       ├── AppointmentsTab.tsx               # Tab reservas
│       ├── ConsultationDetail.tsx            # Detalle de consulta (columna derecha)
│       ├── AnalysisUploader.tsx              # Componente de subida de archivo
│       └── PDFViewer.tsx                     # Modal de visualización de PDF
│
├── hooks/
│   ├── useAuth.ts                            # Hook de autenticación
│   ├── useAvailability.ts                    # Hook para slots disponibles
│   ├── usePatientHistory.ts                  # Hook para historial
│   └── useAppointments.ts                    # Hook para reservas
│
├── lib/
│   └── api/
│       ├── auth.api.ts                       # Clientes HTTP del auth service
│       ├── appointments.api.ts               # Clientes HTTP del appointment service
│       └── medical.api.ts                    # Clientes HTTP del medical records service
│
└── store/
    ├── useAuthStore.ts                       # Estado global: user, token, isAuthenticated
    └── useBookingStore.ts                    # Estado temporal del flujo de reserva
```

### useAuthStore (Zustand)

```typescript
interface AuthStore {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserDTO, token: string) => void;
  clearAuth: () => void;
}
```

### useBookingStore (Zustand — temporal, se limpia al completar la reserva)

```typescript
interface BookingStore {
  selectedSpecialty: string | null;
  selectedDoctor: DoctorAvailabilityDTO | null;
  selectedDate: string | null;
  selectedSlot: TimeSlotDTO | null;
  bookingMode: 'manual' | 'automatic';
  prefillFromOrder: { specialty: string; analysisOrderId: string } | null;
  setSpecialty: (s: string) => void;
  setDoctor: (d: DoctorAvailabilityDTO) => void;
  setDate: (d: string) => void;
  setSlot: (s: TimeSlotDTO) => void;
  setMode: (m: 'manual' | 'automatic') => void;
  setPrefill: (p: { specialty: string; analysisOrderId: string }) => void;
  reset: () => void;
}
```

---

## Notas de implementación para Claude Code

1. **JWT storage:** Guardar en `localStorage` bajo la key `clinica_x_token`. En cada request agregar el header `Authorization: Bearer <token>`.

2. **Interceptor de Axios:** Configurar un interceptor que en caso de 401 limpie el store y redirija a `/login`.

3. **React Query:** Usar para todas las llamadas al servidor. Keys sugeridas:
   - `['availability', specialty]`
   - `['doctor-slots', doctorId, date]`
   - `['patient-history']`
   - `['patient-appointments']`
   - `['consultation', consultationId]`

4. **Prefill de reserva desde orden:** Cuando el paciente hace clic en "Reservar" desde el tab Tratamiento, guardar en `useBookingStore` el `prefillFromOrder` y navegar a `/reservar-cita`. Al cargar esa página, si hay prefill, pre-seleccionar la especialidad automáticamente.

5. **Paleta de colores de la UI** (basada en los wireframes compartidos):
   - Primary/Brand: Teal `#1D9E75` o similar
   - Primary dark: `#0F6E56`
   - Botones secundarios/cancelar: Gris `#6B7280`
   - Badges DNI: Morado/índigo
   - Fondo de resumen de reserva en modal: Teal claro

6. **Mobile-first:** Todas las páginas del paciente deben diseñarse mobile-first. Los grids de médicos y horarios colapsan a 1 columna en móvil.
