import { WebDriver, WebElement, By, until } from 'selenium-webdriver';
import * as fs from 'fs';
import * as path from 'path';
import { URLS } from '../utils/credentials';
import { registrarCaso, MetricasCaso } from '../utils/reporter';

export class BasePage {
  protected driver: WebDriver;
  protected baseUrl: string;
  private caseId = '';
  private caseName = '';
  private screenshots: string[] = [];
  private metricasSnapshots: Array<{ pageName: string; metricas: { ttfb: number; fcp: number; lcp: number; cls: number } }> = [];
  private startTime = 0;
  private isFinalized = false;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.baseUrl = URLS.base;
  }

  setCaseId(id: string, name: string) {
    this.caseId = id;
    this.caseName = name;
    this.screenshots = [];
    this.metricasSnapshots = [];
    this.startTime = Date.now();
    this.isFinalized = false;
    (globalThis as any).__currentUsabilityPage__ = this;
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
    try {
      await this.driver.get(`${this.baseUrl}${path}`);
    } catch (err) {
      await this.takeScreenshot('NAVIGATION_ERROR');
      throw err;
    }
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

  async takeScreenshot(suffix: string): Promise<string> {
    const screenshotDir = path.resolve(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}_${this.caseId}_${suffix}.png`;
    const filePath = path.join(screenshotDir, fileName);
    const data = await this.driver.takeScreenshot();
    fs.writeFileSync(filePath, data, 'base64');
    this.screenshots.push(filePath);
    return filePath;
  }

  async validateUsabilityMetrics(pageName: string): Promise<void> {
    // Esperar estabilización
    await this.sleep(1000);

    const metrics = await this.driver.executeScript<{ ttfb: number; fcp: number; lcp: number; cls: number }>(`
      const timing = window.performance.timing;
      const navStart = timing.navigationStart;

      const ttfb = Math.max(0, timing.responseStart - navStart || 0);

      const paintEntries = window.performance.getEntriesByType('paint') || [];
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      let fcp = fcpEntry ? fcpEntry.startTime : 0;
      if (fcp === 0 && timing.domContentLoadedEventStart > 0) {
        fcp = Math.max(0, timing.domContentLoadedEventStart - navStart);
      }

      const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint') || [];
      let lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
      if (lcp === 0) {
        if (timing.loadEventEnd > 0) {
          lcp = Math.max(0, timing.loadEventEnd - navStart);
        } else if (timing.domInteractive > 0) {
          lcp = Math.max(0, timing.domInteractive - navStart);
        }
      }

      const layoutEntries = window.performance.getEntriesByType('layout-shift') || [];
      let cls = 0;
      for (const entry of layoutEntries) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }

      return { ttfb, fcp, lcp, cls };
    `);

    this.metricasSnapshots.push({ pageName, metricas: metrics });

    // Tomar screenshot de esta validación
    const safeSuffix = pageName.replace(/[^a-zA-Z0-9]/g, '_');
    await this.takeScreenshot(safeSuffix);

    const thresholds = {
      ttfb: 800,
      fcp: 1800,
      lcp: 2500,
      cls: 0.1,
    };

    const errors: string[] = [];
    if (metrics.ttfb > thresholds.ttfb) errors.push(`TTFB ${metrics.ttfb.toFixed(0)}ms > ${thresholds.ttfb}ms`);
    if (metrics.fcp > thresholds.fcp) errors.push(`FCP ${metrics.fcp.toFixed(0)}ms > ${thresholds.fcp}ms`);
    if (metrics.lcp > thresholds.lcp) errors.push(`LCP ${metrics.lcp.toFixed(0)}ms > ${thresholds.lcp}ms`);
    if (metrics.cls > thresholds.cls) errors.push(`CLS ${metrics.cls.toFixed(4)} > ${thresholds.cls}`);

    if (errors.length > 0) {
      throw new Error(`[Usabilidad] Falló en "${pageName}": ${errors.join('; ')}`);
    }
  }

  finalizeReport(estado: 'PASSED' | 'FAILED', observaciones = ''): void {
    if (this.isFinalized) return;
    this.isFinalized = true;
    (globalThis as any).__currentUsabilityPage__ = null;

    const duracionMs = Date.now() - this.startTime;
    // Promedio de métricas si hay múltiples snapshots, si no ceros
    const proms =
      this.metricasSnapshots.length > 0
        ? {
            ttfb: this.metricasSnapshots.reduce((s, m) => s + m.metricas.ttfb, 0) / this.metricasSnapshots.length,
            fcp: this.metricasSnapshots.reduce((s, m) => s + m.metricas.fcp, 0) / this.metricasSnapshots.length,
            lcp: this.metricasSnapshots.reduce((s, m) => s + m.metricas.lcp, 0) / this.metricasSnapshots.length,
            cls: this.metricasSnapshots.reduce((s, m) => s + m.metricas.cls, 0) / this.metricasSnapshots.length,
          }
        : { ttfb: 0, fcp: 0, lcp: 0, cls: 0 };

    const caso: MetricasCaso = {
      id: this.caseId,
      nombre: this.caseName,
      estado,
      metricas: {
        ttfb: Math.round(proms.ttfb),
        fcp: Math.round(proms.fcp),
        lcp: Math.round(proms.lcp),
        cls: parseFloat(proms.cls.toFixed(4)),
      },
      screenshots: this.screenshots,
      observaciones,
      duracionMs,
    };

    registrarCaso(caso);
  }
}
