import { fileURLToPath } from 'node:url';
import * as fs from 'fs';
import * as path from 'path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { AUDIT_URLS, FRONTEND_URL } from '../config/urls.js';
import { loginAsPaciente, loginAsMedico, loginAsAdmin } from '../auth/get-token.js';
import { LighthouseResult } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const REPORTS_DIR = path.resolve(__dirname, '../../reports/lighthouse');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../../screenshots');

async function runLighthouse() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const results: LighthouseResult[] = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  console.log(`\n🔍 Iniciando auditorías Lighthouse para ${AUDIT_URLS.length} URLs...\n`);
  console.log(`   Frontend URL: ${FRONTEND_URL}\n`);

  let chrome: chromeLauncher.Chrome | null = null;

  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'] });
    const port = chrome.port;

    for (const urlConfig of AUDIT_URLS) {
      const fullUrl = `${FRONTEND_URL}${urlConfig.path}`;
      console.log(`\n📡 Auditando: ${urlConfig.id} - ${urlConfig.name} (${fullUrl})`);

      let cookies: string[] = [];
      if (urlConfig.type === 'protected' && urlConfig.role) {
        console.log(`   🔑 Obteniendo token para rol: ${urlConfig.role}`);
        try {
          const auth = await getAuthToken(urlConfig.role);
          cookies = [`token=${auth.token}`];
          console.log(`   ✅ Token obtenido exitosamente`);
        } catch (err) {
          console.error(`   ❌ Error obteniendo token: ${(err as Error).message}`);
          console.log(`   ⏩ Saltando autenticación, auditando sin login...`);
        }
      }

      try {
        const runnerResult = await lighthouse(fullUrl, {
          port,
          output: ['html', 'json'] as any,
          logLevel: 'error' as any,
          onlyCategories: ['performance', 'accessibility', 'best-practices'],
          extraHeaders: cookies.length > 0 ? { Cookie: cookies.join('; ') } : undefined,
        });

        if (!runnerResult || !runnerResult.lhr) {
          throw new Error('Lighthouse no retornó resultados');
        }

        const lhr = runnerResult.lhr;
        const categories = lhr.categories;

        const perfAudit = categories.performance?.auditRefs ?? [];
        const metrics = extractMetrics(lhr);

        const safeId = urlConfig.id.replace(/[^a-zA-Z0-9]/g, '_');
        const htmlPath = path.join(REPORTS_DIR, `${safeId}-${timestamp}.html`);
        const jsonPath = path.join(REPORTS_DIR, `${safeId}-${timestamp}.json`);
        const screenshotFilename = `${safeId}-${timestamp}.png`;
        const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotFilename);

        // Save HTML report
        if (runnerResult.report) {
          const htmlReport = Array.isArray(runnerResult.report)
            ? runnerResult.report.find(r => (r as any).toString().includes('<!DOCTYPE html>'))
            : runnerResult.report;
          if (htmlReport) {
            fs.writeFileSync(htmlPath, htmlReport.toString());
          }
          // Save JSON report
          fs.writeFileSync(jsonPath, JSON.stringify(lhr, null, 2));
        }

        // Extract screenshot
        const fullPageScreenshot = lhr.audits?.['screenshot-thumbnails']?.details?.items;
        if (fullPageScreenshot && fullPageScreenshot.length > 0) {
          const lastScreenshot = fullPageScreenshot[fullPageScreenshot.length - 1];
          if (lastScreenshot?.data) {
            const base64Data = lastScreenshot.data.replace(/^data:image\/\w+;base64,/, '');
            fs.writeFileSync(screenshotPath, Buffer.from(base64Data, 'base64'));
          }
        }

        const result: LighthouseResult = {
          id: urlConfig.id,
          name: urlConfig.name,
          url: fullUrl,
          type: urlConfig.type,
          role: urlConfig.role,
          hu: urlConfig.hu,
          rf: urlConfig.rf,
          description: urlConfig.description,
          performance: categories.performance?.score ?? 0,
          accessibility: categories.accessibility?.score ?? 0,
          bestPractices: categories['best-practices']?.score ?? 0,
          ...metrics,
          screenshotPath: fs.existsSync(screenshotPath) ? screenshotPath : '',
          reportHtmlPath: htmlPath,
          reportJsonPath: jsonPath,
        };

        results.push(result);

        console.log(`   Performance: ${(result.performance * 100).toFixed(0)}/100`);
        console.log(`   Accessibility: ${(result.accessibility * 100).toFixed(0)}/100`);
        console.log(`   LCP: ${result.lcp}ms | FCP: ${result.fcp}ms | TTFB: ${result.ttfb}ms | CLS: ${result.cls}`);
      } catch (err) {
        console.error(`   ❌ Error auditando ${urlConfig.id}: ${(err as Error).message}`);
        results.push({
          id: urlConfig.id,
          name: urlConfig.name,
          url: fullUrl,
          type: urlConfig.type,
          role: urlConfig.role,
          hu: urlConfig.hu,
          rf: urlConfig.rf,
          description: urlConfig.description,
          performance: 0,
          accessibility: 0,
          bestPractices: 0,
          lcp: 0,
          fcp: 0,
          ttfb: 0,
          cls: 0,
          inp: 0,
          si: 0,
          screenshotPath: '',
          reportHtmlPath: '',
          reportJsonPath: '',
          error: (err as Error).message,
        });
      }
    }
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }

  const resultsPath = path.join(REPORTS_DIR, `lighthouse-results-${timestamp}.json`);
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Resultados Lighthouse guardados en: ${resultsPath}`);
  console.log(`   ${results.filter(r => !r.error).length}/${results.length} URLs auditadas exitosamente\n`);

  return results;
}

function extractMetrics(lhr: any): { lcp: number; fcp: number; ttfb: number; cls: number; inp: number; si: number } {
  const audits = lhr.audits || {};
  return {
    lcp: audits['largest-contentful-paint']?.numericValue ?? 0,
    fcp: audits['first-contentful-paint']?.numericValue ?? 0,
    ttfb: audits['server-response-time']?.numericValue ?? audits['ttfb']?.numericValue ?? 0,
    cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
    inp: audits['interaction-to-next-paint']?.numericValue ?? 0,
    si: audits['speed-index']?.numericValue ?? 0,
  };
}

async function getAuthToken(role: 'paciente' | 'medico' | 'admin') {
  switch (role) {
    case 'paciente':
      return loginAsPaciente();
    case 'medico':
      return loginAsMedico();
    case 'admin':
      return loginAsAdmin();
  }
}

export { runLighthouse };

const isMain = process.argv[1]?.endsWith('run-lighthouse.ts');
if (isMain) {
  runLighthouse().catch((err) => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
}