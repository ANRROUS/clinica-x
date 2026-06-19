import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForElement(By.css('header'));
  }

  async goToLogin(): Promise<void> {
    const link = await this.waitForClickable(By.css('a[href="/login"]'));
    await link.click();
    await this.waitForUrl('/login');
  }

  async goToRegister(): Promise<void> {
    const link = await this.waitForClickable(By.css('a[href="/register"]'));
    await link.click();
    await this.waitForUrl('/register');
  }

  async goToReservarCita(): Promise<void> {
    const link = await this.waitForClickable(By.css('a[href="/reservar-cita"]'));
    await link.click();
    await this.waitForUrl('/reservar-cita');
  }
}
