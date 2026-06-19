import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class PerfilPacientePage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.perfil);
  }

  async waitForLoad(): Promise<void> {
    await this.waitForElement(By.xpath("//button[contains(text(), 'Reservas')]"), 12000);
  }

  async clickReservasTab(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Reservas')]"),
      8000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async countActiveReservations(): Promise<number> {
    const cancelBtns = await this.driver.findElements(
      By.xpath("//button[not(@disabled) and contains(text(), 'Cancelar')]"),
    );
    return cancelBtns.length;
  }

  async clickCancelFirstReservation(): Promise<void> {
    const btns = await this.driver.findElements(
      By.xpath("//button[not(@disabled) and contains(text(), 'Cancelar')]"),
    );
    if (btns.length === 0) throw new Error('No hay reservas activas para cancelar');
    await this.driver.executeScript('arguments[0].click();', btns[0]);
  }

  async confirmCancel(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Sí, cancelar')]"),
      5000,
    );
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForNoReservationsOrUpdate(): Promise<void> {
    await this.sleep(2000);
  }
}
