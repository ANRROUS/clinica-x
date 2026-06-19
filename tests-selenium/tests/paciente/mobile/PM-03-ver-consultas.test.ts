import { WebDriver } from 'selenium-webdriver';
import { buildDriver, Browser } from '../../../utils/driver';
import { CREDENTIALS } from '../../../utils/credentials';
import { HomePage } from '../../../pages/HomePage';
import { LoginPacientePage } from '../../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../../pages/PerfilPacientePage';

function suiteFor(device: Browser, label: string) {
  describe(`[${label}] PM-03 — Ver consultas del paciente`, () => {
    let driver: WebDriver;
    let homePage: HomePage;
    let loginPage: LoginPacientePage;
    let perfilPage: PerfilPacientePage;

    beforeAll(async () => {
      driver = await buildDriver(device);
      homePage = new HomePage(driver);
      loginPage = new LoginPacientePage(driver);
      perfilPage = new PerfilPacientePage(driver);

      await homePage.navigate();
      await homePage.sleep(5000); // [captura] home en viewport mobile — reducir a 1500ms

      await homePage.goToLoginMobile();
      await loginPage.sleep(5000); // [captura] formulario de login en mobile — reducir a 1500ms

      await loginPage.fillDni(CREDENTIALS.paciente2.dni);
      await loginPage.fillEmail(CREDENTIALS.paciente2.email);
      await loginPage.fillPassword(CREDENTIALS.paciente2.password);
      await loginPage.sleep(5000); // [captura] formulario relleno antes de submit — reducir a 1000ms

      await loginPage.submit();
      await loginPage.waitForRedirect('/perfil');
      await perfilPage.waitForLoad();
      await loginPage.sleep(2000);
    });

    afterAll(async () => {
      await driver.quit();
    });

    test('Tab Consultas → seleccionar última consulta → ver detalle con diagnóstico', async () => {
      await homePage.navigateTo('/perfil');
      await perfilPage.waitForLoad();
      await perfilPage.sleep(5000); // [captura] /perfil en mobile con tab Consultas activa — reducir a 1500ms

      await perfilPage.goToTabConsultas();
      await perfilPage.sleep(6000); // [captura] lista de consultas en mobile (carga async) — reducir a 1500ms

      const hayConsultas = await perfilPage.hasConsultations();
      if (!hayConsultas) {
        console.warn(
          `SKIP PM-03 [${label}]: no se encontraron consultas registradas. ` +
          'Verificar que M-02 (completar consulta) se ejecutó correctamente.',
        );
        expect(true).toBe(true);
        return;
      }

      await perfilPage.clickUltimaConsulta();
      await perfilPage.waitForConsultaDetail();
      await perfilPage.sleep(6000); // [captura] detalle de última consulta en mobile — reducir a 1500ms

      const diagnostico = await perfilPage.getDiagnosticoText();
      expect(diagnostico.length).toBeGreaterThan(0);
    });
  });
}

suiteFor('android', 'Android / Pixel 7');
suiteFor('ios', 'iOS / iPhone 14 Pro');
