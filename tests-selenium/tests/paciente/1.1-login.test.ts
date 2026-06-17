import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';

describe('1.1 — Login paciente existente', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login con DNI + email + password válidos → redirect a /perfil', async () => {
    await homePage.navigate();
    await homePage.sleep(3000); // home visible

    await homePage.goToLogin();
    await loginPage.sleep(3000); // formulario vacío visible

    await loginPage.login(
      CREDENTIALS.paciente.dni,
      CREDENTIALS.paciente.email,
      CREDENTIALS.paciente.password,
    );
    await loginPage.sleep(3000); // formulario relleno antes de submit

    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(3000); // página /perfil cargada

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
