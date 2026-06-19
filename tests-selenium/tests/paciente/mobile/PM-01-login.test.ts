import { WebDriver } from 'selenium-webdriver';
import { buildDriver, Browser } from '../../../utils/driver';
import { CREDENTIALS } from '../../../utils/credentials';
import { HomePage } from '../../../pages/HomePage';
import { LoginPacientePage } from '../../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../../pages/PerfilPacientePage';

function suiteFor(device: Browser, label: string) {
  describe(`[${label}] PM-01 — Login del paciente`, () => {
    let driver: WebDriver;
    let homePage: HomePage;
    let loginPage: LoginPacientePage;
    let perfilPage: PerfilPacientePage;

    beforeAll(async () => {
      driver = await buildDriver(device);
      homePage = new HomePage(driver);
      loginPage = new LoginPacientePage(driver);
      perfilPage = new PerfilPacientePage(driver);
    });

    afterAll(async () => {
      await driver.quit();
    });

    test('Login con credenciales válidas → redirect a /perfil con tabs visibles', async () => {
      await homePage.navigate();
      await homePage.sleep(5000); // [captura] home en viewport mobile — reducir a 1500ms

      await homePage.goToLoginMobile();
      await loginPage.sleep(5000); // [captura] formulario de login en mobile — reducir a 1500ms

      await loginPage.fillDni(CREDENTIALS.paciente.dni);
      await loginPage.fillEmail(CREDENTIALS.paciente.email);
      await loginPage.fillPassword(CREDENTIALS.paciente.password);
      await loginPage.sleep(5000); // [captura] formulario relleno antes de submit — reducir a 1000ms

      await loginPage.submit();
      await loginPage.waitForRedirect('/perfil');

      await perfilPage.waitForLoad();
      await perfilPage.sleep(5000); // [captura] /perfil cargado en mobile con tabs visibles — reducir a 2000ms

      const url = await driver.getCurrentUrl();
      expect(url).toContain('/perfil');
    });
  });
}

suiteFor('android', 'Android / Pixel 7');
suiteFor('ios', 'iOS / iPhone 14 Pro');
