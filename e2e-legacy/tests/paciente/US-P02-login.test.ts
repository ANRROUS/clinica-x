import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';

describe('US-P02 — Login de paciente', () => {
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

  test('Login con credenciales válidas → redirect a /perfil', async () => {
    loginPage.setCaseId('US-P02-LOGIN-OK', 'Login paciente - credenciales válidas');

    await homePage.navigate();
    await homePage.sleep(2000);

    await homePage.goToLogin();
    await loginPage.sleep(2000);
    await loginPage.validateUsabilityMetrics('Login Paciente');

    await loginPage.login(
      CREDENTIALS.paciente.dni,
      CREDENTIALS.paciente.email,
      CREDENTIALS.paciente.password,
    );
    await loginPage.sleep(2000);

    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(2000);
    await loginPage.validateUsabilityMetrics('Portal del Paciente');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');

    loginPage.finalizeReport('PASSED');
  });

  test('Login con credenciales inválidas → mensaje de error visible', async () => {
    loginPage.setCaseId('US-P02-LOGIN-ERR', 'Login paciente - credenciales inválidas');

    await loginPage.navigate();
    await loginPage.sleep(2000);
    await loginPage.validateUsabilityMetrics('Login Paciente - Error');

    await loginPage.login(
      CREDENTIALS.paciente.dni,
      CREDENTIALS.paciente.email,
      'contraseña_incorrecta_123',
    );
    await loginPage.sleep(2000);

    // No debe redirigir
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');

    // Debe mostrar mensaje de error
    const hasError = await loginPage.hasErrorVisible();
    expect(hasError).toBe(true);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg?.length).toBeGreaterThan(0);

    loginPage.finalizeReport('PASSED', `Mensaje de error mostrado: "${errorMsg}"`);
  });
});
