const fs = require('fs');
const path = require('path');

const GATEWAY = 'http://localhost:8080';

async function login() {
  const r = await fetch(`${GATEWAY}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: '87654321', email: 'paciente_test@clinicax.com', password: 'Paciente123!' }),
  });
  const d = await r.json();
  return d.data.token;
}

async function main() {
  const token = await login();
  console.log('Login paciente OK');

  // Crear archivo dummy
  const dummyPath = path.join(require('os').tmpdir(), 'test-upload.txt');
  fs.writeFileSync(dummyPath, 'Este es un archivo de prueba para Fase 4 E2E');

  // Subir archivo
  const form = new (require('url').URLSearchParams || FormData)();
  // Node 18+ tiene FormData nativo, pero para archivos necesitamos Blob
  // Usamos fetch con FormData nativo si existe
  const FormData = globalThis.FormData || require('form-data');
  const Blob = globalThis.Blob;

  const fd = new FormData();
  if (Blob) {
    fd.append('file', new Blob(['Contenido de prueba']), 'test-file.txt');
  } else {
    fd.append('file', fs.createReadStream(dummyPath));
  }
  fd.append('propietarioServicio', 'clinical-service');
  fd.append('propietarioRecursoId', '00000000-0000-0000-0000-000000000000');

  console.log('Subiendo archivo...');
  const res = await fetch(`${GATEWAY}/api/files/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    const archivoId = data.data.id;
    console.log(`Archivo creado: ${archivoId}`);

    // Obtener signed URL
    console.log('Obteniendo signed URL...');
    const urlRes = await fetch(`${GATEWAY}/api/files/${archivoId}/signed-url`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const urlData = await urlRes.json();
    console.log('Signed URL status:', urlRes.status);
    console.log('Signed URL data:', JSON.stringify(urlData, null, 2));

    // Eliminar archivo
    console.log('Eliminando archivo...');
    const delRes = await fetch(`${GATEWAY}/api/files/${archivoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const delData = await delRes.json();
    console.log('Delete status:', delRes.status);
    console.log('Delete data:', JSON.stringify(delData, null, 2));
  }

  fs.unlinkSync(dummyPath);
}

main().catch(console.error);
