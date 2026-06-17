import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class DoctorPacientesPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.doctorPacientes);
  }

  async waitForPacienteActual(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(), 'Paciente Actual') or contains(text(), 'paciente actual')]"),
      15000,
    );
  }

  async clickPacienteActual(): Promise<void> {
    // Click en el card del paciente actual (primer elemento clickeable del panel)
    const card = await this.waitForClickable(
      By.xpath("//*[contains(text(), 'Paciente Actual')]/following-sibling::*//button | //*[contains(@class, 'paciente') and contains(@class, 'card')]"),
      12000,
    );
    await card.click();
  }

  async waitForConsultaActualTab(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(), 'Consulta Actual')]"),
      12000,
    );
  }

  async clickAgregarAnalisis(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Agregar') and ancestor::*[contains(text(), 'Análisis') or contains(text(), 'Analisis')]]"),
      10000,
    );
    await btn.click();
  }

  async fillAnalisis(nombre: string): Promise<void> {
    const input = await this.waitForElement(
      By.xpath("//input[@placeholder[contains(., 'análisis') or contains(., 'Análisis') or contains(., 'nombre')]]"),
      8000,
    );
    await input.clear();
    await input.sendKeys(nombre);
  }

  async confirmAnalisis(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Agregar') or contains(text(), 'Confirmar') or contains(text(), 'Guardar')]"),
      8000,
    );
    await btn.click();
  }

  async clickAgregarMedicamento(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Agregar') and ancestor::*[contains(text(), 'Medicamento') or contains(text(), 'Medicación') or contains(text(), 'Medicacion')]]"),
      10000,
    );
    await btn.click();
  }

  async fillMedicamento(nombre: string, dias: string, frecuencia: string): Promise<void> {
    // La nueva fila de medicamento tiene inputs inline
    const inputs = await this.driver.findElements(By.css('tbody tr:last-child input'));
    if (inputs.length >= 3) {
      await inputs[0].clear();
      await inputs[0].sendKeys(nombre);
      await inputs[1].clear();
      await inputs[1].sendKeys(dias);
      await inputs[2].clear();
      await inputs[2].sendKeys(frecuencia);
    }
  }

  async clickFinalizarConsulta(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Finalizar')]"),
      10000,
    );
    await btn.click();
  }

  async confirmarFinalizacion(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Confirmar') or contains(text(), 'Aceptar')]"),
      8000,
    );
    await btn.click();
  }
}
