import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class DoctorPacientesPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.doctorPacientes);
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────

  async waitForSidebar(): Promise<void> {
    // Esperar al menos un botón de paciente en el sidebar (carga async)
    await this.waitForElement(By.css('aside button.text-left'), 15000);
  }

  async hasActiveCita(): Promise<boolean> {
    const btns = await this.driver.findElements(
      By.xpath("//aside//button[contains(@class,'text-left') and .//*[normalize-space(text())='En consulta']]"),
    );
    return btns.length > 0;
  }

  async clickPacienteActual(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//aside//button[contains(@class,'text-left') and .//*[normalize-space(text())='En consulta']]"),
      10000,
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async clickFirstPatient(): Promise<void> {
    const btn = await this.waitForClickable(By.css('aside button.text-left'), 10000);
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // ── Detalle de paciente ───────────────────────────────────────────────────

  async waitForPatientDetail(): Promise<void> {
    await this.waitForElement(
      By.xpath("//button[normalize-space(text())='Historial']"),
      12000,
    );
  }

  async isConsultaTabEnabled(): Promise<boolean> {
    const btns = await this.driver.findElements(
      By.xpath("//button[normalize-space(text())='Consulta Actual' and not(@disabled)]"),
    );
    return btns.length > 0;
  }

  async clickConsultaTab(): Promise<void> {
    const tab = await this.waitForClickable(
      By.xpath("//button[normalize-space(text())='Consulta Actual' and not(@disabled)]"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', tab);
  }

  // ── Consulta activa ───────────────────────────────────────────────────────

  async waitForConsultaPanel(): Promise<void> {
    // Esperar el botón "Iniciar Consulta" O el textarea de diagnóstico
    await this.waitForElement(
      By.xpath("//button[normalize-space(text())='Iniciar Consulta'] | //textarea[@placeholder]"),
      12000,
    );
  }

  async needsIniciarConsulta(): Promise<boolean> {
    const btns = await this.driver.findElements(
      By.xpath("//button[normalize-space(text())='Iniciar Consulta']"),
    );
    return btns.length > 0;
  }

  async clickIniciarConsulta(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[normalize-space(text())='Iniciar Consulta']"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
    await this.waitForElement(By.css('textarea'), 8000);
  }

  async fillDiagnosis(text: string): Promise<void> {
    const area = await this.waitForElement(By.css('textarea'), 8000);
    await this.driver.executeScript(
      'var s = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;' +
      's.call(arguments[0], arguments[1]);' +
      'arguments[0].dispatchEvent(new Event("input",{bubbles:true}));',
      area, text,
    );
  }

  // ── Análisis clínico ──────────────────────────────────────────────────────

  async clickAgregarAnalisis(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//h3[normalize-space(text())='Análisis Clínico']/following::button[contains(text(),'Agregar')][1]"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async selectAnalisis(value: 'SANGRE' | 'ORINA' | 'HECES'): Promise<void> {
    const sel = await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Análisis Clínico']/following::select[1]"),
      5000,
    );
    const opt = await sel.findElement(By.css(`option[value="${value}"]`));
    await opt.click();
  }

  async confirmAgregarAnalisis(): Promise<void> {
    // Botón "Agregar" dentro del panel expandible (bg-brand-50)
    const btn = await this.waitForClickable(
      By.xpath("//div[contains(@class,'bg-brand-50')]//button[normalize-space(text())='Agregar']"),
      5000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // ── Medicamentos ──────────────────────────────────────────────────────────

  async clickAgregarMedicamento(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//h3[normalize-space(text())='Medicamentos']/following::button[contains(text(),'Agregar')][1]"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForMedicationCatalog(): Promise<void> {
    await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Medicamentos']/following::select[1]/option[not(@value='')]"),
      10000,
    );
  }

  async selectPrimerMedicamento(): Promise<void> {
    const sel = await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Medicamentos']/following::select[1]"),
      5000,
    );
    const opts = await sel.findElements(By.css('option:not([value=""])'));
    if (opts.length > 0) await opts[0].click();
  }

  async fillDias(days: string): Promise<void> {
    const input = await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Medicamentos']/following::input[@type='number'][1]"),
      5000,
    );
    await input.clear();
    await input.sendKeys(days);
  }

  async fillFrecuencia(freq: string): Promise<void> {
    const input = await this.waitForElement(
      By.xpath("//input[@placeholder='8 hrs.']"),
      5000,
    );
    await input.clear();
    await input.sendKeys(freq);
  }

  async confirmAgregarMedicamento(): Promise<void> {
    // Mismo patrón: botón "Agregar" dentro del panel expandible (bg-brand-50)
    const btn = await this.waitForClickable(
      By.xpath("//div[contains(@class,'bg-brand-50')]//button[normalize-space(text())='Agregar']"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // ── Finalizar consulta ────────────────────────────────────────────────────

  async clickFinalizarConsulta(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(),'Finalizar Consulta')]"),
      10000,
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForFinalizeModal(): Promise<void> {
    await this.waitForElement(
      By.xpath("//h3[normalize-space(text())='Finalizar consulta']"),
      8000,
    );
  }

  async confirmarFinalizacion(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//h3[normalize-space(text())='Finalizar consulta']/following::button[normalize-space(text())='Confirmar']"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }
}
