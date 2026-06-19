import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { RegisterPage } from '../../pages/RegisterPage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('1.2 — Registro de nuevo paciente', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let registerPage: RegisterPage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    registerPage = new RegisterPage(driver);
    perfilPage = new PerfilPacientePage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Registro con datos únicos → redirect a /perfil con tabs visibles', async () => {
    const nuevoPaciente = CREDENTIALS.nuevoPaciente();

    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible — reducir a 1500ms

    await homePage.goToRegister();
    await registerPage.sleep(4000); // [captura] formulario de registro vacío — reducir a 1500ms

    await registerPage.fillForm({
      nombre: nuevoPaciente.nombre,
      apellido: nuevoPaciente.apellido,
      dni: nuevoPaciente.dni,
      email: nuevoPaciente.email,
      password: nuevoPaciente.password,
    });
    await registerPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await registerPage.submit();
    await registerPage.waitForUrl('/perfil', 10000);

    await perfilPage.waitForLoad();
    await perfilPage.sleep(4000); // [captura] /perfil cargado tras registro — reducir a 2000ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
