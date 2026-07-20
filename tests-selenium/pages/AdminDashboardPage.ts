import { By, WebElement, until } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  async waitForLoad(): Promise<void> {
    await this.waitForElement(By.css('div.grid.grid-cols-4'), 15000);
  }

  async getKpiCards(): Promise<WebElement[]> {
    return this.driver.findElements(By.css('div.grid.grid-cols-4 > div'));
  }

  async getDoctorRows(): Promise<WebElement[]> {
    return this.driver.findElements(By.css('tbody tr'));
  }

  async clickAgregarDoctor(): Promise<void> {
    const link = await this.waitForClickable(
      By.xpath("//a[contains(text(), 'Agregar') or contains(text(), 'Nuevo Doctor')]"),
    );
    await link.click();
  }

  // Tras el pull, editar abre un modal en lugar de navegar a /edit.
  // El botón de editar es <button title="Editar"> (ya no <a href="/edit">).
  async clickEditarPrimerDoctor(): Promise<void> {
    const btn = await this.waitForClickable(
      By.css('tbody tr:first-child button[title="Editar"]'),
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async clickEditarDoctorByName(name: string): Promise<void> {
    const row = await this.waitForElement(
      By.xpath(`//tbody//tr[td[contains(text(), '${name}')]]`),
    );
    const btn = await row.findElement(By.css('button[title="Editar"]'));
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  // Hace clic en el toggle del primer médico que esté activo (title="Desactivar").
  // Si no hay ninguno activo lanza error descriptivo.
  async clickTogglePrimerDoctorActivo(): Promise<void> {
    const toggleBtn = await this.waitForClickable(
      By.css('tbody tr button[title="Desactivar"]'),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', toggleBtn);
  }

  async waitForConfirmStatusModal(): Promise<void> {
    await this.waitForElement(
      By.xpath("//*[contains(text(), 'Confirmar cambio de estado')]"),
      8000,
    );
  }

  async clickConfirmarCambioEstado(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Confirmar') and not(contains(text(), 'cambio'))]"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }

  // Devuelve el texto de la columna Estado del primer doctor de la tabla.
  async getPrimerDoctorEstadoText(): Promise<string> {
    const cell = await this.waitForElement(
      By.css('tbody tr:first-child td:nth-child(5)'),
      8000,
    );
    return cell.getText();
  }
}
