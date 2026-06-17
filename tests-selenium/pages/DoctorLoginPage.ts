import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class DoctorLoginPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.doctorLogin);
    await this.waitForElement(By.css('input[name="email"]'));
  }

  async login(email: string, password: string): Promise<void> {
    await this.clearAndType(By.css('input[name="email"]'), email);
    await this.clearAndType(By.css('input[name="password"]'), password);
    const btn = await this.waitForClickable(By.css('button[type="submit"]'));
    await btn.click();
  }

  async waitForRedirect(): Promise<void> {
    // El doctor login usa window.location.href (full page reload)
    await this.waitForUrl(URLS.doctorCalendario, 15000);
  }
}
