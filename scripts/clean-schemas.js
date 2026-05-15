#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Limpia los 4 schemas de Clínica X usando las URLs directas (puerto 5432)
 * declaradas en el .env raíz. Útil cuando los schemas tienen tablas previas
 * de un proyecto anterior y queremos arrancar de cero antes de ejecutar
 * `pnpm prisma:migrate:all`.
 *
 * Uso:
 *   pnpm db:reset
 *
 * Requisitos:
 *   - El .env raíz debe estar lleno
 *   - El paquete `pg` debe estar instalado en la raíz del workspace.
 *     Si no lo está, ejecuta `pnpm add -w pg` antes de correr este script.
 */

const fs = require('fs');
const path = require('path');

// Cargar .env raíz manualmente (sin depender de dotenv)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const contenido = fs.readFileSync(envPath, 'utf8');
  for (const line of contenido.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

const URLS = [
  { nombre: 'auth_service', envKey: 'AUTH_DIRECT_URL' },
  { nombre: 'appointment_service', envKey: 'APPOINTMENT_DIRECT_URL' },
  { nombre: 'clinical_service', envKey: 'CLINICAL_DIRECT_URL' },
  { nombre: 'file_service', envKey: 'FILE_DIRECT_URL' },
];

async function main() {
  let Client;
  try {
    ({ Client } = require('pg'));
  } catch {
    console.error('❌ Falta el paquete "pg". Instálalo en la raíz del workspace:');
    console.error('   pnpm add -w pg');
    process.exit(1);
  }

  for (const { nombre, envKey } of URLS) {
    const url = process.env[envKey];
    if (!url) {
      console.error(`❌ Variable ${envKey} no definida en .env`);
      process.exit(1);
    }

    const client = new Client({ connectionString: url });
    try {
      console.log(`\n🧹 Limpiando schema "${nombre}"...`);
      await client.connect();
      await client.query(`DROP SCHEMA IF EXISTS "${nombre}" CASCADE;`);
      await client.query(`CREATE SCHEMA "${nombre}";`);
      console.log(`   ✅ Schema "${nombre}" reseteado correctamente`);
    } catch (err) {
      console.error(`   ❌ Error limpiando "${nombre}":`, err.message);
      process.exit(1);
    } finally {
      await client.end();
    }
  }

  console.log('\n🎉 Todos los schemas fueron reseteados.');
  console.log('   Ahora ejecuta: pnpm prisma:migrate:all');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
