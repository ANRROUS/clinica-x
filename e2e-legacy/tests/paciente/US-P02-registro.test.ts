import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { RegisterPage } from '../../pages/RegisterPage';

describe('US-P02 — Registro de nuevo paciente', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let registerPage: RegisterPage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    registerPage = new RegisterPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Registro con datos únicos → redirect a /perfil', async () => {
    registerPage.setCaseId('US-P02-REGISTRO', 'Registro de nuevo paciente');
    const nuevoPaciente = CREDENTIALS.nuevoPaciente();

    await homePage.navigate();
    await homePage.sleep(2000);

    await homePage.goToRegister();
    await registerPage.sleep(2000);
    await registerPage.validateUsabilityMetrics('Formulario de Registro');

    await registerPage.fillForm({
      nombre: nuevoPaciente.nombre,
      apellido: nuevoPaciente.apellido,
      dni: nuevoPaciente.dni,
      email: nuevoPaciente.email,
      password: nuevoPaciente.password,
    });
    await registerPage.sleep(2000);

    await registerPage.submit();
    await registerPage.waitForUrl('/perfil', 6000);
    await registerPage.sleep(2000);
    await registerPage.validateUsabilityMetrics('Perfil post-registro');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');

    registerPage.finalizeReport('PASSED');
  });
});
