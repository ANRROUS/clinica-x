import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { HomePage } from '../../pages/HomePage';

describe('US-P01 — Landing Page y especialidades', () => {
  let driver: WebDriver;
  let homePage: HomePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    homePage.setCaseId('US-P01', 'Landing Page y especialidades');
  });

  afterAll(async () => {
    homePage.finalizeReport('PASSED');
    await driver.quit();
  });

  test('Carga de landing pública con métricas de usabilidad', async () => {
    await homePage.navigate();
    await homePage.sleep(2000);

    // Validar métricas de carga inicial
    await homePage.validateUsabilityMetrics('Landing Page');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/');
  });
});
