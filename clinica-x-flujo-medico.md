# Clínica X — Planificación de Flujo: ROL MÉDICO
**Versión:** 1.0.0 | **Fecha:** 2025 | **Para:** Claude Code

> Este documento cubre exclusivamente el flujo completo del **Médico** en Clínica X.
> Los flujos de Paciente y Administrador están en documentos separados.
> Complementar con: `Arquitectura Hexagonal + DDD — Guía de Implementación.md`

---

## Índice

1. [Rutas y páginas del Médico](#1-rutas-y-páginas-del-médico)
2. [Autenticación del Médico](#2-autenticación-del-médico)
3. [Header del Portal Médico](#3-header-del-portal-médico)
4. [Módulo Calendario](#4-módulo-calendario)
5. [Módulo Pacientes](#5-módulo-pacientes)
6. [Vista de Paciente — Consulta Actual](#6-vista-de-paciente--consulta-actual)
7. [Vista de Paciente — Historial](#7-vista-de-paciente--historial)
8. [Estados y transiciones de UI](#8-estados-y-transiciones-de-ui)
9. [Contratos de API que consume el Médico](#9-contratos-de-api-que-consume-el-médico)
10. [Estructura de carpetas frontend — Médico](#10-estructura-de-carpetas-frontend--médico)

---

## 1. Rutas y páginas del Médico

### Rutas privadas (requieren JWT con role: DOCTOR)

| Ruta | Componente/Page | Descripción |
|------|-----------------|-------------|
| `/doctor/login` | `app/(doctor)/login/page.tsx` | Login exclusivo del médico |
| `/doctor/calendario` | `app/(doctor)/calendario/page.tsx` | Vista de calendario con citas |
| `/doctor/pacientes` | `app/(doctor)/pacientes/page.tsx` | Vista de pacientes con panel lateral |
| `/doctor/pacientes/:patientId` | `app/(doctor)/pacientes/[patientId]/page.tsx` | Perfil de paciente específico |

### Reglas de redirección

```
Si el médico NO está autenticado y accede a /doctor/* → redirigir a /doctor/login
Si el médico YA está autenticado y accede a /doctor/login → redirigir a /doctor/calendario
El médico NO puede acceder a rutas del paciente (/reservar-cita, /perfil, etc.)
```

### Layout del portal médico

- `app/(doctor)/layout.tsx` — layout con header del médico
- El layout envuelve todas las rutas `/doctor/*` excepto `/doctor/login`
- No comparte layout con las rutas del paciente

---

## 2. Autenticación del Médico

### Página de Login (`/doctor/login`)

El médico **no puede registrarse** desde la plataforma. Su cuenta es creada por el Administrador.
El médico **no puede restablecer contraseña** desde la plataforma. Si la olvida, el Administrador la resetea.

**Campos del formulario:**
1. Usuario — input text (puede ser el email o un username asignado por admin)
2. Contraseña — input password

**Sin elementos adicionales:** no hay link de "¿Olvidaste tu contraseña?", no hay link de registro.

**Validaciones:**
```typescript
const doctorLoginSchema = z.object({
  email: z.string().email("Usuario inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});
```

**Flujo post-login:**
1. Llamar `POST /api/auth/login` con `{ email, password }`
2. Verificar en la respuesta que `user.role === 'DOCTOR'`
3. Si role no es DOCTOR: mostrar "Credenciales inválidas" (no revelar que existe el usuario)
4. En éxito: guardar JWT en localStorage bajo `clinica_x_doctor_token` → redirigir a `/doctor/calendario`
5. En error: mostrar "Usuario o contraseña incorrectos" (mensaje genérico, sin especificar cuál campo)

**Diseño de la página de login del médico:**
- Página centrada, fondo neutro
- Card con logo "Portal Médico" + ícono médico
- Formulario minimalista (solo los dos campos + botón)
- Sin opciones adicionales

---

## 3. Header del Portal Médico

```
┌─────────────────────────────────────────────────────────────────────┐
│  Portal Médico 🩺     [Calendario]    [Pacientes]    Dra. Alva  [A]  │
│                                                      Cerrar sesión   │
└─────────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Izquierda: "Portal Médico" con ícono de estetoscopio (logo diferenciado del portal paciente)
- Centro: exactamente dos links de navegación
  - "Calendario" → `/doctor/calendario`
  - "Pacientes" → `/doctor/pacientes`
  - El link activo tiene subrayado o color primario
- Derecha: información del médico autenticado
  - Nombre abreviado del médico (ej. "Dra. Alva")
  - Avatar circular con iniciales (fondo color primario)
  - "Cerrar sesión" como texto clickeable debajo del nombre → limpia token → redirige a `/doctor/login`

**Componente:** `components/doctor/DoctorHeader.tsx`
- Lee `useDoctorAuthStore` para nombre y avatar

---

## 4. Módulo Calendario

**Ruta:** `/doctor/calendario`

### Layout general

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Mensual]  [Semanal]  [Diario]          Abril, 2026     ◄  ►       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Vista de calendario según modo seleccionado]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Tres toggles/tabs de vista: Mensual | Semanal | Diario
- Navegación de fechas: flechas ◄ ► a los costados del mes/semana/día actual
- El tab activo (ej. Semanal) tiene fondo color primario, los inactivos son outline

---

### Vista Semanal (default al cargar)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│   Hora   │  Lunes   │  Martes  │ Miércoles│  Jueves  │ Viernes  │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 08:00-08:30 │ [cita] │ [cita]  │          │          │          │
│ 08:30-09:00 │        │         │ [cita]   │          │          │
│ 09:00-09:30 │ [cita] │         │          │ [cita]   │          │
│ ...      │          │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Especificaciones:**
- Columna izquierda fija: bloques de hora (ej. "08:00 - 08:30") con fondo teal/primario, texto blanco
- Columnas de días: Lunes a Viernes (o según el horario configurado del médico)
- Encabezados de día: fondo teal/primario, texto blanco ("Lunes", "Martes", etc.)
- El rango de fechas se muestra en el header: ej. "07 - 14" con las flechas ◄ ►
- Celdas con cita: bloque de color (azul claro o teal suave) que muestra el nombre del paciente
- Celdas sin cita: fondo gris muy claro o blanco
- Al hacer clic en una celda con cita → navega a `/doctor/pacientes/:patientId`
- Celdas vacías no son clickeables (el médico no agenda citas desde el calendario)

**Datos:** `GET /api/appointments/doctor/calendar?from=2025-04-07&to=2025-04-14`

---

### Vista Mensual

```
┌────┬────┬────┬────┬────┬────┬────┐
│MON │TUE │WED │THUR│FRI │SAT │SUN │
├────┼────┼────┼────┼────┼────┼────┤
│ 29 │ 30 │ 31 │  1 │  2 │  3 │  4 │
│    │    │    │Cita│    │Cita│Cita│
├────┼────┼────┼────┼────┼────┼────┤
│  6 │  7 │  8 │  9 │ 10 │ 11 │ 12 │
│    │Cita│    │Cita│    │Cita│Cita│
│    │    │    │Cita│    │    │    │
└────┴────┴────┴────┴────┴────┴────┘
```

**Especificaciones:**
- Grid mensual clásico (7 columnas, filas de semanas)
- Encabezados de columna: MON, TUE, WED, THUR, FRI, SAT, SUN
- Número de día en la esquina superior de cada celda
- Días del mes anterior/siguiente: visibles pero con color más tenue
- Citas dentro de cada día: mostradas como chips/etiquetas pequeñas con:
  - Nombre del paciente (truncado si es largo)
  - Color del chip: según el tipo o estado de la cita (usar colores del diseño: azul/teal/naranja)
  - En los wireframes se ven etiquetas como "Quotes", "Giveaway", "Reel" — en Clínica X serán el nombre del paciente o el tipo de consulta
- Al hacer clic en un chip → navega al paciente
- Al hacer clic en un día vacío → cambia a vista Diario de ese día

**Datos:** `GET /api/appointments/doctor/calendar?month=2025-04`

---

### Vista Diaria

```
┌───────────────────────────────────────────────────────┐
│  Miércoles, 9 de Abril              ◄  ►              │
├───────────────────────────────────────────────────────┤
│  08:00 - 08:30  │  Andrés Pineda — Medicina General   │
│  08:30 - 09:00  │  (vacío)                            │
│  09:00 - 09:30  │  Anghelina Alva — Cardiología       │
│  ...            │  ...                                │
└───────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Lista vertical de todos los bloques horarios del día
- Columna izquierda: hora del slot
- Columna derecha: nombre del paciente + especialidad (si hay cita) o vacío (si no hay)
- Al hacer clic en una fila con cita → navega a `/doctor/pacientes/:patientId`

**Datos:** `GET /api/appointments/doctor/calendar?date=2025-04-09`

---

## 5. Módulo Pacientes

**Ruta:** `/doctor/pacientes` y `/doctor/pacientes/:patientId`

### Layout general de la vista de Pacientes

```
┌──────────────────┬────────────────────────────────────────────────┐
│  PANEL LATERAL   │  ÁREA PRINCIPAL                                │
│  (sidebar fijo)  │  (contenido del paciente seleccionado)         │
│                  │                                                │
│  Paciente        │  [Header de paciente]                          │
│  ┌────────────┐  │  [Tabs: Historial | Consulta Actual]           │
│  │ Actual     │  │  [Contenido del tab activo]                    │
│  └────────────┘  │                                                │
│                  │                                                │
│  De Hoy          │                                                │
│  ┌────────────┐  │                                                │
│  │ Paciente 1 │  │                                                │
│  │ Paciente 2 │  │                                                │
│  │ Paciente 3 │  │                                                │
│  └────────────┘  │                                                │
│                  │                                                │
│  General         │                                                │
│  [🔍 Buscador]  │                                                │
└──────────────────┴────────────────────────────────────────────────┘
```

---

### Panel Lateral — Lista de Pacientes

El panel lateral tiene **tres secciones fijas y siempre visibles**:

#### Sección 1: Paciente Actual

```
Paciente
Actual
┌──────────────────────────────┐
│ Andrés Pineda                │  ← nombre del paciente en atención activa
└──────────────────────────────┘
```

- Título "Paciente" + subtítulo "Actual"
- Un único card (o placeholder vacío si no hay paciente en curso)
- El card tiene fondo blanco con borde color primario
- Texto: nombre del paciente actual (extraído de `GET /api/medical/doctor/active-patient`)
- Al hacer clic → navega a `/doctor/pacientes/:patientId` con tab "Consulta Actual" activo
- Si no hay paciente actual: mostrar placeholder gris con texto "Sin paciente en atención"

#### Sección 2: De Hoy

```
De Hoy
┌──────────────────────────────┐
│ Anghelina Alva               │  ← pacientes con cita hoy (excluyendo el actual)
├──────────────────────────────┤
│ Leonardo Justo               │
├──────────────────────────────┤
│ Yohalda Vega                 │
└──────────────────────────────┘
```

- Lista vertical de pacientes con cita programada para hoy
- Excluye al paciente actual (ya aparece arriba)
- Cada ítem: nombre del paciente, fondo de lista con separadores
- Al hacer clic → navega a `/doctor/pacientes/:patientId` con tab "Historial" activo (no están en consulta activa)
- Si no hay más pacientes hoy: mostrar "Sin más citas hoy"

#### Sección 3: General (Buscador)

```
General
┌──────────────────────────────┐
│ 🔍 Ej. Juan Pérez            │  ← input de búsqueda
└──────────────────────────────┘
```

- Input de texto con ícono de lupa
- Placeholder: "Ej. Juan Pérez"
- Búsqueda en tiempo real (debounce 300ms) → llama `GET /api/medical/doctor/patients?search=Juan`
- Resultados se muestran debajo del input como lista desplegable o reemplazando el contenido del sidebar
- Al seleccionar un resultado → navega a `/doctor/pacientes/:patientId` con tab "Historial" activo

**Datos del panel lateral:**
- `GET /api/medical/doctor/active-patient` — paciente actual
- `GET /api/appointments/doctor/calendar?date=today` — pacientes de hoy
- `GET /api/medical/doctor/patients?search=:query` — búsqueda general

---

### Header de Paciente (área principal)

Visible en `/doctor/pacientes/:patientId`, fijo en la parte superior del área principal:

```
┌────────────────────────────────────────────────────────────────────┐
│  [A]  Andrés Arthuro Pineda Paredes        ✏ Correo: anrrous@gmail.com │
│       DNI: 71132902                        ✏ Teléfono: 903154571        │
└────────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Avatar circular con inicial, fondo morado/primario
- Nombre completo en negrita
- Badge DNI: pastilla con fondo morado oscuro, texto blanco
- Lado derecho: email y teléfono de solo lectura (el médico NO puede editar datos del paciente)
- Los íconos de lápiz ✏ son decorativos o llevan a una vista de edición restringida (solo lectura para el médico)

---

### Tabs de navegación del paciente

```
  [Historial]    [Consulta Actual]
```

- Tab activo: fondo color primario (teal), texto blanco
- Tab inactivo: borde primario, texto primario, fondo blanco
- "Consulta Actual" está habilitado SOLO si el paciente es el "Paciente Actual" del médico (status `IN_PROGRESS`)
- Si el paciente no es el actual, el tab "Consulta Actual" aparece deshabilitado (gris, no clickeable) o directamente oculto
- Al cargar `/doctor/pacientes/:patientId`:
  - Si el paciente es el actual → default tab = "Consulta Actual"
  - Si no es el actual → default tab = "Historial"

---

## 6. Vista de Paciente — Consulta Actual

**Condición de acceso:** Solo disponible cuando el `appointment.status === 'IN_PROGRESS'` para este paciente con este médico.

**Activación del estado "Consulta Actual":**
- El médico inicia la consulta haciendo clic en la cita desde el Calendario
- Esto llama `POST /api/medical/doctor/consultation/start` con `{ patientId, appointmentId }`
- El backend actualiza `Appointment.status = IN_PROGRESS` y crea un `Consultation` con `status = ACTIVE`
- Esto setea al paciente como "Paciente Actual" en el sistema

### Layout de Consulta Actual

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header de paciente]                                            │
│  [Historial]  [Consulta Actual ← tab activo]                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DIAGNÓSTICO                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ El paciente presentó ...  (textarea editable)              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ANÁLISIS CLÍNICO                                    [Agregar +] │
│  [Hemograma completo ×]  [Examen de orina ×]                    │
│                                                                  │
│  MEDICAMENTOS                                        [Agregar +] │
│  ┌──────────────────┬──────────┬─────────────────────────────┐  │
│  │ Nombre           │ Días     │ Frecuencia                  │  │
│  ├──────────────────┼──────────┼─────────────────────────────┤  │
│  │ Paracetamol      │ 5        │ 8 hrs.                      │  │
│  │ Paracetamol      │ 5        │ 8 hrs.                      │  │
│  └──────────────────┴──────────┴─────────────────────────────┘  │
│                                                                  │
│                                      [Finalizar Consulta →]      │
└──────────────────────────────────────────────────────────────────┘
```

---

### Sección: Diagnóstico

- Título "Diagnóstico" en negrita
- Subtítulo: "Ingresa el diagnóstico del paciente"
- Textarea editable, altura mínima ~120px, placeholder "El paciente presentó ..."
- Sin límite de caracteres visible, pero el backend acepta texto libre
- El diagnóstico se guarda automáticamente (autosave cada 30 segundos con debounce) O al hacer clic en "Finalizar Consulta"
- No hay botón de "Guardar diagnóstico" separado — todo se guarda en el flujo de Finalizar

---

### Sección: Análisis Clínico

- Título "Análisis Clínico"
- Subtítulo: "En caso tu paciente requiera análisis, ingresa cuales tiene que realizarse"
- Botón "Agregar" con ícono + en la esquina superior derecha de la sección

**Flujo al hacer clic en "Agregar" (Análisis):**
1. Aparece un input inline o un pequeño modal/popover con:
   - Campo de texto: nombre del análisis (ej. "Hemograma completo")
   - Campo opcional: especialidad de derivación (ej. "Cardiología")
   - Botón "Agregar" para confirmar
2. Al confirmar: el análisis aparece como chip/badge en la sección
3. Los chips muestran el nombre + ícono × para eliminar
4. Al hacer clic en × → elimina el chip de la lista (no se guarda en BD hasta Finalizar)

**Chips de análisis:**
- Estilo: borde color primario, texto color primario, fondo blanco
- Botón × en el chip: elimina del listado local (estado temporal)
- Los análisis se guardan como `AnalysisOrder` al llamar a Finalizar Consulta

---

### Sección: Medicamentos

- Título "Medicamentos"
- Subtítulo: "Ingresa las instrucciones de los medicamentos, días y horas para el paciente"
- Botón "Agregar" con ícono + en la esquina superior derecha de la sección

**Tabla de medicamentos:**

| Nombre | Días | Frecuencia |
|--------|------|-----------|
| Paracetamol | 5 | 8 hrs. |
| Paracetamol | 5 | 8 hrs. |

- Encabezados: fondo teal/primario, texto blanco
- Filas: alternadas (blanco / gris muy claro) con separadores horizontales
- Cada fila tiene los tres campos editables inline (o se agregan mediante flujo de "Agregar")

**Flujo al hacer clic en "Agregar" (Medicamento):**
1. Se agrega una nueva fila al final de la tabla con tres inputs:
   - Nombre del medicamento (text, required)
   - Nº de días (number, required)
   - Frecuencia (ej. "8 hrs.", "12 hrs.") — puede ser un select o text
2. El médico llena los campos y puede presionar Enter o hacer clic fuera para confirmar
3. Para eliminar una fila: ícono de papelera al final de cada fila (visible en hover)
4. Los medicamentos se guardan como `Prescription → Medication[]` al Finalizar Consulta

---

### Botón Finalizar Consulta

- Botón primario alineado a la derecha inferior: "Finalizar Consulta →"
- Al hacer clic:
  1. Validar que al menos el diagnóstico no esté vacío (mostrar alerta si está vacío)
  2. Mostrar modal de confirmación: "¿Confirmas finalizar la consulta? Una vez finalizada no podrás editarla."
  3. En "Confirmar":
     - Llamar `POST /api/medical/doctor/consultation/:id/diagnosis` con el texto del diagnóstico
     - Llamar `POST /api/medical/doctor/consultation/:id/analysis-orders` con los análisis
     - Llamar `POST /api/medical/doctor/consultation/:id/prescription` con los medicamentos
     - Llamar `POST /api/medical/doctor/consultation/:id/finalize`
     - El backend también llama `PATCH /api/appointments/doctor/:appointmentId/status` con `{ status: 'COMPLETED' }`
  4. En éxito: mostrar toast "Consulta finalizada correctamente" → el paciente desaparece de "Paciente Actual" → redirigir a `/doctor/calendario`
  5. En error: mostrar mensaje de error, no cerrar el formulario

**Nota de implementación:** Para simplificar, se puede hacer una sola llamada a un endpoint de finalización que recibe todo junto `POST /api/medical/doctor/consultation/:id/finalize` con el body completo `{ diagnosis, analysisOrders, medications }`. El backend hace todo en una transacción.

---

## 7. Vista de Paciente — Historial

**Acceso:** Desde el tab "Historial" en `/doctor/pacientes/:patientId`

### Layout de Historial

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header de paciente]                                            │
│  [Historial ← tab activo]  [Consulta Actual]                     │
├──────────────────────┬───────────────────────────────────────────┤
│  PANEL IZQUIERDO     │  PANEL DERECHO                            │
│  (lista de citas)    │  (detalle o chat IA)                      │
│                      │                                           │
│  Historial de        │  [Chat IA "Agente X"]  (default)          │
│  consultas:          │   o                                       │
│  [  /  /  ] 🔍      │  [Detalle de consulta seleccionada]       │
│                      │                                           │
│  Consulta 01-07/08/09│                                           │
│  Consulta 01-07/08/09│                                           │
│  Consulta 01-07/08/09│                                           │
│  Consulta 01-07/08/09│                                           │
└──────────────────────┴───────────────────────────────────────────┘
```

---

### Panel Izquierdo — Lista de Consultas

- Título: "Historial de consultas del paciente:"
- Filtro de fecha: dos inputs de fecha (desde / hasta) con ícono de lupa para filtrar
- Lista de consultas anteriores (solo `status: FINALIZED`):
  ```
  ┌──────────────────────────────────────────┐
  │ Consulta 01 - 07 / 08 / 09               │
  └──────────────────────────────────────────┘
  ```
  - Formato del label: "Consulta [número] - [fecha en DD/MM/AA]"
  - Borde color primario, texto color primario
  - Al hacer clic en una consulta → carga el detalle en el panel derecho Y oculta el chat IA
  - Consulta seleccionada: fondo color primario suave, borde más grueso

**Datos:** `GET /api/medical/doctor/patients/:patientId` (que incluye el historial de consultas finalizadas)

---

### Panel Derecho — Opción A: Chat IA "Agente X" (default)

Cuando **ninguna consulta está seleccionada**, el panel derecho muestra el chat con la IA:

```
┌──────────────────────────────────────────────────────────────────┐
│  Agente X                                                        │
│  Consulta a nuestro agente información que desees conocer        │
│  del paciente actual                                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Buenos días, Dra. Alva. Está consultando el perfil de     │  │
│  │ gestión de pacientes. ¿En qué puedo ayudarle a revisar    │  │
│  │ hoy?                                                       │  │
│  │                                                            │  │
│  │ (respuestas del agente)                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pregunta: Ej. Quiero el historial de análisis de mi       │  │
│  │ paciente                                              [→]  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Especificaciones del chat:**
- Título "Agente X" en negrita, subtítulo explicativo
- Área de chat con scroll (historial de la conversación)
- Mensajes del agente: burbuja con fondo teal/primario claro, texto oscuro
- Mensajes del médico: burbuja con fondo gris claro, alineados a la derecha
- Mensaje de bienvenida inicial del agente al cargar la vista (hardcodeado o generado por la IA)
- Input de texto en la parte inferior con placeholder "Pregunta: Ej. Quiero el historial de análisis de mi paciente"
- Botón de envío: ícono de flecha → a la derecha del input
- Al enviar: el mensaje del médico aparece en el chat → loading indicator → respuesta del agente

**Funcionamiento del chat IA:**
- Llama `POST /api/medical/doctor/ai/chat` con `{ consultationId: activeConsultationId, message: "texto del médico" }`
- El backend envía el mensaje + contexto del paciente (historial de consultas) al LLM "The Good Doctor"
- La respuesta del LLM se retorna y se muestra en el chat
- El historial del chat se recupera con `GET /api/medical/doctor/ai/chat/:consultationId`
- Si no hay consulta activa: el chat funciona en modo "consulta de historial" (el backend decide el contexto a enviar al LLM)

**Nota UX:** El chat IA está disponible en el tab Historial para que el médico pueda consultar el expediente del paciente mediante lenguaje natural sin necesidad de leer todo el historial manualmente.

---

### Panel Derecho — Opción B: Detalle de Consulta Seleccionada

Cuando el médico hace clic en una consulta del listado, el panel derecho cambia a mostrar el detalle de esa consulta en **modo lectura** (el médico NO puede editar consultas pasadas):

```
┌──────────────────────────────────────────────────────────────────┐
│  Consulta — 05 de enero, 2026                                    │
│  Dra. Anghelina Alva — Medicina General                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DIAGNÓSTICO                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ El paciente presentó síntomas de...  (solo lectura)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ANÁLISIS CLÍNICO DERIVADO                                       │
│  [Hemograma completo]  [Examen de orina]                         │
│  (chips sin botón × — solo lectura)                              │
│                                                                  │
│  MEDICAMENTOS ASIGNADOS                                          │
│  ┌──────────────────┬──────────┬──────────────────────────────┐  │
│  │ Nombre           │ Días     │ Frecuencia                   │  │
│  ├──────────────────┼──────────┼──────────────────────────────┤  │
│  │ Paracetamol      │ 5        │ 8 hrs.                       │  │
│  └──────────────────┴──────────┴──────────────────────────────┘  │
│                                                                  │
│                    [← Volver al chat IA]                         │
└──────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Header de la consulta: fecha + nombre del médico que atendió + especialidad
- Diagnóstico: textarea deshabilitada (no editable), misma apariencia que en Consulta Actual pero sin cursor
- Análisis Clínico: chips sin el botón × (no se pueden eliminar)
- Medicamentos: tabla en modo solo lectura (sin inputs editables, sin botón papelera)
- Botón "Volver al chat IA" o simplemente deseleccionar la consulta para volver al estado default

**Datos:** `GET /api/medical/patient/consultation/:id` (el endpoint retorna `diagnosis`, `prescriptions` con `medications`, `analysisOrders`)

---

### Vista mini del sidebar en pantalla de Pacientes (imagen 4)

En la imagen 4 se observa que cuando el médico está en la vista de un paciente específico, el sidebar izquierdo se **colapsa** a una versión compacta:

```
┌────┐
│ 🔍 │  ← ícono de búsqueda
│    │
│ A  │  ← inicial del paciente (letra), representa un paciente de la lista
│    │
│ A  │
│    │
│ D  │
│    │
│ A  │
│    │
│ G  │
│    │
│ J  │
│    │
│ L  │
└────┘
```

**Especificaciones del sidebar colapsado:**
- Solo muestra la inicial del nombre de cada paciente en círculos
- Al hacer hover sobre una inicial: tooltip con el nombre completo
- Al hacer clic: navega a ese paciente
- Ícono de lupa en la parte superior para expandir la búsqueda
- Este es un estado "colapsado" — en pantallas más anchas muestra el sidebar completo, en pantallas medianas colapsa a solo iniciales

---

## 8. Estados y transiciones de UI

### Estado de carga

- Skeleton loaders para:
  - Lista de pacientes en el sidebar
  - Citas en el calendario
  - Detalle de consulta

### Estado vacío (empty states)

| Contexto | Mensaje |
|----------|---------|
| Sin paciente actual | "Sin paciente en atención activa" |
| Sin pacientes hoy | "No hay más citas programadas para hoy" |
| Sin consultas en historial | "Este paciente aún no tiene consultas registradas" |
| Sin citas en el calendario | "No tienes citas programadas para este período" |
| Sin resultados de búsqueda | "No se encontraron pacientes con ese nombre" |

### Toast/notificaciones

| Evento | Tipo | Mensaje |
|--------|------|---------|
| Consulta finalizada | ✅ Success | "Consulta finalizada correctamente" |
| Error al finalizar | ❌ Error | "No se pudo finalizar la consulta. Intenta nuevamente." |
| Error de IA (timeout) | ⚠ Warning | "El agente tardó demasiado en responder. Intenta de nuevo." |

---

## 9. Contratos de API que consume el Médico

### Auth Service (`/api/auth`)

```typescript
// POST /api/auth/login
Request: { email: string, password: string }
Response: { success: true, data: { token: string, user: UserDTO } }
// Validar que user.role === 'DOCTOR' en el frontend

// GET /api/auth/me
Response: { success: true, data: UserDTO }
// UserDTO incluye doctorId si role === 'DOCTOR'
```

### Appointment Service (`/api/appointments`)

```typescript
// GET /api/appointments/doctor/calendar?from=&to=  (vista semanal)
// GET /api/appointments/doctor/calendar?month=2025-04  (vista mensual)
// GET /api/appointments/doctor/calendar?date=2025-04-09  (vista diaria)
Response: {
  success: true,
  data: {
    appointments: AppointmentCalendarDTO[]
  }
}

interface AppointmentCalendarDTO {
  id: string;
  patientId: string;
  patientName: string;
  specialty: string;
  scheduledAt: string; // ISO
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// PATCH /api/appointments/doctor/:appointmentId/status
Request: { status: 'IN_PROGRESS' | 'COMPLETED' }
Response: { success: true, data: { appointment: AppointmentDTO } }
```

### Medical Records Service (`/api/medical`)

```typescript
// GET /api/medical/doctor/patients?search=:query
Response: { success: true, data: { patients: PatientSummaryDTO[] } }

interface PatientSummaryDTO {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone?: string;
}

// GET /api/medical/doctor/patients/:patientId
Response: {
  success: true,
  data: {
    patient: PatientSummaryDTO,
    consultations: ConsultationSummaryDTO[]  // solo FINALIZED
  }
}

// GET /api/medical/doctor/active-patient
Response: {
  success: true,
  data: {
    patient: PatientSummaryDTO | null,
    consultation: ConsultationDTO | null
  }
}

// POST /api/medical/doctor/consultation/start
Request: { patientId: string, appointmentId: string }
Response: { success: true, data: { consultation: ConsultationDTO } }

// GET /api/medical/patient/consultation/:id  (mismo endpoint, accesible por médico)
Response: { success: true, data: { consultation: ConsultationDetailDTO } }
// Incluye: diagnosis, prescriptions (con medications[]), analysisOrders, analysisResults

// POST /api/medical/doctor/consultation/:id/finalize
Request: {
  diagnosis: string,
  analysisOrders: { examName: string, specialty?: string }[],
  medications: { name: string, days: number, frequency: string }[]
}
Response: { success: true, data: { consultation: ConsultationDTO } }

// POST /api/medical/doctor/ai/chat
Request: { consultationId: string, message: string, patientId: string }
Response: { success: true, data: { reply: string } }

// GET /api/medical/doctor/ai/chat/:consultationId
Response: {
  success: true,
  data: {
    messages: AIChatMessageDTO[]
  }
}

interface AIChatMessageDTO {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
```

### DTOs relevantes para el frontend

```typescript
interface ConsultationDTO {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  status: 'ACTIVE' | 'FINALIZED';
  startedAt: string;
  finalizedAt?: string;
}

interface ConsultationDetailDTO extends ConsultationDTO {
  doctorName: string;
  specialty: string;
  diagnosis?: {
    description: string;
    icdCode?: string;
  };
  prescriptions: {
    id: string;
    medications: {
      name: string;
      dose: string;
      frequency: string;
      duration: string;
    }[];
  }[];
  analysisOrders: {
    id: string;
    examName: string;
    specialty?: string;
  }[];
  analysisResults: {
    id: string;
    fileName: string;
    s3Url: string;
    fileType: string;
  }[];
}
```

---

## 10. Estructura de carpetas frontend — Médico

```
frontend/src/
├── app/
│   └── (doctor)/
│       ├── layout.tsx                          # Layout con DoctorHeader
│       ├── login/
│       │   └── page.tsx                        # Login del médico
│       ├── calendario/
│       │   └── page.tsx                        # Vista de calendario
│       └── pacientes/
│           ├── page.tsx                        # Lista + sidebar (redirige al primero o muestra empty)
│           └── [patientId]/
│               └── page.tsx                    # Vista de paciente con tabs
│
├── components/
│   ├── doctor/
│   │   ├── DoctorHeader.tsx                    # Header del portal médico
│   │   ├── DoctorLoginForm.tsx                 # Formulario de login
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarViewToggle.tsx          # Tabs: Mensual/Semanal/Diario
│   │   │   ├── MonthlyCalendar.tsx             # Grid mensual
│   │   │   ├── WeeklyCalendar.tsx              # Grid semanal con horas
│   │   │   └── DailyCalendar.tsx               # Lista diaria
│   │   │
│   │   ├── patients/
│   │   │   ├── PatientSidebar.tsx              # Panel lateral completo
│   │   │   ├── PatientSidebarCollapsed.tsx     # Sidebar colapsado (iniciales)
│   │   │   ├── PatientHeader.tsx               # Header con datos del paciente
│   │   │   ├── PatientTabs.tsx                 # Tabs Historial/Consulta Actual
│   │   │   │
│   │   │   ├── consultation/
│   │   │   │   ├── ActiveConsultation.tsx      # Vista Consulta Actual completa
│   │   │   │   ├── DiagnosisForm.tsx           # Textarea de diagnóstico
│   │   │   │   ├── AnalysisOrderManager.tsx    # Chips de análisis + agregar
│   │   │   │   ├── MedicationTable.tsx         # Tabla de medicamentos editable
│   │   │   │   └── FinalizeConsultationModal.tsx # Modal de confirmación
│   │   │   │
│   │   │   └── history/
│   │   │       ├── ConsultationHistory.tsx     # Panel izquierdo + derecho del historial
│   │   │       ├── ConsultationList.tsx        # Lista de consultas con filtro de fecha
│   │   │       ├── ConsultationDetail.tsx      # Detalle (solo lectura)
│   │   │       └── AIChat.tsx                  # Chat con Agente X
│   │   └── ...
│
├── hooks/
│   ├── useDoctorAuth.ts                        # Hook de auth del médico
│   ├── useDoctorCalendar.ts                    # Hook para datos del calendario
│   ├── useDoctorPatients.ts                    # Hook para lista y búsqueda de pacientes
│   ├── useActivePatient.ts                     # Hook para paciente actual
│   ├── useConsultation.ts                      # Hook para consulta activa
│   └── useAIChat.ts                            # Hook para chat con la IA
│
├── lib/
│   └── api/
│       ├── auth.api.ts                         # (compartido con paciente)
│       ├── appointments.api.ts                 # Endpoints doctor del appointment service
│       └── medical.api.ts                      # Endpoints doctor del medical records service
│
└── store/
    ├── useDoctorAuthStore.ts                   # Estado: doctorUser, token, isAuthenticated
    ├── useCalendarStore.ts                     # Estado: vista activa, fecha seleccionada
    └── useConsultationStore.ts                 # Estado: consulta activa, datos del formulario
```

### useDoctorAuthStore (Zustand)

```typescript
interface DoctorAuthStore {
  doctor: DoctorUserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (doctor: DoctorUserDTO, token: string) => void;
  clearAuth: () => void;
}

interface DoctorUserDTO {
  id: string;          // userId
  doctorId: string;    // del perfil Doctor
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  role: 'DOCTOR';
}
```

### useConsultationStore (Zustand — estado temporal del formulario de consulta)

```typescript
interface ConsultationStore {
  consultationId: string | null;
  diagnosis: string;
  analysisOrders: { examName: string; specialty?: string }[];
  medications: { name: string; days: number; frequency: string }[];
  isDirty: boolean;                           // hay cambios sin guardar
  setConsultationId: (id: string) => void;
  setDiagnosis: (text: string) => void;
  addAnalysisOrder: (order: { examName: string; specialty?: string }) => void;
  removeAnalysisOrder: (index: number) => void;
  addMedication: (med: { name: string; days: number; frequency: string }) => void;
  removeMedication: (index: number) => void;
  reset: () => void;
}
```

### useCalendarStore (Zustand)

```typescript
interface CalendarStore {
  view: 'monthly' | 'weekly' | 'daily';
  currentDate: Date;
  setView: (v: 'monthly' | 'weekly' | 'daily') => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  goToDate: (date: Date) => void;
}
```

---

## Notas de implementación para Claude Code

1. **Separación de auth stores:** El médico y el paciente tienen stores de autenticación separados (`useDoctorAuthStore` vs `useAuthStore`). Esto evita colisiones si ambas sesiones están abiertas en distintas pestañas.

2. **JWT storage:** El JWT del médico se guarda en `localStorage` bajo `clinica_x_doctor_token` (distinto al del paciente `clinica_x_token`).

3. **Consulta activa — flujo de inicio:** Cuando el médico hace clic en una cita del calendario, se llama automáticamente a `POST /api/medical/doctor/consultation/start`. Si ya existe una consulta activa para ese appointment, el backend la retorna sin crear duplicado.

4. **Autosave del diagnóstico:** Implementar debounce de 2 segundos en el textarea de diagnóstico que llama a un endpoint de guardado parcial (o simplemente guardar todo al finalizar y no hacer autosave para simplificar la primera versión).

5. **Chat IA — contexto:** El `consultationId` enviado al chat puede ser el de la consulta activa actual. Si el médico está en la vista de Historial sin consulta activa seleccionada, el backend puede recibir el `patientId` y construir el contexto con todas las consultas pasadas del paciente.

6. **Responsive del sidebar:** Implementar con CSS el colapso del sidebar:
   - `> 1200px`: sidebar completo con nombres
   - `768px - 1200px`: sidebar colapsado con iniciales
   - `< 768px`: sidebar oculto, accesible mediante botón hamburguesa o drawer

7. **Finalizar Consulta — transacción:** Es preferible hacer una sola llamada al backend con todos los datos (`diagnosis + analysisOrders + medications`) para garantizar atomicidad. El backend debe guardar todo en una transacción de Prisma.

8. **Protección de rutas:** El middleware de Next.js debe verificar:
   - Rutas `/doctor/*` solo accesibles con JWT donde `role === 'DOCTOR'`
   - Si hay JWT de paciente intentando acceder a `/doctor/*` → redirigir a `/perfil`
