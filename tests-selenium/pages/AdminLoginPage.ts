import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class AdminLoginPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.adminLogin);
    await this.waitForElement(By.css('input[name="email"]'));
  }

  async login(email: string, password: string): Promise<void> {
    await this.clearAndType(By.css('input[name="email"]'), email);
    await this.clearAndType(By.css('input[name="password"]'), password);
    const btn = await this.waitForClickable(By.css('button[type="submit"]'));
    await btn.click();
  }

  async waitForRedirect(): Promise<void> {
    await this.waitForUrl(URLS.adminDashboard, 15000);
  }
}
