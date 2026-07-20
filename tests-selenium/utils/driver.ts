import { Builder, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export type Browser = 'chrome' | 'firefox' | 'android' | 'ios';

export async function buildDriver(browser: Browser = 'chrome'): Promise<WebDriver> {
  // ── Firefox ────────────────────────────────────────────────────────────────
  if (browser === 'firefox') {
    const options = new FirefoxOptions();
    if (process.env.HEADLESS !== 'false') options.addArguments('-headless');
    options.addArguments('--width=1280', '--height=800');
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 5000 });
    return driver;
  }

  // ── Android — Pixel 7 (Chrome DevTools Protocol device emulation) ──────────
  if (browser === 'android') {
    const options = new ChromeOptions();
    if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new');
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
    options.setMobileEmulation({ deviceName: 'Pixel 7' });
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 5000 });
    return driver;
  }

  // ── iOS — iPhone 14 Pro viewport + Safari UA (Chrome DevTools Protocol) ────
  if (browser === 'ios') {
    const options = new ChromeOptions();
    if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new');
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
    // Los tipos de @types/selenium-webdriver no modelan la forma { deviceMetrics, userAgent }.
    // El cast a any es necesario; Chrome acepta este objeto correctamente en runtime.
    options.setMobileEmulation({
      deviceMetrics: { width: 393, height: 852, pixelRatio: 3 },
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    } as any);
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 5000 });
    return driver;
  }

  // ── Chrome (desktop, por defecto) ──────────────────────────────────────────
  const options = new ChromeOptions();
  if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new');
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 5000 });
  return driver;
}
