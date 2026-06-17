import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';

describe('3.1 — Login de admin', () => {
  let driver: WebDriver;
  let loginPage: AdminLoginPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new AdminLoginPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login con email + password → redirect a /admin/dashboard', async () => {
    await loginPage.navigate();
    await loginPage.sleep(2000); // formulario vacío visible

    await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
    await loginPage.sleep(2000); // formulario relleno antes de submit

    await loginPage.waitForRedirect();
    await loginPage.sleep(2000); // dashboard cargado

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
