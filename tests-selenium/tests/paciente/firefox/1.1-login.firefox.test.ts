import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../../utils/driver';
import { CREDENTIALS } from '../../../utils/credentials';
import { HomePage } from '../../../pages/HomePage';
import { LoginPacientePage } from '../../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../../pages/PerfilPacientePage';

describe('[Firefox] 1.1 — Login paciente existente', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    driver = await buildDriver('firefox');
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    perfilPage = new PerfilPacientePage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login con DNI + email + password válidos → redirect a /perfil con tabs visibles', async () => {
    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible en Firefox — reducir a 1500ms

    await homePage.goToLogin();
    await homePage.sleep(4000); // [captura] formulario de login vacío en Firefox — reducir a 1500ms

    await loginPage.fillDni(CREDENTIALS.paciente.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente.email);
    await loginPage.fillPassword(CREDENTIALS.paciente.password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.waitForRedirect('/perfil');

    await perfilPage.waitForLoad();
    await perfilPage.sleep(4000); // [captura] /perfil cargado con tabs Consultas/Tratamiento/Reservas — reducir a 2000ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
