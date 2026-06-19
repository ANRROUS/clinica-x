import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class DoctorCalendarioPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.doctorCalendario);
  }

  async waitForLoad(): Promise<void> {
    // Esperar que el calendario esté visible (título o grid)
    await this.waitForElement(
      By.xpath("//*[contains(text(), 'Calendario') or contains(@class, 'calendar') or contains(@class, 'calendario')]"),
      15000,
    );
  }

  async switchToMonthlyView(): Promise<void> {
    const btn = await this.driver.findElements(By.xpath("//button[contains(text(), 'Mensual') or contains(text(), 'Month')]"));
    if (btn.length > 0) await btn[0].click();
  }

  async switchToWeeklyView(): Promise<void> {
    const btn = await this.driver.findElements(By.xpath("//button[contains(text(), 'Semanal') or contains(text(), 'Week')]"));
    if (btn.length > 0) await btn[0].click();
  }

  async switchToDailyView(): Promise<void> {
    const btn = await this.driver.findElements(By.xpath("//button[contains(text(), 'Diario') or contains(text(), 'Day')]"));
    if (btn.length > 0) await btn[0].click();
  }
}
