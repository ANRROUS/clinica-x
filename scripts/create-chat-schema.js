#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'services', 'ai-service', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const vars = {};
for (const line of envContent.split(/\r?\n/)) {
  const m = line.match(/^DIRECT_URL\s*=\s*(.*)$/);
  if (m) {
    let value = m[1].trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars.DIRECT_URL = value;
  }
}

async function main() {
  const { Client } = require('pg');
  const url = vars.DIRECT_URL;
  if (!url) { console.error('DIRECT_URL not found in ai-service .env'); process.exit(1); }
  const baseUrl = url.replace('?schema=clinical_service&sslmode=require', '');
  const client = new Client({ connectionString: baseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  
  await client.query('DROP SCHEMA IF EXISTS chat_service CASCADE');
  await client.query('CREATE SCHEMA chat_service');
  console.log('✅ Schema chat_service created');

  await client.query(`
    CREATE TABLE chat_service.chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      paciente_id UUID NOT NULL,
      medico_id UUID NOT NULL,
      consulta_id UUID,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      tool_used VARCHAR(100),
      metadata JSONB,
      creado_en TIMESTAMP DEFAULT now()
    )
  `);
  console.log('✅ Table chat_messages created');

  await client.query('CREATE INDEX idx_chat_messages_paciente ON chat_service.chat_messages(paciente_id)');
  await client.query('CREATE INDEX idx_chat_messages_medico ON chat_service.chat_messages(medico_id)');
  await client.query('CREATE INDEX idx_chat_messages_consulta ON chat_service.chat_messages(consulta_id)');
  await client.query('CREATE INDEX idx_chat_messages_paciente_medico ON chat_service.chat_messages(paciente_id, medico_id)');
  console.log('✅ Indexes created');

  await client.end();
  console.log('🎉 chat_service schema ready!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
