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

  async validateUsabilityMetrics(pageName: string): Promise<void> {
    // Esperar a que la página se estabilice y terminen las pinturas
    await this.sleep(1000);

    const metrics = await this.driver.executeScript<{ ttfb: number; fcp: number; lcp: number; cls: number }>(`
      const timing = window.performance.timing;
      const navStart = timing.navigationStart;

      // TTFB
      const ttfb = Math.max(0, timing.responseStart - navStart || 0);

      // FCP
      const paintEntries = window.performance.getEntriesByType('paint') || [];
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      let fcp = fcpEntry ? fcpEntry.startTime : 0;
      if (fcp === 0 && timing.domContentLoadedEventStart > 0) {
        fcp = Math.max(0, timing.domContentLoadedEventStart - navStart);
      }

      // LCP
      const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint') || [];
      let lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
      if (lcp === 0) {
        if (timing.loadEventEnd > 0) {
          lcp = Math.max(0, timing.loadEventEnd - navStart);
        } else if (timing.domInteractive > 0) {
          lcp = Math.max(0, timing.domInteractive - navStart);
        }
      }

      // CLS
      const layoutEntries = window.performance.getEntriesByType('layout-shift') || [];
      let cls = 0;
      for (const entry of layoutEntries) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }

      return { ttfb, fcp, lcp, cls };
    `);

    const thresholds = {
      ttfb: 800,
      fcp: 1800,
      lcp: 2500,
      cls: 0.1,
    };

    const errors: string[] = [];

    if (metrics.ttfb > thresholds.ttfb) {
      errors.push(`TTFB fue ${metrics.ttfb.toFixed(2)}ms (límite: ${thresholds.ttfb}ms)`);
    }
    if (metrics.fcp > thresholds.fcp) {
      errors.push(`FCP fue ${metrics.fcp.toFixed(2)}ms (límite: ${thresholds.fcp}ms)`);
    }
    if (metrics.lcp > thresholds.lcp) {
      errors.push(`LCP fue ${metrics.lcp.toFixed(2)}ms (límite: ${thresholds.lcp}ms)`);
    }
    if (metrics.cls > thresholds.cls) {
      errors.push(`CLS fue ${metrics.cls.toFixed(4)} (límite: ${thresholds.cls})`);
    }

    if (errors.length > 0) {
      throw new Error(`[Métricas de Usabilidad] Falló la validación en la página "${pageName}":\n- ${errors.join('\n- ')}`);
    }
  }

  async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
