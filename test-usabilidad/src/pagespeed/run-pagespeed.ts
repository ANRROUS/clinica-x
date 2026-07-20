import { fileURLToPath } from 'node:url';
import * as fs from 'fs';
import * as path from 'path';
import { AUDIT_URLS, FRONTEND_URL } from '../config/urls.js';
import { PageSpeedResult } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
};

const API_KEY = process.env.PAGESPEED_API_KEY ?? '';
const REPORTS_DIR = path.resolve(__dirname, '../../reports/pagespeed');

async function runPageSpeed() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const results: PageSpeedResult[] = [];
  const strategies: ('mobile' | 'desktop')[] = ['mobile', 'desktop'];

  console.log(`\n📊 Iniciando auditorías PageSpeed Insights para ${AUDIT_URLS.length} URLs...\n`);

  if (!API_KEY) {
    console.error('❌ PAGESPEED_API_KEY no configurada. Saltando PageSpeed Insights.');
    return results;
  }

  for (const urlConfig of AUDIT_URLS) {
    // PageSpeed Insights solo funciona con URLs públicas
    // Para rutas protegidas, usamos la URL base de login como proxy
    const effectiveUrl = urlConfig.type === 'protected'
      ? `${FRONTEND_URL}${urlConfig.path}` // Intentamos auditarla (puede que redirija a login)
      : `${FRONTEND_URL}${urlConfig.path}`;

    console.log(`\n📡 Auditando PageSpeed: ${urlConfig.id} - ${urlConfig.name}`);
    console.log(`   URL: ${effectiveUrl}`);

    const result: PageSpeedResult = {
      id: urlConfig.id,
      name: urlConfig.name,
      url: effectiveUrl,
      type: urlConfig.type,
      role: urlConfig.role,
      hu: urlConfig.hu,
      rf: urlConfig.rf,
      description: urlConfig.description,
      mobilePerformance: 0,
      mobileLcp: 0,
      mobileFcp: 0,
      mobileCls: 0,
      mobileInp: 0,
      mobileTtfb: 0,
      desktopPerformance: 0,
      desktopLcp: 0,
      desktopFcp: 0,
      desktopCls: 0,
      desktopInp: 0,
      desktopTtfb: 0,
    };

    for (const strategy of strategies) {
      try {
        const encodedUrl = encodeURIComponent(effectiveUrl);
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${API_KEY}&strategy=${strategy}&category=performance`;

        console.log(`   📱 Consultando ${strategy}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45_000);
        let response: Response;
        try {
          response = await fetch(apiUrl, { signal: controller.signal });
        } finally {
          clearTimeout(timeout);
        }

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const waitSec = retryAfter ? parseInt(retryAfter, 10) : 30;
            console.error(`   ⚠️ Cuota PageSpeed agotada (429). Esperando ${waitSec}s...`);
            console.error(`   ❌ Error ${strategy}: 429 - ${errorText.substring(0, 150)}`);
            await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
          } else {
            console.error(`   ❌ Error ${strategy}: ${response.status} - ${errorText.substring(0, 200)}`);
          }
          continue;
        }

        const data = await response.json() as any;
        const lighthouseResult = data.lighthouseResult;
        const categories = lighthouseResult?.categories ?? {};
        const audits = lighthouseResult?.audits ?? {};

        const perf = categories.performance?.score ?? 0;
        const lcp = audits['largest-contentful-paint']?.numericValue ?? 0;
        const fcp = audits['first-contentful-paint']?.numericValue ?? 0;
        const cls = audits['cumulative-layout-shift']?.numericValue ?? 0;
        const inp = audits['interaction-to-next-paint']?.numericValue ?? 0;
        const ttfb = audits['server-response-time']?.numericValue ?? audits['ttfb']?.numericValue ?? 0;

        if (strategy === 'mobile') {
          result.mobilePerformance = perf;
          result.mobileLcp = lcp;
          result.mobileFcp = fcp;
          result.mobileCls = cls;
          result.mobileInp = inp;
          result.mobileTtfb = ttfb;
        } else {
          result.desktopPerformance = perf;
          result.desktopLcp = lcp;
          result.desktopFcp = fcp;
          result.desktopCls = cls;
          result.desktopInp = inp;
          result.desktopTtfb = ttfb;
        }

        console.log(`   ✅ ${strategy}: Performance ${(perf * 100).toFixed(0)} | LCP ${Math.round(lcp)}ms | FCP ${Math.round(fcp)}ms`);

        // Rate limit: esperar 3 segundos entre requests para no agotar la cuota gratuita
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          console.error(`   ⏱️ Timeout ${strategy}: la petición superó 45s, saltando...`);
        } else {
          console.error(`   ❌ Error ${strategy}: ${(err as Error).message}`);
        }
      }
    }

    results.push(result);

    // Save individual result
    const safeId = urlConfig.id.replace(/[^a-zA-Z0-9]/g, '_');
    const resultPath = path.join(REPORTS_DIR, `${safeId}.json`);
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  }

  const resultsPath = path.join(REPORTS_DIR, 'pagespeed-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Resultados PageSpeed guardados en: ${resultsPath}`);
  console.log(`   ${results.filter(r => r.mobilePerformance > 0 || r.desktopPerformance > 0).length}/${results.length} URLs auditadas exitosamente\n`);

  return results;
}

export { runPageSpeed };

const isMain = process.argv[1]?.endsWith('run-pagespeed.ts');
if (isMain) {
  runPageSpeed().catch((err) => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
}