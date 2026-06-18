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
    await loginPage.sleep(4000); // [captura] formulario vacío visible — reducir a 1500ms en ejecución normal

    await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1500ms

    await loginPage.waitForRedirect();
    await loginPage.sleep(4000); // [captura] dashboard cargado tras login — reducir a 2000ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
