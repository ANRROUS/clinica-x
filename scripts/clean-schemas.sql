-- =============================================================================
-- clean-schemas.sql — Limpia los 4 schemas de Clínica X en Postgres/Supabase
-- =============================================================================
-- ¡PELIGROSO! Esto ELIMINA todas las tablas, vistas y datos de cada schema.
-- Solo ejecutar en ambientes de desarrollo o cuando se haya respaldado.
--
-- Uso manual (psql):
--   psql "<AUTH_DIRECT_URL>" -f scripts/clean-schemas.sql
-- Uso automático (desde la raíz):
--   pnpm db:reset
-- =============================================================================

-- Cada schema se elimina con CASCADE para borrar todas las tablas internas,
-- luego se recrea vacío y listo para que Prisma aplique las migraciones.

DROP SCHEMA IF EXISTS auth_service CASCADE;
CREATE SCHEMA auth_service;

DROP SCHEMA IF EXISTS appointment_service CASCADE;
CREATE SCHEMA appointment_service;

DROP SCHEMA IF EXISTS clinical_service CASCADE;
CREATE SCHEMA clinical_service;

DROP SCHEMA IF EXISTS file_service CASCADE;
CREATE SCHEMA file_service;

DROP SCHEMA IF EXISTS chat_service CASCADE;
CREATE SCHEMA chat_service;
