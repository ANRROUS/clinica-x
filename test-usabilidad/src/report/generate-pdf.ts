import { fileURLToPath } from 'node:url';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '../../reports');

async function generatePdf() {
  const htmlPath = path.join(REPORTS_DIR, 'usabilidad-reporte.html');
  const pdfPath = path.join(REPORTS_DIR, 'usabilidad-reporte.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ No se encontró usabilidad-reporte.html. Ejecuta "pnpm report" primero.');
    process.exit(1);
  }

  console.log('📄 Generando PDF desde reporte HTML...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    });

    console.log(`✅ PDF generado: ${pdfPath}`);
  } catch (err) {
    console.error('❌ Error generando PDF:', (err as Error).message);
    console.log('   Asegúrate de que puppeteer está instalado: pnpm add -D puppeteer');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { generatePdf };

const isMain = process.argv[1]?.endsWith('generate-pdf.ts');
if (isMain) {
  generatePdf().catch((err) => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
}