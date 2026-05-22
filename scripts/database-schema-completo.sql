-- =============================================================================
-- database-schema-completo.sql — Esquema físico completo de Clínica X
-- =============================================================================
-- Fecha: 2026-05-22
-- Proyecto: Clinica X — Arquitectura de Microservicios con Supabase
-- Descripción: Script DDL completo con Foreign Keys reales (incluyendo cross-schema)
-- Base de datos: PostgreSQL 15+ / Supabase
-- 
-- NOTA IMPORTANTE SOBRE OCR-SERVICE:
-- El microservicio ocr-service COMPARTE el schema 'clinical_service' con clinical-service.
-- Ambos servicios acceden a las mismas tablas: ordenes_analisis, analisis_resultados,
-- analisis_grupos, analisis_items. El ocr-service opera en modo lectura/escritura
-- sobre los resultados de OCR mientras clinical-service gestiona las órdenes y consultas.
-- =============================================================================

-- =============================================================================
-- 1. CREACIÓN DE SCHEMAS
-- =============================================================================
-- Los 4 schemas separados por microservicio, cada uno aislado lógicamente.

CREATE SCHEMA IF NOT EXISTS auth_service;
CREATE SCHEMA IF NOT EXISTS appointment_service;
CREATE SCHEMA IF NOT EXISTS clinical_service;
CREATE SCHEMA IF NOT EXISTS file_service;

-- =============================================================================
-- 2. SCHEMA: auth_service — Microservicio de Autenticación
-- =============================================================================
-- Tabla: usuarios
-- Almacena las credenciales y perfiles de todos los usuarios del sistema.

CREATE TABLE auth_service.usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dni             VARCHAR(20) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    telefono        VARCHAR(20),
    rol             VARCHAR(20) NOT NULL DEFAULT 'PACIENTE'
                    CHECK (rol IN ('PACIENTE', 'MEDICO', 'ADMIN')),
    reset_token     VARCHAR(255),
    reset_token_expira TIMESTAMP WITH TIME ZONE,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE auth_service.usuarios IS 'Usuarios del sistema (pacientes, médicos, admins)';
COMMENT ON COLUMN auth_service.usuarios.rol IS 'PACIENTE | MEDICO | ADMIN';

-- Índices adicionales para búsquedas frecuentes
CREATE INDEX idx_usuarios_email ON auth_service.usuarios(email);
CREATE INDEX idx_usuarios_dni ON auth_service.usuarios(dni);
CREATE INDEX idx_usuarios_rol ON auth_service.usuarios(rol);

-- =============================================================================
-- 3. SCHEMA: appointment_service — Microservicio de Citas
-- =============================================================================

-- Tabla: especialidades
-- Catálogo de especialidades médicas.

CREATE TABLE appointment_service.especialidades (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(100) NOT NULL UNIQUE,
    activo          BOOLEAN NOT NULL DEFAULT true,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE appointment_service.especialidades IS 'Especialidades médicas disponibles';

-- Tabla: medicos
-- Perfil médico vinculado a un usuario del auth_service.

CREATE TABLE appointment_service.medicos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL UNIQUE,
    nombre_usuario  VARCHAR(100) NOT NULL UNIQUE,
    especialidad_id UUID NOT NULL,
    turno           VARCHAR(20) NOT NULL DEFAULT 'MANANA'
                    CHECK (turno IN ('MANANA', 'TARDE')),
    activo          BOOLEAN NOT NULL DEFAULT true,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en  TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- FK cross-schema: un médico debe existir como usuario
    CONSTRAINT fk_medicos_usuario
        FOREIGN KEY (usuario_id) REFERENCES auth_service.usuarios(id),

    -- FK intra-schema: especialidad debe existir
    CONSTRAINT fk_medicos_especialidad
        FOREIGN KEY (especialidad_id) REFERENCES appointment_service.especialidades(id)
);

COMMENT ON TABLE appointment_service.medicos IS 'Perfiles médicos vinculados a usuarios del auth_service';
COMMENT ON COLUMN appointment_service.medicos.usuario_id IS 'FK cross-schema → auth_service.usuarios.id';

CREATE INDEX idx_medicos_especialidad ON appointment_service.medicos(especialidad_id);
CREATE INDEX idx_medicos_activo ON appointment_service.medicos(activo);

-- Tabla: horarios_medico
-- Franjas horarias de atención por médico y día de semana.

CREATE TABLE appointment_service.horarios_medico (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medico_id       UUID NOT NULL,
    dia_semana      INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL,
    duracion_slot   INTEGER NOT NULL DEFAULT 30,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_horarios_medico
        FOREIGN KEY (medico_id) REFERENCES appointment_service.medicos(id) ON DELETE CASCADE,

    -- Evita slots duplicados para el mismo médico/día/hora
    CONSTRAINT uq_horarios_medico_slot UNIQUE (medico_id, dia_semana, hora_inicio)
);

COMMENT ON TABLE appointment_service.horarios_medico IS 'Horarios de atención por médico';

CREATE INDEX idx_horarios_medico ON appointment_service.horarios_medico(medico_id);

-- Tabla: citas
-- Reservas de citas médicas.

CREATE TABLE appointment_service.citas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id     UUID NOT NULL,
    medico_id       UUID NOT NULL,
    fecha_hora      TIMESTAMP WITH TIME ZONE NOT NULL,
    estado          VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA'
                    CHECK (estado IN ('CONFIRMADA', 'EN_ATENCION', 'COMPLETADA', 'CANCELADA')),
    tipo_reserva    VARCHAR(20) NOT NULL DEFAULT 'MANUAL'
                    CHECK (tipo_reserva IN ('MANUAL', 'AUTOMATICA')),
    motivo          TEXT,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en  TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- FK cross-schema: paciente debe ser un usuario válido
    CONSTRAINT fk_citas_paciente
        FOREIGN KEY (paciente_id) REFERENCES auth_service.usuarios(id),

    -- FK intra-schema: médico debe existir
    CONSTRAINT fk_citas_medico
        FOREIGN KEY (medico_id) REFERENCES appointment_service.medicos(id),

    -- Un médico solo puede tener una cita a la misma hora
    CONSTRAINT uq_citas_medico_fecha UNIQUE (medico_id, fecha_hora)
);

COMMENT ON TABLE appointment_service.citas IS 'Citas médicas agendadas';
COMMENT ON COLUMN appointment_service.citas.paciente_id IS 'FK cross-schema → auth_service.usuarios.id';

CREATE INDEX idx_citas_medico_fecha ON appointment_service.citas(medico_id, fecha_hora);
CREATE INDEX idx_citas_paciente_fecha ON appointment_service.citas(paciente_id, fecha_hora);
CREATE INDEX idx_citas_estado ON appointment_service.citas(estado);

-- =============================================================================
-- 4. SCHEMA: file_service — Microservicio de Archivos
-- =============================================================================

-- Tabla: archivos
-- Registro de archivos subidos a Supabase Storage (S3).

CREATE TABLE file_service.archivos (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propietario_servicio  VARCHAR(50) NOT NULL,
    propietario_recurso_id UUID NOT NULL,
    bucket                VARCHAR(100) NOT NULL,
    key_s3                VARCHAR(500) NOT NULL UNIQUE,
    nombre_original       VARCHAR(255) NOT NULL,
    mime_type             VARCHAR(100) NOT NULL,
    tamano_bytes          INTEGER NOT NULL,
    subido_en             TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE file_service.archivos IS 'Archivos subidos a Supabase Storage';
COMMENT ON COLUMN file_service.archivos.propietario_servicio IS 'Servicio dueño del archivo (ej: clinical-service)';

CREATE INDEX idx_archivos_servicio ON file_service.archivos(propietario_servicio);
CREATE INDEX idx_archivos_recurso ON file_service.archivos(propietario_recurso_id);

-- =============================================================================
-- 5. SCHEMA: clinical_service — Microservicio Clínico + OCR-Service
-- =============================================================================
-- NOTA: Este schema es COMPARTIDO entre clinical-service y ocr-service.
-- Las tablas: ordenes_analisis, analisis_resultados, analisis_grupos, analisis_items
-- son accedidas por AMBOS servicios. clinical-service es el dueño del schema y
-- gestiona las migraciones. ocr-service solo genera su cliente Prisma (generate)
-- pero NUNCA ejecuta migraciones (migrate) sobre este schema.
-- =============================================================================

-- Tabla: catalogo_medicamentos
-- Catálogo maestro de medicamentos disponibles para recetar.

CREATE TABLE clinical_service.catalogo_medicamentos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(255) NOT NULL UNIQUE,
    activo          BOOLEAN NOT NULL DEFAULT true,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE clinical_service.catalogo_medicamentos IS 'Catálogo de medicamentos';

-- Tabla: consultas
-- Registro de consultas médicas, vinculadas a citas, médicos y pacientes.

CREATE TABLE clinical_service.consultas (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id       UUID NOT NULL,
    medico_id         UUID NOT NULL,
    cita_id           UUID,
    estado            VARCHAR(20) NOT NULL DEFAULT 'ACTIVA'
                      CHECK (estado IN ('ACTIVA', 'FINALIZADA')),
    motivo_consulta   TEXT,
    diagnostico       TEXT,
    notas             TEXT,
    fecha_inicio      TIMESTAMP WITH TIME ZONE DEFAULT now(),
    fecha_fin         TIMESTAMP WITH TIME ZONE,
    creado_en         TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en    TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- FK cross-schema: paciente debe ser un usuario válido
    CONSTRAINT fk_consultas_paciente
        FOREIGN KEY (paciente_id) REFERENCES auth_service.usuarios(id),

    -- FK cross-schema: médico debe existir en appointment_service
    CONSTRAINT fk_consultas_medico
        FOREIGN KEY (medico_id) REFERENCES appointment_service.medicos(id),

    -- FK cross-schema: cita opcional vinculada a appointment_service
    CONSTRAINT fk_consultas_cita
        FOREIGN KEY (cita_id) REFERENCES appointment_service.citas(id)
);

COMMENT ON TABLE clinical_service.consultas IS 'Consultas médicas realizadas';
COMMENT ON COLUMN clinical_service.consultas.paciente_id IS 'FK cross-schema → auth_service.usuarios.id';
COMMENT ON COLUMN clinical_service.consultas.medico_id IS 'FK cross-schema → appointment_service.medicos.id';
COMMENT ON COLUMN clinical_service.consultas.cita_id IS 'FK cross-schema opcional → appointment_service.citas.id';

CREATE INDEX idx_consultas_paciente ON clinical_service.consultas(paciente_id);
CREATE INDEX idx_consultas_medico ON clinical_service.consultas(medico_id);
CREATE INDEX idx_consultas_cita ON clinical_service.consultas(cita_id);
CREATE INDEX idx_consultas_estado ON clinical_service.consultas(estado);

-- Tabla: ordenes_analisis
-- Órdenes de análisis clínico emitidas dentro de una consulta.
-- COMPARTIDA con ocr-service: clinical-service CREA las órdenes,
-- ocr-service las LEE y actualiza el campo analisis_resultado_id.

CREATE TABLE clinical_service.ordenes_analisis (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consulta_id             UUID NOT NULL,
    tipo_analisis           VARCHAR(100) NOT NULL,
    especialidad            VARCHAR(100),
    descripcion             TEXT,
    estado                  VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                            CHECK (estado IN ('PENDIENTE', 'COMPLETADA')),
    resultado               TEXT,
    archivo_id              UUID,
    analisis_resultado_id   UUID UNIQUE,
    creado_en               TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en          TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_ordenes_consulta
        FOREIGN KEY (consulta_id) REFERENCES clinical_service.consultas(id) ON DELETE CASCADE,

    -- FK cross-schema: archivo opcional vinculado a file_service
    CONSTRAINT fk_ordenes_archivo
        FOREIGN KEY (archivo_id) REFERENCES file_service.archivos(id)
);

COMMENT ON TABLE clinical_service.ordenes_analisis IS 'Órdenes de análisis clínico';
COMMENT ON COLUMN clinical_service.ordenes_analisis.archivo_id IS 'FK cross-schema opcional → file_service.archivos.id';

CREATE INDEX idx_ordenes_consulta ON clinical_service.ordenes_analisis(consulta_id);
CREATE INDEX idx_ordenes_estado ON clinical_service.ordenes_analisis(estado);

-- Tabla: analisis_resultados
-- Resultados de análisis procesados (incluyendo por OCR).
-- COMPARTIDA con ocr-service: ocr-service CREA los registros tras procesar
-- el PDF. clinical-service los LEE para mostrar en el historial del paciente.

CREATE TABLE clinical_service.analisis_resultados (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_analisis_id         UUID UNIQUE,
    paciente_id               UUID NOT NULL,
    archivo_id                UUID NOT NULL UNIQUE,
    consulta_id               UUID,
    tipo_analisis             VARCHAR(50) NOT NULL
                              CHECK (tipo_analisis IN ('SANGRE', 'ORINA', 'HECES')),
    resultado_id_original     VARCHAR(100),
    laboratorio               VARCHAR(200),
    medico_solicitante        VARCHAR(200),
    fecha_toma                DATE,
    hora_toma                 TIME,
    fecha_resultado           DATE,
    datos_muestra             JSONB,
    paciente_nombre_ocr       VARCHAR(200),
    paciente_id_ocr           VARCHAR(50),
    paciente_fecha_nacimiento DATE,
    paciente_sexo             VARCHAR(20),
    paciente_edad             INTEGER,
    estado_ocr                VARCHAR(20) NOT NULL DEFAULT 'PROCESANDO'
                              CHECK (estado_ocr IN ('PROCESANDO', 'COMPLETADO', 'ERROR')),
    error_ocr                 TEXT,
    creado_en                 TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en            TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- FK intra-schema: orden de análisis opcional
    CONSTRAINT fk_analisis_resultados_orden
        FOREIGN KEY (orden_analisis_id) REFERENCES clinical_service.ordenes_analisis(id),

    -- FK cross-schema: paciente debe ser un usuario válido
    CONSTRAINT fk_analisis_resultados_paciente
        FOREIGN KEY (paciente_id) REFERENCES auth_service.usuarios(id),

    -- FK cross-schema: archivo debe existir en file_service
    CONSTRAINT fk_analisis_resultados_archivo
        FOREIGN KEY (archivo_id) REFERENCES file_service.archivos(id)
);

COMMENT ON TABLE clinical_service.analisis_resultados IS 'Resultados de análisis clínicos procesados por OCR';
COMMENT ON COLUMN clinical_service.analisis_resultados.paciente_id IS 'FK cross-schema → auth_service.usuarios.id';
COMMENT ON COLUMN clinical_service.analisis_resultados.archivo_id IS 'FK cross-schema → file_service.archivos.id';

CREATE INDEX idx_analisis_resultados_paciente ON clinical_service.analisis_resultados(paciente_id);
CREATE INDEX idx_analisis_resultados_estado ON clinical_service.analisis_resultados(estado_ocr);

-- Tabla: analisis_grupos
-- Grupos de parámetros dentro de un resultado de análisis.
-- COMPARTIDA con ocr-service: ocr-service CREA los grupos detectados.

CREATE TABLE clinical_service.analisis_grupos (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analisis_resultado_id UUID NOT NULL,
    nombre_grupo          VARCHAR(200) NOT NULL,
    orden                 INTEGER NOT NULL DEFAULT 0,
    creado_en             TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_analisis_grupos_resultado
        FOREIGN KEY (analisis_resultado_id) REFERENCES clinical_service.analisis_resultados(id) ON DELETE CASCADE
);

COMMENT ON TABLE clinical_service.analisis_grupos IS 'Grupos de parámetros de un análisis';

CREATE INDEX idx_analisis_grupos_resultado ON clinical_service.analisis_grupos(analisis_resultado_id);

-- Tabla: analisis_items
-- Parámetros individuales de un grupo de análisis.
-- COMPARTIDA con ocr-service: ocr-service CREA los items con los valores extraídos.

CREATE TABLE clinical_service.analisis_items (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id          UUID NOT NULL,
    nombre            VARCHAR(200) NOT NULL,
    valor             VARCHAR(200) NOT NULL,
    unidad            VARCHAR(50),
    rango_min         VARCHAR(50),
    rango_max         VARCHAR(50),
    rango_referencia  VARCHAR(200),
    estado            VARCHAR(50),
    nota              TEXT,
    orden             INTEGER NOT NULL DEFAULT 0,
    creado_en         TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_analisis_items_grupo
        FOREIGN KEY (grupo_id) REFERENCES clinical_service.analisis_grupos(id) ON DELETE CASCADE
);

COMMENT ON TABLE clinical_service.analisis_items IS 'Parámetros individuales de un análisis';

CREATE INDEX idx_analisis_items_grupo ON clinical_service.analisis_items(grupo_id);

-- Tabla: medicamentos
-- Medicamentos recetados dentro de una consulta.

CREATE TABLE clinical_service.medicamentos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consulta_id     UUID NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    dias            INTEGER NOT NULL DEFAULT 0,
    frecuencia      VARCHAR(100) NOT NULL,
    creado_en       TIMESTAMP WITH TIME ZONE DEFAULT now(),
    actualizado_en  TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_medicamentos_consulta
        FOREIGN KEY (consulta_id) REFERENCES clinical_service.consultas(id) ON DELETE CASCADE
);

COMMENT ON TABLE clinical_service.medicamentos IS 'Medicamentos recetados en una consulta';

CREATE INDEX idx_medicamentos_consulta ON clinical_service.medicamentos(consulta_id);

-- =============================================================================
-- 6. FUNCIONES AUXILIARES (Triggers para updated_at)
-- =============================================================================

-- Función genérica para actualizar la columna updated_at automáticamente

CREATE OR REPLACE FUNCTION clinical_service.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auth_service.usuarios
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON auth_service.usuarios
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para appointment_service.especialidades
CREATE TRIGGER trg_especialidades_updated_at
    BEFORE UPDATE ON appointment_service.especialidades
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para appointment_service.medicos
CREATE TRIGGER trg_medicos_updated_at
    BEFORE UPDATE ON appointment_service.medicos
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para appointment_service.citas
CREATE TRIGGER trg_citas_updated_at
    BEFORE UPDATE ON appointment_service.citas
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para clinical_service.consultas
CREATE TRIGGER trg_consultas_updated_at
    BEFORE UPDATE ON clinical_service.consultas
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para clinical_service.ordenes_analisis
CREATE TRIGGER trg_ordenes_analisis_updated_at
    BEFORE UPDATE ON clinical_service.ordenes_analisis
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para clinical_service.analisis_resultados
CREATE TRIGGER trg_analisis_resultados_updated_at
    BEFORE UPDATE ON clinical_service.analisis_resultados
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- Trigger para clinical_service.medicamentos
CREATE TRIGGER trg_medicamentos_updated_at
    BEFORE UPDATE ON clinical_service.medicamentos
    FOR EACH ROW EXECUTE FUNCTION clinical_service.set_updated_at();

-- =============================================================================
-- 7. VERIFICACIÓN FINAL (Comentarios y validaciones)
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Esquema físico de Clínica X creado exitosamente.';
    RAISE NOTICE '   Schemas: auth_service, appointment_service, clinical_service, file_service';
    RAISE NOTICE '   Foreign Keys: reales, incluyendo cross-schema';
    RAISE NOTICE '   Triggers: updated_at automático para todas las tablas modificables';
END $$;
