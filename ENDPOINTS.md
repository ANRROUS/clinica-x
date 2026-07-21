# API Endpoints - Clinica X

Documentación de la API REST del sistema Clinica X.

**Base URL:** `http://localhost:3000` (API Gateway)

**Formato de respuesta:** JSON

**Autenticación:** JWT Bearer Token

```
Authorization: Bearer <token>
```

---

## Índice de Casos de Prueba

| ID | Caso de Prueba | Módulo | Endpoint |
|---|---|---|---|
| CP-01 | Registro de paciente | Paciente | `POST /api/auth/register` |
| CP-02 | Inicio de sesión de paciente | Paciente | `POST /api/auth/login` |
| CP-03 | Reserva de cita médica | Paciente | `POST /api/appointments/book/manual` |
| CP-04 | Consulta de recomendaciones médicas | Paciente | `GET /api/medical/patient/consultation/:id` |
| CP-05 | Carga de exámenes médicos | Paciente | `POST /api/files/upload` |
| CP-06 | Inicio de sesión de doctor | Doctor | `POST /api/auth/login` |
| CP-07 | Consulta de historial clínico | Doctor | `GET /api/medical/doctor/patient/:patientId/history` |
| CP-08 | Registro de recomendaciones médicas | Doctor | `POST /api/medical/doctor/consultation/:id/finalize` |
| CP-09 | Consulta de exámenes médicos | Doctor | `GET /api/ocr/results/paciente/:pacienteId` |
| CP-10 | Inicio de sesión de administrador | Admin | `POST /api/auth/login` |
| CP-11 | Registro de doctor | Admin | `POST /api/admin/doctors` |
| CP-12 | Configuración de horarios médicos | Admin | `POST /api/admin/doctors` |

---

## Módulo Autenticación

### POST `/api/auth/register`

**Caso de Prueba:** CP-01 — Registro de paciente

**Descripción:** Registra un nuevo usuario en el sistema.

**Autenticación:** Pública (rol por defecto: `PACIENTE`)

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `application/json` |

**Request Body:**

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| dni | string | Sí | 8 dígitos numéricos | Documento Nacional de Identidad |
| email | string | Sí | Formato email válido | Correo electrónico del usuario |
| password | string | Sí | Mínimo 8 caracteres | Contraseña de acceso |
| nombre | string | Sí | Mínimo 1 carácter | Nombres del usuario |
| apellido | string | Sí | Mínimo 1 carácter | Apellidos del usuario |
| telefono | string | No | — | Número de teléfono |
| rol | string | No | `PACIENTE` / `MEDICO` / `ADMIN` | Rol del usuario |

**Ejemplo Request:**

```json
{
  "dni": "12345678",
  "email": "juan.perez@correo.com",
  "password": "MiPassword123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "999888777",
  "rol": "PACIENTE"
}
```

**Response 201 Created:**

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "juan.perez@correo.com",
      "rol": "PACIENTE"
    }
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "email",
        "mensaje": "Correo inválido"
      },
      {
        "campo": "dni",
        "mensaje": "El DNI debe tener 8 dígitos numéricos"
      }
    ]
  }
}
```

**Response 409 Conflict — Usuario duplicado:**

```json
{
  "success": false,
  "error": {
    "codigo": "USUARIO_DUPLICADO",
    "mensaje": "El email juan.perez@correo.com ya está registrado"
  }
}
```

---

### POST `/api/auth/login`

**Caso de Prueba:** CP-02 (Paciente), CP-06 (Doctor), CP-10 (Admin)

**Descripción:** Inicia sesión con credenciales y devuelve un token JWT. Aplica para cualquier rol (`PACIENTE`, `MEDICO`, `ADMIN`).

**Autenticación:** Pública

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `application/json` |

**Request Body:**

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| email | string | Sí | Formato email válido | Correo electrónico del usuario |
| password | string | Sí | Mínimo 1 carácter | Contraseña de acceso |
| dni | string | No | — | DNI (opcional, según flujo) |

**Ejemplo Request:**

```json
{
  "email": "juan.perez@correo.com",
  "password": "MiPassword123"
}
```

**Response 200 OK:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "juan.perez@correo.com",
      "rol": "PACIENTE",
      "nombre": "Juan",
      "apellido": "Pérez"
    }
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "email",
        "mensaje": "Correo inválido"
      }
    ]
  }
}
```

**Response 401 Unauthorized — Credenciales inválidas:**

```json
{
  "success": false,
  "error": {
    "codigo": "CREDENCIALES_INVALIDAS",
    "mensaje": "Credenciales inválidas"
  }
}
```

---

## Módulo Paciente

### POST `/api/appointments/book/manual`

**Caso de Prueba:** CP-03 — Reserva de cita médica

**Descripción:** Reserva una cita médica seleccionando un médico y horario específico.

**Autenticación:** JWT — Rol: `PACIENTE`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `application/json` |
| Authorization | string | Sí | `Bearer <token>` |

**Request Body:**

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| medicoId | string | Sí | UUID | ID del médico seleccionado |
| fechaHora | string | Sí | ISO 8601 datetime | Fecha y hora de la cita |
| motivo | string | No | — | Motivo de la consulta |

**Ejemplo Request:**

```json
{
  "medicoId": "660e8400-e29b-41d4-a716-446655440001",
  "fechaHora": "2026-06-20T10:30:00-05:00",
  "motivo": "Control general"
}
```

**Response 201 Created:**

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "pacienteId": "550e8400-e29b-41d4-a716-446655440000",
    "medicoId": "660e8400-e29b-41d4-a716-446655440001",
    "fechaHora": "2026-06-20T10:30:00.000-05:00",
    "estado": "CONFIRMADA",
    "tipoReserva": "MANUAL",
    "motivo": "Control general"
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "medicoId",
        "mensaje": "medicoId inválido"
      }
    ]
  }
}
```

**Response 401 Unauthorized — Token inválido o faltante:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_AUTENTICADO",
    "mensaje": "Token inválido o faltante"
  }
}
```

---

### GET `/api/medical/patient/consultation/:id`

**Caso de Prueba:** CP-04 — Consulta de recomendaciones médicas

**Descripción:** Obtiene el detalle de una consulta médica (diagnóstico, recetas, órdenes de análisis).

**Autenticación:** JWT — Rol: `PACIENTE`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Authorization | string | Sí | `Bearer <token>` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| id | string | Sí | UUID de la consulta |

**Response 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "pacienteId": "550e8400-e29b-41d4-a716-446655440000",
    "medicoId": "660e8400-e29b-41d4-a716-446655440001",
    "medicoNombre": "Dr. Carlos",
    "medicoApellido": "López",
    "fechaInicio": "2026-06-17T10:30:00.000-05:00",
    "fechaFin": "2026-06-17T10:45:00.000-05:00",
    "diagnostico": "Paciente presenta síntomas de rinitis alérgica",
    "notas": "Se recomienda evitar alérgenos",
    "estado": "FINALIZADA",
    "medicamentos": [
      {
        "nombre": "Loratadina",
        "dias": 7,
        "frecuencia": "Cada 24 horas"
      }
    ],
    "ordenesAnalisis": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "examName": "Hemograma completo",
        "especialidad": "Hematología",
        "estado": "PENDIENTE"
      }
    ]
  }
}
```

**Response 401 Unauthorized:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_AUTENTICADO",
    "mensaje": "Token inválido o faltante"
  }
}
```

**Response 404 Not Found:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_ENCONTRADO",
    "mensaje": "Consulta no encontrada"
  }
}
```

---

### POST `/api/files/upload`

**Caso de Prueba:** CP-05 — Carga de exámenes médicos

**Descripción:** Sube un archivo (PDF, imagen) al almacenamiento en Supabase.

**Autenticación:** JWT — Rol: `PACIENTE`, `MEDICO` o `ADMIN`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `multipart/form-data` |
| Authorization | string | Sí | `Bearer <token>` |

**Request Body (multipart/form-data):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| file | file | Sí | Archivo a subir (PDF, imagen) — Máx 10 MB |
| propietarioServicio | string | Sí | Nombre del servicio propietario |
| propietarioRecursoId | string | Sí | UUID del recurso propietario |

**Response 201 Created:**

```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "nombreOriginal": "resultado_analisis.pdf",
    "mimeType": "application/pdf",
    "tamanoBytes": 245760,
    "url": "https://...supabase.co/storage/v1/object/public/...",
    "createdAt": "2026-06-17T10:30:00.000-05:00"
  }
}
```

**Response 400 Bad Request — Archivo no proporcionado:**

```json
{
  "success": false,
  "error": {
    "codigo": "ARCHIVO_REQUERIDO",
    "mensaje": "No se proporcionó ningún archivo"
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "propietarioRecursoId",
        "mensaje": "Invalid uuid"
      }
    ]
  }
}
```

---

## Módulo Doctor

### GET `/api/medical/doctor/patient/:patientId/history`

**Caso de Prueba:** CP-07 — Consulta de historial clínico

**Descripción:** Obtiene el historial clínico completo de un paciente (consultas finalizadas con diagnósticos, recetas y órdenes).

**Autenticación:** JWT — Rol: `MEDICO`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Authorization | string | Sí | `Bearer <token>` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| patientId | string | Sí | UUID del paciente |

**Parámetros Query (opcionales):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| desde | string | Fecha inicio (YYYY-MM-DD) |
| hasta | string | Fecha fin (YYYY-MM-DD) |

**Response 200 OK:**

```json
{
  "success": true,
  "data": {
    "consultations": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "medicoId": "660e8400-e29b-41d4-a716-446655440001",
        "medicoNombre": "Carlos",
        "medicoApellido": "López",
        "fechaInicio": "2026-06-17T10:30:00.000-05:00",
        "fechaFin": "2026-06-17T10:45:00.000-05:00",
        "diagnostico": "Rinitis alérgica",
        "notas": "Evitar alérgenos",
        "estado": "FINALIZADA",
        "medicamentos": [
          {
            "nombre": "Loratadina",
            "dias": 7,
            "frecuencia": "Cada 24 horas"
          }
        ],
        "ordenesAnalisis": [
          {
            "id": "990e8400-e29b-41d4-a716-446655440004",
            "examName": "Hemograma completo",
            "especialidad": "Hematología",
            "estado": "PENDIENTE"
          }
        ]
      }
    ]
  }
}
```

**Response 401 Unauthorized:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_AUTENTICADO",
    "mensaje": "Token inválido o faltante"
  }
}
```

---

### POST `/api/medical/doctor/consultation/:id/finalize`

**Caso de Prueba:** CP-08 — Registro de recomendaciones médicas

**Descripción:** Finaliza una consulta médica registrando el diagnóstico, notas, medicamentos recetados y órdenes de análisis.

**Autenticación:** JWT — Rol: `MEDICO`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `application/json` |
| Authorization | string | Sí | `Bearer <token>` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| id | string | Sí | UUID de la consulta a finalizar |

**Request Body:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| diagnostico | string | No | Diagnóstico médico |
| notas | string | No | Notas adicionales |
| analysisOrders | array | No | Órdenes de análisis (exámenes) |
| analysisOrders[].examName | string | Sí | Nombre del examen |
| analysisOrders[].specialty | string | No | Especialidad del examen |
| medications | array | No | Medicamentos recetados |
| medications[].name | string | Sí | Nombre del medicamento |
| medications[].days | number | Sí | Días de tratamiento (entero positivo) |
| medications[].frequency | string | Sí | Frecuencia (ej: "Cada 8 horas") |

**Ejemplo Request:**

```json
{
  "diagnostico": "Paciente presenta rinitis alérgica estacional",
  "notas": "Se recomienda evitar exposición a polen",
  "medications": [
    {
      "name": "Loratadina",
      "days": 7,
      "frequency": "Cada 24 horas"
    },
    {
      "name": "Mometasona",
      "days": 14,
      "frequency": "Cada 12 horas"
    }
  ],
  "analysisOrders": [
    {
      "examName": "Hemograma completo",
      "specialty": "Hematología"
    },
    {
      "examName": "Pruebas alérgicas",
      "specialty": "Inmunología"
    }
  ]
}
```

**Response 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "estado": "FINALIZADA",
    "diagnostico": "Paciente presenta rinitis alérgica estacional",
    "notas": "Se recomienda evitar exposición a polen"
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "medications[0].days",
        "mensaje": "days debe ser un número positivo"
      }
    ]
  }
}
```

---

### GET `/api/ocr/results/paciente/:pacienteId`

**Caso de Prueba:** CP-09 — Consulta de exámenes médicos

**Descripción:** Obtiene todos los resultados OCR de los exámenes de un paciente. Verifica que el paciente autenticado solo acceda a sus propios resultados.

**Autenticación:** JWT — Rol: `PACIENTE` o `MEDICO`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Authorization | string | Sí | `Bearer <token>` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| pacienteId | string | Sí | UUID del paciente |

**Response 200 OK:**

```json
{
  "success": true,
  "data": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "archivoId": "aa0e8400-e29b-41d4-a716-446655440005",
      "ordenAnalisisId": "990e8400-e29b-41d4-a716-446655440004",
      "pacienteId": "550e8400-e29b-41d4-a716-446655440000",
      "tipoAnalisis": "SANGRE",
      "resultados": {
        "hemoglobina": 14.5,
        "glucosa": 95,
        "colesterol": 180
      },
      "estado": "COMPLETADO",
      "createdAt": "2026-06-17T11:00:00.000-05:00"
    }
  ]
}
```

**Response 403 Forbidden:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_AUTORIZADO",
    "mensaje": "No autorizado para ver estos resultados"
  }
}
```

**Response 404 Not Found:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_ENCONTRADO",
    "mensaje": "No se encontraron resultados para el paciente"
  }
}
```

---

## Módulo Administrador

### POST `/api/admin/doctors`

**Caso de Prueba:** CP-11 — Registro de doctor y CP-12 — Configuración de horarios médicos

**Descripción:** Crea un nuevo doctor en el sistema con su usuario de acceso y horarios de atención.

**Autenticación:** JWT — Rol: `ADMIN`

**Headers:**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| Content-Type | string | Sí | `application/json` |
| Authorization | string | Sí | `Bearer <token>` |

**Request Body:**

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| nombre | string | Sí | Mínimo 1 carácter | Nombres del doctor |
| apellido | string | Sí | Mínimo 1 carácter | Apellidos del doctor |
| dni | string | Sí | 8 dígitos numéricos | DNI del doctor |
| email | string | Sí | Formato email válido | Correo electrónico |
| telefono | string | No | — | Número de teléfono |
| username | string | Sí | Mínimo 4 caracteres, sin espacios | Nombre de usuario |
| specialtyId | string | Sí | UUID | ID de la especialidad |
| shift | string | Sí | `MANANA` / `TARDE` | Turno de atención |
| password | string | Sí | Mínimo 8 caracteres | Contraseña de acceso |
| schedules | array | Sí | Mínimo 1 horario | Horarios de atención semanal |
| schedules[].diaSemana | number | Sí | 1 (Lunes) a 7 (Domingo) | Día de la semana |
| schedules[].horaInicio | string | Sí | Formato HH:MM | Hora de inicio |
| schedules[].horaFin | string | Sí | Formato HH:MM | Hora de fin |

**Ejemplo Request:**

```json
{
  "nombre": "Carlos",
  "apellido": "López",
  "dni": "87654321",
  "email": "carlos.lopez@clinica.com",
  "telefono": "999111222",
  "username": "carlos.lopez",
  "specialtyId": "cc0e8400-e29b-41d4-a716-446655440007",
  "shift": "MANANA",
  "password": "DoctorPass123",
  "schedules": [
    {
      "diaSemana": 1,
      "horaInicio": "08:00",
      "horaFin": "12:00"
    },
    {
      "diaSemana": 2,
      "horaInicio": "08:00",
      "horaFin": "12:00"
    },
    {
      "diaSemana": 3,
      "horaInicio": "08:00",
      "horaFin": "12:00"
    },
    {
      "diaSemana": 4,
      "horaInicio": "08:00",
      "horaFin": "12:00"
    },
    {
      "diaSemana": 5,
      "horaInicio": "08:00",
      "horaFin": "12:00"
    }
  ]
}
```

**Response 201 Created:**

```json
{
  "success": true,
  "data": {
    "doctor": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "nombre": "Carlos",
      "apellido": "López",
      "dni": "87654321",
      "email": "carlos.lopez@clinica.com",
      "telefono": "999111222",
      "username": "carlos.lopez",
      "especialidadId": "cc0e8400-e29b-41d4-a716-446655440007",
      "shift": "MANANA",
      "activo": true,
      "schedules": [
        {
          "diaSemana": 1,
          "horaInicio": "08:00",
          "horaFin": "12:00"
        },
        {
          "diaSemana": 2,
          "horaInicio": "08:00",
          "horaFin": "12:00"
        },
        {
          "diaSemana": 3,
          "horaInicio": "08:00",
          "horaFin": "12:00"
        },
        {
          "diaSemana": 4,
          "horaInicio": "08:00",
          "horaFin": "12:00"
        },
        {
          "diaSemana": 5,
          "horaInicio": "08:00",
          "horaFin": "12:00"
        }
      ]
    }
  }
}
```

**Response 400 Bad Request — Validación:**

```json
{
  "success": false,
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Datos inválidos",
    "detalles": [
      {
        "campo": "email",
        "mensaje": "Correo inválido"
      },
      {
        "campo": "dni",
        "mensaje": "DNI debe tener 8 dígitos"
      },
      {
        "campo": "schedules",
        "mensaje": "Al menos un horario es requerido"
      }
    ]
  }
}
```

**Response 401 Unauthorized:**

```json
{
  "success": false,
  "error": {
    "codigo": "NO_AUTENTICADO",
    "mensaje": "Token inválido o faltante"
  }
}
```

**Response 403 Forbidden — Rol no autorizado:**

```json
{
  "success": false,
  "error": {
    "codigo": "FORBIDDEN",
    "mensaje": "No autorizado para crear este rol"
  }
}
```

---

## Apéndices

### Códigos de Error

| Código | HTTP | Descripción |
|---|---|---|
| `VALIDACION` | 400 | Error de validación de datos (Zod) |
| `ARCHIVO_REQUERIDO` | 400 | No se proporcionó archivo en upload |
| `NO_AUTENTICADO` | 401 | Token JWT inválido o faltante |
| `CREDENCIALES_INVALIDAS` | 401 | Email o contraseña incorrectos |
| `FORBIDDEN` | 403 | No autorizado para la operación |
| `NO_AUTORIZADO` | 403 | El recurso no pertenece al usuario |
| `USUARIO_NO_ENCONTRADO` | 404 | Usuario no encontrado |
| `NO_ENCONTRADO` | 404 | Recurso no encontrado |
| `MEDICO_NO_ENCONTRADO` | 404 | Médico no asociado al usuario |
| `USUARIO_DUPLICADO` | 409 | Email o DNI ya registrado |

### Estados de Cita

| Estado | Descripción |
|---|---|
| `CONFIRMADA` | Cita confirmada y pendiente |
| `EN_ATENCION` | Paciente siendo atendido |
| `COMPLETADA` | Consulta finalizada |
| `CANCELADA` | Cita cancelada |

### Días de Semana (schedules)

| Valor | Día |
|---|---|
| 1 | Lunes |
| 2 | Martes |
| 3 | Miércoles |
| 4 | Jueves |
| 5 | Viernes |
| 6 | Sábado |
| 7 | Domingo |

### Turnos (shift)

| Turno | Descripción |
|---|---|
| `MANANA` | Turno mañana |
| `TARDE` | Turno tarde |

### Formato de Respuesta General

Todas las respuestas siguen la estructura:

```json
{
  "success": true | false,
  "data": { ... },
  "error": {
    "codigo": "CODIGO_ERROR",
    "mensaje": "Descripción del error",
    "detalles": []
  }
}
```
