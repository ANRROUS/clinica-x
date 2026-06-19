import { fileURLToPath } from 'node:url';
import * as fs from 'fs';
import * as path from 'path';
import { THRESHOLDS, getStatus, getStatusIcon } from '../config/thresholds.js';
import { LighthouseResult, PageSpeedResult, ConsolidatedReport } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '../../reports');

async function generateReport() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const timestamp = new Date().toISOString();
  const lighthouseResults = loadLighthouseResults();
  const pagespeedResults = loadPageSpeedResults();

  const report: ConsolidatedReport = {
    fecha: timestamp,
    frontendUrl: process.env.FRONTEND_URL ?? 'https://clinica-x.up.railway.app',
    resumen: {
      totalUrls: lighthouseResults.length,
      publicas: lighthouseResults.filter(r => r.type === 'public').length,
      protegidas: lighthouseResults.filter(r => r.type === 'protected').length,
    },
    thresholds: Object.fromEntries(
      Object.entries(THRESHOLDS).map(([key, t]) => [key, { good: t.good, needsWork: t.needsWork, unit: t.unit }])
    ),
    lighthouseResults,
    pagespeedResults,
    cumplimiento: calculateCumplimiento(lighthouseResults),
    observaciones: generateObservaciones(lighthouseResults, pagespeedResults),
  };

  // JSON
  const jsonPath = path.join(REPORTS_DIR, 'usabilidad-reporte.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Markdown
  const md = generateMarkdown(report);
  const mdPath = path.join(REPORTS_DIR, 'usabilidad-reporte.md');
  fs.writeFileSync(mdPath, md, 'utf-8');

  // HTML
  const html = generateHtml(report);
  const htmlPath = path.join(REPORTS_DIR, 'usabilidad-reporte.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');

  console.log(`\n📄 Reportes generados:`);
  console.log(`   JSON: ${jsonPath}`);
  console.log(`   Markdown: ${mdPath}`);
  console.log(`   HTML: ${htmlPath}`);
  console.log(`\n📊 Reporte consolidado completado.\n`);
}

function loadLighthouseResults(): LighthouseResult[] {
  const lighthouseDir = path.join(REPORTS_DIR, 'lighthouse');
  if (!fs.existsSync(lighthouseDir)) return [];

  const files = fs.readdirSync(lighthouseDir).filter(f => f.endsWith('-results-') || f.startsWith('lighthouse-results-'));
  for (const file of files) {
    if (file.startsWith('lighthouse-results-')) {
      const content = fs.readFileSync(path.join(lighthouseDir, file), 'utf-8');
      return JSON.parse(content);
    }
  }

  // Try individual JSON files
  const jsonFiles = fs.readdirSync(lighthouseDir).filter(f => f.endsWith('.json') && !f.startsWith('lighthouse-results'));
  const results: LighthouseResult[] = [];
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(lighthouseDir, file), 'utf-8');
      const json = JSON.parse(content);
      // Convert Lighthouse JSON to LighthouseResult
      const categories = json.categories ?? {};
      const audits = json.audits ?? {};
      results.push({
        id: file.replace('.json', ''),
        name: json.finalUrl?.split('/').pop() ?? file,
        url: json.finalUrl ?? '',
        type: 'public',
        hu: [],
        rf: [],
        description: '',
        performance: categories.performance?.score ?? 0,
        accessibility: categories.accessibility?.score ?? 0,
        bestPractices: categories['best-practices']?.score ?? 0,
        lcp: audits['largest-contentful-paint']?.numericValue ?? 0,
        fcp: audits['first-contentful-paint']?.numericValue ?? 0,
        ttfb: audits['server-response-time']?.numericValue ?? 0,
        cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
        inp: audits['interaction-to-next-paint']?.numericValue ?? 0,
        si: audits['speed-index']?.numericValue ?? 0,
        screenshotPath: '',
        reportHtmlPath: path.join(lighthouseDir, file.replace('.json', '.html')),
        reportJsonPath: path.join(lighthouseDir, file),
      });
    } catch {
      // Skip invalid JSON files
    }
  }

  return results;
}

function loadPageSpeedResults(): PageSpeedResult[] {
  const pagespeedDir = path.join(REPORTS_DIR, 'pagespeed');
  if (!fs.existsSync(pagespeedDir)) return [];

  const resultsFile = path.join(pagespeedDir, 'pagespeed-results.json');
  if (fs.existsSync(resultsFile)) {
    const content = fs.readFileSync(resultsFile, 'utf-8');
    return JSON.parse(content);
  }

  // Try individual files
  const jsonFiles = fs.readdirSync(pagespeedDir).filter(f => f.endsWith('.json') && !f.startsWith('pagespeed-results'));
  const results: PageSpeedResult[] = [];
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(pagespeedDir, file), 'utf-8');
      results.push(JSON.parse(content));
    } catch {
      // Skip
    }
  }
  return results;
}

function calculateCumplimiento(results: LighthouseResult[]): ConsolidatedReport['cumplimiento'] {
  const metrics = [
    { key: 'performance', threshold: THRESHOLDS.performance, getValue: (r: LighthouseResult) => r.performance * 100, unit: 'score' },
    { key: 'accessibility', threshold: THRESHOLDS.accessibility, getValue: (r: LighthouseResult) => r.accessibility * 100, unit: 'score' },
    { key: 'lcp', threshold: THRESHOLDS.lcp, getValue: (r: LighthouseResult) => r.lcp, unit: 'ms' },
    { key: 'fcp', threshold: THRESHOLDS.fcp, getValue: (r: LighthouseResult) => r.fcp, unit: 'ms' },
    { key: 'ttfb', threshold: THRESHOLDS.ttfb, getValue: (r: LighthouseResult) => r.ttfb, unit: 'ms' },
    { key: 'cls', threshold: THRESHOLDS.cls, getValue: (r: LighthouseResult) => r.cls, unit: '' },
    { key: 'inp', threshold: THRESHOLDS.inp, getValue: (r: LighthouseResult) => r.inp, unit: 'ms' },
    { key: 'si', threshold: THRESHOLDS.si, getValue: (r: LighthouseResult) => r.si, unit: 'ms' },
  ];

  const total = results.filter(r => !r.error).length || 1;

  return metrics.map(m => {
    const urlsQueCumplen = results.filter(r => {
      if (r.error) return false;
      const value = m.getValue(r);
      return m.unit === 'score' ? value >= m.threshold.good : value <= m.threshold.good;
    }).length;

    return {
      metrica: m.threshold.metric,
      urlsQueCumplen,
      totalUrls: results.filter(r => !r.error).length,
      porcentaje: Math.round((urlsQueCumplen / total) * 100),
      estado: urlsQueCumplen === results.filter(r => !r.error).length ? 'CUMPLE' : urlsQueCumplen > 0 ? 'PARCIAL' : 'NO_CUMPLE',
    };
  });
}

function generateObservaciones(lr: LighthouseResult[], pr: PageSpeedResult[]): string[] {
  const obs: string[] = [];

  const failedPerf = lr.filter(r => !r.error && r.performance < THRESHOLDS.performance.good);
  if (failedPerf.length > 0) {
    obs.push(`1. **Performance Score < 90** en ${failedPerf.length}/${lr.filter(r => !r.error).length} páginas. Causa probable: cold starts de Railway, imágenes no optimizadas, JS blocking.`);
    obs.push(`   - Recomendación: Implementar lazy loading, optimizar imágenes (WebP/AVIF), reducir JavaScript no utilizado.`);
  }

  const failedLcp = lr.filter(r => !r.error && r.lcp > THRESHOLDS.lcp.good);
  if (failedLcp.length > 0) {
    obs.push(`2. **LCP > 2500ms** en ${failedLcp.length} páginas. El contenido más grande tarda demasiado en renderizarse.`);
    obs.push(`   - Recomendación: Priorizar el contenido above-the-fold, preconectar orígenes críticos, optimizar fuentes.`);
  }

  const failedTtfb = lr.filter(r => !r.error && r.ttfb > THRESHOLDS.ttfb.good);
  if (failedTtfb.length > 0) {
    obs.push(`3. **TTFB > 800ms** en ${failedTtfb.length} páginas. El servidor responde lento.`);
    obs.push(`   - Recomendación: Implementar health checks en Railway, usar instancias always-on, habilitar CDN.`);
  }

  const failedA11y = lr.filter(r => !r.error && r.accessibility < THRESHOLDS.accessibility.good);
  if (failedA11y.length > 0) {
    obs.push(`4. **Accessibility Score < 90** en ${failedA11y.length} páginas. Falta etiquetas ARIA y contraste adecuado.`);
    obs.push(`   - Recomendación: Agregar aria-labels a formularios, mejorar contraste de colores, verificar navegación por teclado.`);
  }

  const protectedUrls = lr.filter(r => r.type === 'protected');
  if (protectedUrls.length > 0) {
    obs.push(`5. **Páginas protegidas**: Se_AUDtaron ${protectedUrls.length} páginas autenticadas inyectando tokens JWT vía puppeteer/Lighthouse.`);
  }

  return obs;
}

function generateMarkdown(report: ConsolidatedReport): string {
  const { fecha, resumen, lighthouseResults, pagespeedResults, cumplimiento, observaciones } = report;

  let md = `# Reporte de Usabilidad — Clínica X\n\n`;
  md += `**Fecha de ejecución:** ${fecha}\n`;
  md += `**URL base:** ${report.frontendUrl}\n\n`;

  md += `## Resumen Ejecutivo\n\n`;
  md += `| Indicador | Valor |\n`;
  md += `|-----------|-------|\n`;
  md += `| URLs auditadas | ${resumen.totalUrls} (${resumen.publicas} públicas, ${resumen.protegidas} protegidas) |\n\n`;

  // Lighthouse results table
  md += `## Resultados Lighthouse\n\n`;
  md += `| ID | Página | Tipo | Performance | Accessibility | LCP | FCP | TTFB | CLS | INP |\n`;
  md += `|----|--------|------|-------------|---------------|-----|-----|------|-----|-----|\n`;

  for (const r of lighthouseResults) {
    const icon = r.type === 'protected' ? '🔒' : '🌐';
    const pStatus = getStatusIcon(getStatus(r.performance * 100, THRESHOLDS.performance));
    const aStatus = getStatusIcon(getStatus(r.accessibility * 100, THRESHOLDS.accessibility));
    const lcpStatus = getStatusIcon(getStatus(r.lcp, THRESHOLDS.lcp));
    const fcpStatus = getStatusIcon(getStatus(r.fcp, THRESHOLDS.fcp));
    const ttfbStatus = getStatusIcon(getStatus(r.ttfb, THRESHOLDS.ttfb));
    const clsStatus = getStatusIcon(getStatus(r.cls, THRESHOLDS.cls));
    const inpStatus = getStatusIcon(getStatus(r.inp, THRESHOLDS.inp));

    md += `| ${r.id} | ${icon} ${r.name} | ${r.type} | ${(r.performance * 100).toFixed(0)} ${pStatus} | ${(r.accessibility * 100).toFixed(0)} ${aStatus} | ${Math.round(r.lcp)}ms ${lcpStatus} | ${Math.round(r.fcp)}ms ${fcpStatus} | ${Math.round(r.ttfb)}ms ${ttfbStatus} | ${r.cls.toFixed(3)} ${clsStatus} | ${Math.round(r.inp)}ms ${inpStatus} |\n`;
  }

  // PageSpeed results (if available)
  if (pagespeedResults.length > 0) {
    md += `\n## Resultados PageSpeed Insights\n\n`;
    md += `### Mobile\n\n`;
    md += `| ID | Página | Performance | LCP | FCP | CLS | INP | TTFB |\n`;
    md += `|----|--------|-------------|-----|-----|-----|-----|------|\n`;
    for (const r of pagespeedResults) {
      md += `| ${r.id} | ${r.name} | ${(r.mobilePerformance * 100).toFixed(0)} | ${Math.round(r.mobileLcp)}ms | ${Math.round(r.mobileFcp)}ms | ${r.mobileCls.toFixed(3)} | ${Math.round(r.mobileInp)}ms | ${Math.round(r.mobileTtfb)}ms |\n`;
    }

    md += `\n### Desktop\n\n`;
    md += `| ID | Página | Performance | LCP | FCP | CLS | INP | TTFB |\n`;
    md += `|----|--------|-------------|-----|-----|-----|-----|------|\n`;
    for (const r of pagespeedResults) {
      md += `| ${r.id} | ${r.name} | ${(r.desktopPerformance * 100).toFixed(0)} | ${Math.round(r.desktopLcp)}ms | ${Math.round(r.desktopFcp)}ms | ${r.desktopCls.toFixed(3)} | ${Math.round(r.desktopInp)}ms | ${Math.round(r.desktopTtfb)}ms |\n`;
    }
  }

  // Cumplimiento
  md += `\n## Nivel de Cumplimiento\n\n`;
  md += `| Métrica | Umbral "Bueno" | URLs que cumplen | % Cumplimiento | Estado |\n`;
  md += `|---------|----------------|-----------------|---------------|--------|\n`;
  for (const c of cumplimiento) {
    const icon = c.estado === 'CUMPLE' ? '✅' : c.estado === 'PARCIAL' ? '🟡' : '❌';
    md += `| ${c.metrica} | ${c.metrica.includes('Score') ? '≥ 90' : '≤ ' + c.metrica.includes('Cumulative') ? '0.1' : ''} | ${c.urlsQueCumplen}/${c.totalUrls} | ${c.porcentaje}% | ${icon} ${c.estado} |\n`;
  }

  // Observaciones
  if (observaciones.length > 0) {
    md += `\n## Observaciones y Recomendaciones\n\n`;
    for (const obs of observaciones) {
      md += `${obs}\n\n`;
    }
  }

  md += `---\n\n`;
  md += `*Generado automáticamente por el framework de usabilidad de Clínica X con Lighthouse y PageSpeed Insights.*\n`;

  return md;
}

function generateHtml(report: ConsolidatedReport): string {
  const { fecha, resumen, lighthouseResults, pagespeedResults, cumplimiento, observaciones } = report;

  let html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reporte de Usabilidad — Clínica X</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
  h1 { color: #1a365d; border-bottom: 3px solid #3182ce; padding-bottom: 10px; }
  h2 { color: #2d3748; margin-top: 30px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  th { background: #2d3748; color: white; padding: 10px; text-align: left; }
  td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
  tr:hover { background: #f7fafc; }
  .good { color: #38a169; font-weight: bold; }
  .needs-work { color: #d69e2e; font-weight: bold; }
  .poor { color: #e53e3e; font-weight: bold; }
  .protected { background: #fff3cd; }
  .summary-card { display: inline-block; background: white; padding: 15px; margin: 5px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; min-width: 150px; }
  .summary-card h3 { margin: 0; font-size: 24px; }
  .summary-card p { margin: 5px 0 0; color: #718096; }
  .obs { background: #fff3cd; border-left: 4px solid #d69e2e; padding: 10px; margin: 10px 0; }
</style>
</head>
<body>
<h1>🧪 Reporte de Usabilidad — Clínica X</h1>
<p><strong>Fecha:</strong> ${fecha} | <strong>URL:</strong> ${report.frontendUrl} | <strong>URLs:</strong> ${resumen.totalUrls} (${resumen.publicas} públicas, ${resumen.protegidas} protegidas)</p>

<div>
  <div class="summary-card"><h3>${resumen.totalUrls}</h3><p>URLs Auditadas</p></div>
  <div class="summary-card"><h3>${resumen.publicas}</h3><p>Públicas</p></div>
  <div class="summary-card"><h3>${resumen.protegidas}</h3><p>Protegidas</p></div>
</div>

<h2>📊 Resultados Lighthouse</h2>
<table>
<tr><th>ID</th><th>Página</th><th>Tipo</th><th>Perf</th><th>A11y</th><th>LCP</th><th>FCP</th><th>TTFB</th><th>CLS</th><th>INP</th></tr>`;

  for (const r of lighthouseResults) {
    const icon = r.type === 'protected' ? '🔒' : '🌐';
    const pClass = r.performance >= 0.9 ? 'good' : r.performance >= 0.5 ? 'needs-work' : 'poor';
    const aClass = r.accessibility >= 0.9 ? 'good' : r.accessibility >= 0.7 ? 'needs-work' : 'poor';
    html += `<tr${r.type === 'protected' ? ' class="protected"' : ''}><td>${r.id}</td><td>${icon} ${r.name}</td><td>${r.type}</td><td class="${pClass}">${(r.performance * 100).toFixed(0)}</td><td class="${aClass}">${(r.accessibility * 100).toFixed(0)}</td><td>${Math.round(r.lcp)}ms</td><td>${Math.round(r.fcp)}ms</td><td>${Math.round(r.ttfb)}ms</td><td>${r.cls.toFixed(3)}</td><td>${Math.round(r.inp)}ms</td></tr>`;
  }

  html += `</table>`;

  if (pagespeedResults.length > 0) {
    html += `<h2>📱 Resultados PageSpeed Insights (Mobile)</h2>
<table><tr><th>ID</th><th>Página</th><th>Performance</th><th>LCP</th><th>FCP</th><th>CLS</th><th>INP</th><th>TTFB</th></tr>`;
    for (const r of pagespeedResults) {
      html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${(r.mobilePerformance * 100).toFixed(0)}</td><td>${Math.round(r.mobileLcp)}ms</td><td>${Math.round(r.mobileFcp)}ms</td><td>${r.mobileCls.toFixed(3)}</td><td>${Math.round(r.mobileInp)}ms</td><td>${Math.round(r.mobileTtfb)}ms</td></tr>`;
    }
    html += `</table>`;
  }

  html += `<h2>✅ Nivel de Cumplimiento</h2>
<table><tr><th>Métrica</th><th>Umbral</th><th>URLs que cumplen</th><th>%</th><th>Estado</th></tr>`;
  for (const c of cumplimiento) {
    const icon = c.estado === 'CUMPLE' ? '✅' : c.estado === 'PARCIAL' ? '🟡' : '❌';
    html += `<tr><td>${c.metrica}</td><td>${c.metrica.includes('Score') ? '≥ 90' : '≤ threshold'}</td><td>${c.urlsQueCumplen}/${c.totalUrls}</td><td>${c.porcentaje}%</td><td>${icon} ${c.estado}</td></tr>`;
  }
  html += `</table>`;

  if (observaciones.length > 0) {
    html += `<h2>📝 Observaciones y Recomendaciones</h2>`;
    for (const obs of observaciones) {
      html += `<div class="obs">${obs}</div>`;
    }
  }

  html += `
<hr>
<p><em>Generado automáticamente por el framework de usabilidad de Clínica X con Lighthouse y PageSpeed Insights.</em></p>
</body></html>`;

  return html;
}

export { generateReport };

const isMain = process.argv[1]?.endsWith('generate-report.ts');
if (isMain) {
  generateReport().catch((err) => {
    console.error('Error generando reporte:', err);
    process.exit(1);
  });
}