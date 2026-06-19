import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class LoginPacientePage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.loginPaciente);
    await this.waitForElement(By.css('input[name="dni"]'));
  }

  async fillDni(dni: string): Promise<void> {
    await this.clearAndType(By.css('input[name="dni"]'), dni);
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

  async login(dni: string, email: string, password: string): Promise<void> {
    await this.fillDni(dni);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async waitForRedirect(expectedPath: string): Promise<void> {
    await this.waitForUrl(expectedPath);
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      const el = await this.driver.findElement(By.css('[role="alert"], .text-red-500, .text-red-600'));
      return await el.getText();
    } catch {
      return null;
    }
  }

  async hasErrorVisible(): Promise<boolean> {
    const els = await this.driver.findElements(By.css('[role="alert"], .text-red-500, .text-red-600'));
    return els.length > 0;
  }
}
