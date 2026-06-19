import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class DoctorLoginPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.doctorLogin);
    await this.waitForElement(By.css('input[name="email"]'));
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndType(By.css('input[name="email"]'), email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.clearAndType(By.css('input[name="password"]'), password);
  }

  async submit(): Promise<void> {
    const btn = await this.waitForClickable(By.css('button[type="submit"]'));
    await btn.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async waitForRedirect(): Promise<void> {
    await this.waitForUrl(URLS.doctorCalendario, 15000);
  }

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }
}
