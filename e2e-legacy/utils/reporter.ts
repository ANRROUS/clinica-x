import * as fs from 'fs';
import * as path from 'path';

export interface MetricasCaso {
  id: string;
  nombre: string;
  estado: 'PASSED' | 'FAILED';
  metricas: {
    ttfb: number;
    fcp: number;
    lcp: number;
    cls: number;
  };
  screenshots: string[];
  observaciones: string;
  duracionMs: number;
}

export interface ReporteUsabilidad {
  fecha: string;
  resumen: {
    total: number;
    pasados: number;
    fallidos: number;
  };
  umbrales: {
    ttfb: number;
    fcp: number;
    lcp: number;
    cls: number;
  };
  promedios: {
    ttfb: number;
    fcp: number;
    lcp: number;
    cls: number;
  };
  casos: MetricasCaso[];
}

const TEMP_DIR = path.resolve(__dirname, '../reports/.temp-casos');

function ensureTempDir(): void {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

export function registrarCaso(caso: MetricasCaso): void {
  ensureTempDir();
  const filePath = path.join(TEMP_DIR, `${caso.id}_${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(caso, null, 2), 'utf-8');
}

export function generarReportes(outputDir: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Leer todos los casos del directorio temporal
  let casos: MetricasCaso[] = [];
  if (fs.existsSync(TEMP_DIR)) {
    const files = fs.readdirSync(TEMP_DIR).filter((f) => f.endsWith('.json'));
    casos = files.map((f) => {
      const content = fs.readFileSync(path.join(TEMP_DIR, f), 'utf-8');
      return JSON.parse(content) as MetricasCaso;
    });
  }

  const pasados = casos.filter((c) => c.estado === 'PASSED').length;
  const fallidos = casos.filter((c) => c.estado === 'FAILED').length;

  const promedios =
    casos.length > 0
      ? {
          ttfb: casos.reduce((s, c) => s + c.metricas.ttfb, 0) / casos.length,
          fcp: casos.reduce((s, c) => s + c.metricas.fcp, 0) / casos.length,
          lcp: casos.reduce((s, c) => s + c.metricas.lcp, 0) / casos.length,
          cls: casos.reduce((s, c) => s + c.metricas.cls, 0) / casos.length,
        }
      : { ttfb: 0, fcp: 0, lcp: 0, cls: 0 };

  const reporte: ReporteUsabilidad = {
    fecha: new Date().toISOString(),
    resumen: { total: casos.length, pasados, fallidos },
    umbrales: { ttfb: 800, fcp: 1800, lcp: 2500, cls: 0.1 },
    promedios: {
      ttfb: Math.round(promedios.ttfb),
      fcp: Math.round(promedios.fcp),
      lcp: Math.round(promedios.lcp),
      cls: parseFloat(promedios.cls.toFixed(4)),
    },
    casos,
  };

  // JSON
  fs.writeFileSync(
    path.join(outputDir, 'usabilidad-reporte.json'),
    JSON.stringify(reporte, null, 2),
    'utf-8',
  );

  // Markdown
  const md = generarMarkdown(reporte);
  fs.writeFileSync(path.join(outputDir, 'usabilidad-reporte.md'), md, 'utf-8');

  // Limpiar temp
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

function generarMarkdown(reporte: ReporteUsabilidad): string {
  const { fecha, resumen, umbrales, promedios, casos } = reporte;
  const estadoGeneral = resumen.fallidos === 0 ? '✅ CUMPLE' : '❌ NO CUMPLE';

  let md = `# Reporte de Usabilidad — Clínica X\n\n`;
  md += `**Fecha de ejecución:** ${fecha}\n\n`;

  md += `## Resumen Ejecutivo\n\n`;
  md += `| Indicador | Valor | Estado |\n`;
  md += `|-----------|-------|--------|\n`;
  md += `| Tests ejecutados | ${resumen.total} | — |\n`;
  md += `| Tests pasados | ${resumen.pasados} | ✅ |\n`;
  md += `| Tests fallidos | ${resumen.fallidos} | ${resumen.fallidos > 0 ? '❌' : '✅'} |\n`;
  md += `| Tasa de Éxito (TSR) | ${((resumen.pasados / Math.max(resumen.total, 1)) * 100).toFixed(1)}% | ${resumen.fallidos === 0 ? '✅' : '❌'} |\n`;
  md += `| **Conclusión general** | — | **${estadoGeneral}** |\n\n`;

  md += `## Promedios de Métricas Web Vitals\n\n`;
  md += `| Métrica | Promedio | Umbral | Estado |\n`;
  md += `|---------|----------|--------|--------|\n`;
  md += `| TTFB | ${promedios.ttfb} ms | < ${umbrales.ttfb} ms | ${promedios.ttfb <= umbrales.ttfb ? '✅' : '❌'} |\n`;
  md += `| FCP | ${promedios.fcp} ms | < ${umbrales.fcp} ms | ${promedios.fcp <= umbrales.fcp ? '✅' : '❌'} |\n`;
  md += `| LCP | ${promedios.lcp} ms | < ${umbrales.lcp} ms | ${promedios.lcp <= umbrales.lcp ? '✅' : '❌'} |\n`;
  md += `| CLS | ${promedios.cls} | < ${umbrales.cls} | ${promedios.cls <= umbrales.cls ? '✅' : '❌'} |\n\n`;

  md += `## Detalle por Caso de Prueba\n\n`;

  for (const c of casos) {
    const estadoIcono = c.estado === 'PASSED' ? '✅' : '❌';
    md += `### ${c.id}: ${c.nombre}\n\n`;
    md += `- **Estado:** ${estadoIcono} ${c.estado}\n`;
    md += `- **Duración:** ${c.duracionMs} ms\n`;
    md += `- **TTFB:** ${c.metricas.ttfb} ms ${c.metricas.ttfb <= umbrales.ttfb ? '✅' : '❌'}\n`;
    md += `- **FCP:** ${c.metricas.fcp} ms ${c.metricas.fcp <= umbrales.fcp ? '✅' : '❌'}\n`;
    md += `- **LCP:** ${c.metricas.lcp} ms ${c.metricas.lcp <= umbrales.lcp ? '✅' : '❌'}\n`;
    md += `- **CLS:** ${c.metricas.cls} ${c.metricas.cls <= umbrales.cls ? '✅' : '❌'}\n`;
    if (c.screenshots.length > 0) {
      md += `- **Screenshots:**\n`;
      for (const s of c.screenshots) {
        md += `  - \`${s}\`\n`;
      }
    }
    if (c.observaciones) {
      md += `- **Observaciones:** ${c.observaciones}\n`;
    }
    md += `\n`;
  }

  md += `---\n\n`;
  md += `*Generado automáticamente por el framework de usabilidad de Clínica X.*\n`;
  return md;
}
