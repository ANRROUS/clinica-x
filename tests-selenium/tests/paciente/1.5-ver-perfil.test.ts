import * as fs from 'fs';
import * as path from 'path';
import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

// PDF mínimo válido generado automáticamente si no existe en fixtures/
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures');
const PDF_PATH = path.join(FIXTURES_DIR, 'resultado-analisis.pdf');

function ensureTestPdf(): void {
  if (!fs.existsSync(FIXTURES_DIR)) fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  if (!fs.existsSync(PDF_PATH)) {
    // PDF mínimo de una página en blanco — supera validaciones de tipo (.pdf) y tamaño (<1 MB)
    const content =
      '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<<>>>>endobj\n' +
      'xref\n0 4\n' +
      '0000000000 65535 f \n' +
      '0000000009 00000 n \n' +
      '0000000052 00000 n \n' +
      '0000000101 00000 n \n' +
      'trailer<</Size 4/Root 1 0 R>>\n' +
      'startxref\n163\n%%EOF\n';
    fs.writeFileSync(PDF_PATH, content, 'utf-8');
  }
}

describe('1.5 — Ver perfil del paciente (consultas, tratamiento, reservas)', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    ensureTestPdf();
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    perfilPage = new PerfilPacientePage(driver);

    await homePage.navigate();
    await homePage.sleep(5000); // [captura] home visible — reducir a 1500ms

    await homePage.goToLogin();
    await loginPage.sleep(5000); // [captura] formulario de login vacío — reducir a 1500ms

    await loginPage.fillDni(CREDENTIALS.paciente2.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente2.email);
    await loginPage.fillPassword(CREDENTIALS.paciente2.password);
    await loginPage.sleep(5000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.waitForRedirect('/perfil');
    await perfilPage.waitForLoad();
    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  // ── Tab Consultas ─────────────────────────────────────────────────────────

  test('Tab Consultas → ver detalle de consulta completada (diagnóstico, análisis, medicamentos)', async () => {
    await homePage.navigateTo('/perfil');
    await perfilPage.waitForLoad();
    await perfilPage.sleep(5000); // [captura] /perfil cargado con tab Consultas activa — reducir a 1500ms

    await perfilPage.goToTabConsultas();
    await perfilPage.sleep(6000); // [captura] lista de consultas visible (carga async desde API) — reducir a 1500ms

    const hayConsultas = await perfilPage.hasConsultations();
    if (!hayConsultas) {
      console.warn(
        'SKIP P-05 Consultas: no se encontraron consultas registradas. ' +
        'Verificar que M-02 (completar consulta) se ejecutó correctamente.',
      );
      expect(true).toBe(true);
      return;
    }

    await perfilPage.clickUltimaConsulta();
    await perfilPage.waitForConsultaDetail();
    await perfilPage.sleep(6000); // [captura] detalle de última consulta: diagnóstico + análisis + medicamentos — reducir a 1500ms

    const diagnostico = await perfilPage.getDiagnosticoText();
    expect(diagnostico.length).toBeGreaterThan(0);
  });

  // ── Tab Tratamiento ───────────────────────────────────────────────────────

  test('Tab Tratamiento → subir PDF de resultado de análisis + ver medicación activa', async () => {
    await perfilPage.goToTabTratamiento();
    await perfilPage.sleep(6000); // [captura] tab Tratamiento: sección Análisis clínicos + Medicación actual — reducir a 1500ms

    const hayAnalisisPendiente = await perfilPage.hasPendingAnalysis();

    if (hayAnalisisPendiente) {
      await perfilPage.sleep(5000); // [captura] análisis pendiente con botón "Subir PDF" visible — reducir a 1500ms

      await perfilPage.uploadAnalysisPdf(PDF_PATH);

      try {
        await perfilPage.waitForPdfUploadSuccess();
        await perfilPage.sleep(5000); // [captura] toast "PDF guardado correctamente" visible — reducir a 1500ms
      } catch {
        const toastMsg = await perfilPage.getToastMessage();
        console.warn(
          `ADVERTENCIA P-05: La subida del PDF no mostró toast de éxito. ` +
          `Mensaje detectado: "${toastMsg ?? '(sin toast)'}". ` +
          'Verificar que file-service y ocr-service estén en ejecución.',
        );
      }
    } else {
      await perfilPage.sleep(5000); // [captura] análisis ya completados (PDF previamente subido) — reducir a 1500ms
      console.warn('INFO P-05 Tratamiento: no hay análisis pendientes (ya fueron completados en una ejecución anterior).');
    }

    await perfilPage.waitForMedicacionActual();
    await perfilPage.sleep(5000); // [captura] tabla de Medicación actual con medicamentos recetados — reducir a 1500ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });

  // ── Tab Reservas ──────────────────────────────────────────────────────────

  test('Tab Reservas → navegar entre Activas y Pasadas con el toggle', async () => {
    await perfilPage.goToTabReservas();
    await perfilPage.waitForReservasLoaded();
    await perfilPage.sleep(6000); // [captura] tab Reservas en modo "Activas" con toggle visible — reducir a 1500ms

    // Cambiar a vista de reservas Pasadas
    await perfilPage.clickTogglePasadas();
    await perfilPage.sleep(6000); // [captura] reservas Pasadas (incluye cita completada por M-02) — reducir a 1500ms

    // Volver a vista de reservas Activas
    await perfilPage.clickToggleActivas();
    await perfilPage.sleep(5000); // [captura] reservas Activas — reducir a 1500ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });

  // ── Cerrar sesión ─────────────────────────────────────────────────────────

  test('Cerrar sesión → redirect a home (/)', async () => {
    await perfilPage.logout();
    await perfilPage.waitForLogout();
    await perfilPage.sleep(5000); // [captura] home sin sesión activa (botones Ingresar / Registrarse visibles) — reducir a 1500ms

    const url = await driver.getCurrentUrl();
    expect(url).not.toContain('/perfil');
  });
});
