import { By, WebElement } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  async waitForLoad(): Promise<void> {
    // Esperar que aparezcan las metric cards (grid de 4)
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
      By.xpath("//a[contains(text(), 'Nuevo Doctor')]"),
    );
    await link.click();
  }

  async clickEditarPrimerDoctor(): Promise<void> {
    const editLink = await this.waitForClickable(
      By.css('tbody tr:first-child td a[href*="/edit"]'),
    );
    await editLink.click();
  }

  async clickEditarDoctorByName(name: string): Promise<void> {
    const row = await this.waitForElement(
      By.xpath(`//tbody//tr[td[contains(text(), '${name}')]]`),
    );
    const editLink = await row.findElement(By.css('a[href*="/edit"]'));
    await editLink.click();
  }
}
