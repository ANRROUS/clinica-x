import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('1.1 — Login paciente existente', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    perfilPage = new PerfilPacientePage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login con DNI + email + password válidos → redirect a /perfil con tabs visibles', async () => {
    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible — reducir a 1500ms

    await homePage.goToLogin();
    await homePage.sleep(4000); // [captura] formulario de login vacío — reducir a 1500ms
    await loginPage.sleep(3000); // formulario vacío visible
    await loginPage.validateUsabilityMetrics('Login Paciente');

    // Rellenar campos por separado para capturar el formulario antes de enviarlo.
    await loginPage.fillDni(CREDENTIALS.paciente.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente.email);
    await loginPage.fillPassword(CREDENTIALS.paciente.password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.waitForRedirect('/perfil');

    // Verificar que /perfil cargó correctamente con los tabs del perfil visibles.
    await perfilPage.waitForLoad();
    await perfilPage.sleep(4000); // [captura] /perfil cargado con tabs Consultas/Tratamiento/Reservas — reducir a 2000ms
    await loginPage.sleep(3000); // página /perfil cargada
    await loginPage.validateUsabilityMetrics('Portal del Paciente');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
