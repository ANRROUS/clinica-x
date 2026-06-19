import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class PerfilPacientePage extends BasePage {
  // ─── Carga ────────────────────────────────────────────────────────────────

  async waitForLoad(): Promise<void> {
    await this.waitForElement(
      By.xpath("//nav//button[contains(text(),'Consultas')]"), 12000,
    );
  }

  // ─── Navegación de tabs ───────────────────────────────────────────────────

  async goToTabReservas(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//nav//button[contains(text(),'Reservas')]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.waitForElement(
      By.xpath("//*[contains(text(),'Reservas') and contains(@class,'font-bold')]"), 8000,
    );
  }

  async goToTabConsultas(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//nav//button[contains(text(),'Consultas')]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.sleep(2000);
  }

  // ─── Tab Reservas ─────────────────────────────────────────────────────────

  // Espera a que la lista de citas activas cargue (o aparezca el estado vacío).
  async waitForActiveAppointments(): Promise<void> {
    await this.sleep(3000);
  }

  async hasActiveAppointments(): Promise<boolean> {
    const btns = await this.driver.findElements(
      By.xpath("//button[normalize-space(text())='Reprogramar' and not(@disabled)]"),
    );
    return btns.length > 0;
  }

  async getActiveAppointmentCount(): Promise<number> {
    const btns = await this.driver.findElements(
      By.xpath("//button[normalize-space(text())='Cancelar' and not(@disabled)]"),
    );
    return btns.length;
  }

  // ── Cancelar ──────────────────────────────────────────────────────────────

  async clickCancelarPrimeraCita(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[normalize-space(text())='Cancelar' and not(@disabled)]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForCancelModal(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(),'Cancelar cita')]"), 8000,
    );
  }

  async clickConfirmarCancelar(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(),'Sí, cancelar')]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // ── Reprogramar ───────────────────────────────────────────────────────────

  async clickReprogramarPrimeraCita(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[normalize-space(text())='Reprogramar' and not(@disabled)]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForRescheduleModal(): Promise<void> {
    await this.waitForElement(
      By.xpath("//h3[contains(text(),'Reprogramar cita')]"), 8000,
    );
  }

  // Inyecta la fecha en el date input controlado por React dentro del modal.
  // dateStr: formato YYYY-MM-DD
  async selectRescheduleDate(dateStr: string): Promise<void> {
    const input = await this.waitForElement(
      By.css('div.fixed input[type="date"]'), 8000,
    );
    await this.driver.executeScript(
      'var s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;' +
      's.call(arguments[0], arguments[1]);' +
      'arguments[0].dispatchEvent(new Event("input",{bubbles:true}));' +
      'arguments[0].dispatchEvent(new Event("change",{bubbles:true}));',
      input,
      dateStr,
    );
    await this.sleep(2500); // esperar carga de slots desde la API
  }

  async hasRescheduleSlots(): Promise<boolean> {
    const slots = await this.driver.findElements(
      By.xpath("//div[contains(@class,'fixed')]//button[contains(text(),':')]"),
    );
    return slots.length > 0;
  }

  async selectFirstRescheduleSlot(): Promise<void> {
    await this.waitForElement(
      By.xpath("//div[contains(@class,'fixed')]//button[contains(text(),':')]"), 8000,
    );
    const slots = await this.driver.findElements(
      By.xpath("//div[contains(@class,'fixed')]//button[contains(text(),':')]"),
    );
    if (slots.length === 0) throw new Error('No hay slots disponibles para reprogramar');
    await this.driver.executeScript('arguments[0].click();', slots[0]);
  }

  async clickConfirmarReprogramar(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//div[contains(@class,'fixed')]//button[normalize-space(text())='Confirmar']"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // ─── Tab Tratamiento ─────────────────────────────────────────────────────

  async goToTabTratamiento(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//nav//button[contains(text(),'Tratamiento')]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.waitForElement(
      By.xpath("//*[contains(text(),'Análisis clínicos')]"), 10000,
    );
  }

  async hasPendingAnalysis(): Promise<boolean> {
    const btns = await this.driver.findElements(
      By.xpath("//button[contains(text(),'Subir PDF')]"),
    );
    return btns.length > 0;
  }

  async uploadAnalysisPdf(pdfAbsPath: string): Promise<void> {
    // 1. Prevenir que el input abra el diálogo nativo del OS al hacer click
    await this.driver.executeScript(
      "var i = document.querySelector('input[type=\"file\"][accept=\".pdf\"]');" +
      "i._originalClick = i.click; i.click = function(){};",
    );

    // 2. Clickear "Subir PDF" → setea selectedOrder en el estado de React (dialog no se abre)
    const subePdfBtn = await this.waitForClickable(
      By.xpath("//button[contains(text(),'Subir PDF')]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', subePdfBtn);
    await this.sleep(600); // esperar que React actualice selectedOrder

    // 3. Hacer visible el input y enviar el archivo vía sendKeys (dispara onChange)
    const input = await this.driver.findElement(
      By.css('input[type="file"][accept=".pdf"]'),
    );
    await this.driver.executeScript(
      'arguments[0].style.display="block"; arguments[0].style.opacity="1";',
      input,
    );
    await input.sendKeys(pdfAbsPath);
    await this.driver.executeScript('arguments[0].style.display="none";', input);
  }

  async waitForPdfUploadSuccess(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[@data-sonner-toast and contains(.,'PDF guardado')]"), 15000,
    );
  }

  async waitForMedicacionActual(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(),'Medicación actual')]"), 8000,
    );
  }

  // ─── Tab Consultas ────────────────────────────────────────────────────────

  async hasConsultations(): Promise<boolean> {
    // normalize-space(.) sobre el <p> concatena todos sus nodos de texto (JSX genera múltiples)
    const items = await this.driver.findElements(
      By.xpath("//button[.//p[starts-with(normalize-space(.),'Consulta')]]"),
    );
    return items.length > 0;
  }

  async getConsultationCount(): Promise<number> {
    const items = await this.driver.findElements(
      By.xpath("//button[.//p[starts-with(normalize-space(.),'Consulta')]]"),
    );
    return items.length;
  }

  async clickPrimeraConsulta(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[.//p[normalize-space(.)='Consulta 1']]"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.sleep(2000);
  }

  async clickUltimaConsulta(): Promise<void> {
    await this.waitForElement(
      By.xpath("//button[.//p[starts-with(normalize-space(.),'Consulta')]]"), 8000,
    );
    const btns = await this.driver.findElements(
      By.xpath("//button[.//p[starts-with(normalize-space(.),'Consulta')]]"),
    );
    if (btns.length === 0) throw new Error('No se encontraron consultas en el historial');
    await this.driver.executeScript('arguments[0].click();', btns[btns.length - 1]);
    await this.sleep(2000);
  }

  async waitForConsultaDetail(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(),'Tu Diagnóstico')]"), 10000,
    );
  }

  async getDiagnosticoText(): Promise<string> {
    const container = await this.waitForElement(
      By.xpath("//*[contains(text(),'Tu Diagnóstico')]/following::div[contains(@class,'rounded-xl')][1]"),
      8000,
    );
    return container.getText();
  }

  // ─── Tab Reservas (toggle Activas/Pasadas) ───────────────────────────────

  async waitForReservasLoaded(): Promise<void> {
    await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Reservas']"), 8000,
    );
  }

  async clickTogglePasadas(): Promise<void> {
    // El toggle muestra aria-label con el estado actual; clickear cuando es 'Activas' → cambia a Pasadas
    const btn = await this.waitForClickable(
      By.xpath("//button[@aria-label='Activas']"), 5000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.sleep(800);
  }

  async clickToggleActivas(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[@aria-label='Pasadas']"), 5000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.sleep(800);
  }

  // ─── Cerrar sesión ────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[normalize-space(text())='Cerrar sesión']"), 8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForLogout(): Promise<void> {
    await this.waitForUrl('/', 10000);
  }

  // ─── Utilidades ───────────────────────────────────────────────────────────

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }
}
