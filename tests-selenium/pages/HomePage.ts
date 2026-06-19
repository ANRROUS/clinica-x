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

  // ── Mobile: el nav está oculto hasta que se abre el menú hamburguesa ───────

  async openMobileMenu(): Promise<void> {
    const hamburger = await this.waitForClickable(By.css('button[aria-label="Menú"]'), 8000);
    await this.driver.executeScript('arguments[0].click();', hamburger);
    // Esperar a que el nav sea visible (al menos un link aparece)
    await this.waitForElement(By.css('nav a[href="/login"], nav a[href="/reservar-cita"]'), 5000);
    await this.sleep(5000); // [captura] menú hamburguesa desplegado en mobile — reducir a 1500ms
  }

  async goToLoginMobile(): Promise<void> {
    await this.openMobileMenu();
    const link = await this.waitForClickable(By.css('a[href="/login"]'));
    await this.driver.executeScript('arguments[0].click();', link);
    await this.waitForUrl('/login');
  }

  async goToReservarCitaMobile(): Promise<void> {
    await this.openMobileMenu();
    const link = await this.waitForClickable(By.css('a[href="/reservar-cita"]'));
    await this.driver.executeScript('arguments[0].click();', link);
    await this.waitForUrl('/reservar-cita');
  }
}
