#!/usr/bin/env node
/**
 * ============================================================================
 * test-resilience.mjs — Pruebas de Confiabilidad ISO 25010
 * ============================================================================
 * Verifica los 4 patrones de resiliencia implementados en el API Gateway.
 *
 * Uso:
 *   node scripts/test-resilience.mjs <número>
 *
 *   1  Rate Limiting        → 310 peticiones, verifica bloqueo en la 301ª
 *   2  Fault Injection      → 6 peticiones a servicio caído, verifica OPEN
 *   3  Recovery             → espera 30 s, verifica HALF_OPEN → CLOSED
 *   4  Bulkhead             → 10 peticiones simultáneas con límite en 5
 *                             (requiere gateway corriendo con BULKHEAD_MAX=5)
 *
 * Pre-requisito: API Gateway corriendo en http://localhost:3000
 * ============================================================================
 */

const GATEWAY = 'http://localhost:8080';

// ── Utilidades ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function request(path, options = {}) {
  try {
    const res = await fetch(`${GATEWAY}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    let body;
    try { body = await res.json(); } catch { body = {}; }
    return { status: res.status, body };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

function line(char = '─', len = 60) {
  console.log(char.repeat(len));
}

function printResult(label, result) {
  const icon = result.status === 0 ? '✗' : result.status < 300 ? '✓' : '⚠';
  console.log(`  ${icon} [${result.status}] ${label}`);
  if (result.body?.error) {
    console.log(`      codigo : ${result.body.error.codigo}`);
    console.log(`      mensaje: ${result.body.error.mensaje}`);
  }
}

// ── TEST 1 — Rate Limiting ───────────────────────────────────────────────────

async function testRateLimiting() {
  line();
  console.log('TEST 1 — Rate Limiting');
  line();
  console.log('Pre-requisito: reinicia el gateway con límite reducido:');
  console.log('  RATE_LIMIT_MAX=10 pnpm dev   (en services/api-gateway)\n');
  console.log('Disparando 15 peticiones SIMULTÁNEAS (límite: RATE_LIMIT_MAX=10)...\n');

  const TOTAL = 15;
  const promises = Array.from({ length: TOTAL }, (_, i) =>
    request('/health').then((r) => ({ idx: i + 1, ...r })),
  );
  const resultados = await Promise.all(promises);

  const bloqueadas = resultados.filter((r) => r.status === 429);
  const pasaron    = resultados.filter((r) => r.status !== 429);

  resultados.sort((a, b) => a.idx - b.idx).forEach((r) => {
    const tag = r.status === 429 ? '🔴 BLOQUEADA (429)' : '🟢 OK            ';
    const cod = r.body?.error?.codigo ?? '';
    console.log(`  ${tag} petición #${r.idx}${cod ? ' — ' + cod : ''}`);
  });

  if (bloqueadas.length > 0) {
    console.log('\nEjemplo de respuesta bloqueada:');
    console.log(JSON.stringify(bloqueadas[0].body, null, 2));
  }

  console.log();
  line('─', 60);
  console.log('RESULTADO:');
  console.log(`  Total enviadas              : ${TOTAL}`);
  console.log(`  Pasaron (dentro del límite) : ${pasaron.length}`);
  console.log(`  Bloqueadas (429)            : ${bloqueadas.length}`);
  console.log(`  Código de error             : ${bloqueadas[0]?.body?.error?.codigo ?? '—'}`);

  if (bloqueadas.length > 0) {
    console.log('\n  ✓ Rate Limiting funciona correctamente.');
  } else {
    console.log('\n  ✗ Ninguna bloqueada. ¿Reiniciaste el gateway con RATE_LIMIT_MAX=10?');
  }
}

// ── TEST 2 — Circuit Breaker: Fault Injection ────────────────────────────────

async function testFaultInjection() {
  line();
  console.log('TEST 2 — Circuit Breaker: Fault Injection');
  line();
  console.log('Usa ocr-service (puerto 3004) — si no está corriendo, el proxy falla');
  console.log('inmediatamente con ECONNREFUSED sin necesidad de detener nada.\n');
  console.log('Ruta pública: POST /api/ocr/process → proxeada a ocr-service\n');

  // POST /api/ocr/process es ruta pública y apunta al ocr-service (puerto 3004).
  // Si ocr-service no está corriendo → ECONNREFUSED → recordFailure → circuito se abre.
  // Ventaja: no hay que detener ningún servicio manualmente.
  const ROUTE = '/api/ocr/process';
  const BODY = JSON.stringify({ test: true });

  console.log('Enviando 6 peticiones al servicio caído...\n');

  const resultados = [];
  for (let i = 1; i <= 6; i++) {
    const r = await request(ROUTE, { method: 'POST', body: BODY });
    resultados.push(r);
    printResult(`Intento ${i}`, r);
    await sleep(300);
  }

  console.log();
  console.log('Estado de los circuitos en GET /health:');
  const health = await request('/health');
  const circuits = health.body?.data?.circuits ?? {};
  console.log(JSON.stringify(circuits, null, 2));

  const abiertos = Object.entries(circuits).filter(([, s]) => s === 'OPEN');
  console.log();
  line('─', 60);
  console.log('RESULTADO:');
  console.log(`  Respuestas 502 (proxy error) : ${resultados.filter(r => r.status === 502).length}`);
  console.log(`  Respuestas 503 (circuit open): ${resultados.filter(r => r.status === 503).length}`);
  console.log(`  Circuitos en OPEN            : ${abiertos.length > 0 ? abiertos.map(([s]) => s).join(', ') : 'ninguno'}`);

  if (abiertos.length > 0) {
    console.log('\n  ✓ Circuit Breaker abrió el circuito correctamente.');
    console.log('  → Ejecuta ahora el TEST 3 (espera 30 s antes de continuar).');
  } else {
    console.log('\n  ✗ Ningún circuito abrió. ¿El servicio está detenido y la ruta es correcta?');
  }
}

// ── TEST 3 — Circuit Breaker: Recovery ──────────────────────────────────────

async function testRecovery() {
  line();
  console.log('TEST 3 — Circuit Breaker: Recovery (OPEN → HALF_OPEN → CLOSED)');
  line();
  console.log('Pre-requisito: ejecutar DESPUÉS del TEST 2 con el circuito en OPEN.');
  console.log('Vuelve a iniciar el microservicio que detuviste ANTES de continuar.\n');

  // Espera 30 s para que el circuito transite OPEN → HALF_OPEN
  console.log('Esperando 30 s (recoveryTimeout) para transición OPEN → HALF_OPEN...');
  for (let i = 30; i >= 1; i--) {
    process.stdout.write(`\r  ${i}s restantes...   `);
    await sleep(1000);
  }
  console.log('\r  Tiempo completado.        \n');

  const ROUTE = '/api/ocr/process';
  const BODY = JSON.stringify({ test: true });

  console.log('Petición 1 en estado HALF_OPEN (petición de prueba):');
  const r1 = await request(ROUTE, { method: 'POST', body: BODY });
  printResult('Intento 1 (HALF_OPEN)', r1);

  console.log('\nPetición 2 (si la anterior fue exitosa, cierra el circuito):');
  const r2 = await request(ROUTE, { method: 'POST', body: BODY });
  printResult('Intento 2', r2);

  console.log('\nEstado de los circuitos en GET /health:');
  const health = await request('/health');
  const circuits = health.body?.data?.circuits ?? {};
  console.log(JSON.stringify(circuits, null, 2));

  const cerrados = Object.entries(circuits).filter(([, s]) => s === 'CLOSED');
  console.log();
  line('─', 60);
  console.log('RESULTADO:');
  console.log(`  Estado HTTP petición 1: ${r1.status}`);
  console.log(`  Estado HTTP petición 2: ${r2.status}`);
  console.log(`  Circuitos en CLOSED   : ${cerrados.length}`);

  if (cerrados.length > 0 && (r1.status < 500 || r2.status < 500)) {
    console.log('\n  ✓ Recovery exitoso: circuito volvió a CLOSED.');
  } else {
    console.log('\n  ⚠ El circuito no cerró. ¿El servicio se reinició correctamente?');
  }
}

// ── TEST 4 — Bulkhead ────────────────────────────────────────────────────────

async function testBulkhead() {
  line();
  console.log('TEST 4 — Bulkhead: Aislamiento de Concurrencia');
  line();
  console.log('Pre-requisito: reinicia el gateway con límite reducido:');
  console.log('  BULKHEAD_MAX=5 pnpm dev   (en services/api-gateway)\n');

  // Verificar que el límite está reducido consultando health
  const healthPre = await request('/health');
  const bulkheadsPre = healthPre.body?.data?.bulkheads ?? {};
  console.log('Estado inicial de bulkheads:', JSON.stringify(bulkheadsPre));

  // POST /api/auth/login es pública (no requiere JWT) y llega al bulkhead.
  // Con BULKHEAD_MAX=5 y 10 peticiones simultáneas, las 5 primeras adquieren
  // el slot y las 5 restantes encuentran el pool lleno.
  const ROUTE = '/api/auth/login';
  const LOGIN_BODY = JSON.stringify({ email: 'test@test.com', password: 'test' });
  const TOTAL = 10;
  console.log(`\nDisparando ${TOTAL} peticiones SIMULTÁNEAS (límite actual: BULKHEAD_MAX=5)...\n`);

  // Todas las promesas se crean antes de que cualquiera resuelva
  const promises = Array.from({ length: TOTAL }, (_, i) =>
    request(ROUTE, { method: 'POST', body: LOGIN_BODY }).then((r) => ({ idx: i + 1, ...r })),
  );
  const resultados = await Promise.all(promises);

  const saturadas = resultados.filter((r) => r.body?.error?.codigo === 'SERVICIO_SATURADO');
  const pasaron   = resultados.filter((r) => r.body?.error?.codigo !== 'SERVICIO_SATURADO');

  resultados.sort((a, b) => a.idx - b.idx).forEach((r) => {
    const tag = r.body?.error?.codigo === 'SERVICIO_SATURADO' ? '🔴 BLOQUEADA' : '🟢 OK      ';
    console.log(`  ${tag} [${r.status}] petición #${r.idx}`);
  });

  if (saturadas.length > 0) {
    console.log('\nEjemplo de respuesta bloqueada:');
    console.log(JSON.stringify(saturadas[0].body, null, 2));
  }

  console.log();
  const healthPost = await request('/health');
  const bulkheadsPost = healthPost.body?.data?.bulkheads ?? {};
  console.log('Estado de bulkheads tras las peticiones:', JSON.stringify(bulkheadsPost));

  console.log();
  line('─', 60);
  console.log('RESULTADO:');
  console.log(`  Total enviadas                  : ${TOTAL}`);
  console.log(`  Pasaron al upstream             : ${pasaron.length}`);
  console.log(`  Bloqueadas (SERVICIO_SATURADO)  : ${saturadas.length}`);

  if (saturadas.length > 0) {
    console.log('\n  ✓ Bulkhead aisló la sobrecarga correctamente.');
  } else {
    console.log('\n  ✗ Ninguna bloqueada. ¿Reiniciaste el gateway con BULKHEAD_MAX=5?');
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const test = process.argv[2];
console.log();
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   Pruebas de Confiabilidad — ISO 25010 Fiabilidad        ║');
console.log('║   Clínica-X API Gateway · http://localhost:8080          ║');
console.log('╚══════════════════════════════════════════════════════════╝');

switch (test) {
  case '1': await testRateLimiting();   break;
  case '2': await testFaultInjection(); break;
  case '3': await testRecovery();       break;
  case '4': await testBulkhead();       break;
  default:
    console.log('\nUso: node scripts/test-resilience.mjs <número>\n');
    console.log('  1  Rate Limiting   — 310 peticiones, verifica bloqueo en la 301ª');
    console.log('  2  Fault Injection — 6 peticiones a servicio caído, circuito OPEN');
    console.log('  3  Recovery        — espera 30 s, verifica HALF_OPEN → CLOSED');
    console.log('  4  Bulkhead        — 10 simultáneas con BULKHEAD_MAX=5\n');
    console.log('Orden recomendado: 1 → 4 → 2 → 3');
}
console.log();
