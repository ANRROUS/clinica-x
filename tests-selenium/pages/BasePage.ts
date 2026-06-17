import { WebDriver, WebElement, By, until } from 'selenium-webdriver';
import { URLS } from '../utils/credentials';

export class BasePage {
  protected driver: WebDriver;
  protected baseUrl: string;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.baseUrl = URLS.base;
  }

  async waitForElement(locator: By, timeoutMs = 10000): Promise<WebElement> {
    return this.driver.wait(until.elementLocated(locator), timeoutMs);
  }

  async waitForClickable(locator: By, timeoutMs = 10000): Promise<WebElement> {
    const el = await this.waitForElement(locator, timeoutMs);
    await this.driver.wait(until.elementIsEnabled(el), timeoutMs);
    return el;
  }

  async waitForText(text: string, timeoutMs = 10000): Promise<void> {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${text}')]`)),
      timeoutMs,
    );
  }

  async navigateTo(path: string): Promise<void> {
    await this.driver.get(`${this.baseUrl}${path}`);
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async waitForUrl(partialUrl: string, timeoutMs = 15000): Promise<void> {
    await this.driver.wait(until.urlContains(partialUrl), timeoutMs);
  }

  async clearAndType(locator: By, text: string): Promise<void> {
    const el = await this.waitForElement(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
