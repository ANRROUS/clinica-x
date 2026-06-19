import { WebDriver } from 'selenium-webdriver';
import { buildDriver, Browser } from '../../../utils/driver';
import { CREDENTIALS } from '../../../utils/credentials';
import { HomePage } from '../../../pages/HomePage';
import { LoginPacientePage } from '../../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../../pages/PerfilPacientePage';

function suiteFor(device: Browser, label: string) {
  describe(`[${label}] PM-04 — Cancelar reserva activa`, () => {
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

    test('Tab Reservas → cancelar primera reserva activa', async () => {
      await homePage.navigateTo('/perfil');
      await perfilPage.waitForLoad();
      await perfilPage.sleep(5000); // [captura] /perfil en mobile — reducir a 1500ms

      await perfilPage.goToTabReservas();
      await perfilPage.waitForReservasLoaded();
      await perfilPage.sleep(6000); // [captura] tab Reservas en mobile modo "Activas" — reducir a 1500ms

      const hayActivas = await perfilPage.hasActiveAppointments();
      if (!hayActivas) {
        throw new Error(
          `FALLO PM-04 [${label}]: No se encontraron reservas activas para cancelar. ` +
          'Verificar que PM-02 (reserva manual mobile) se ejecutó antes de este test.',
        );
      }

      const totalAntes = await perfilPage.getActiveAppointmentCount();
      await perfilPage.sleep(5000); // [captura] lista de reservas activas en mobile — reducir a 1500ms

      await perfilPage.clickCancelarPrimeraCita();
      await perfilPage.waitForCancelModal();
      await perfilPage.sleep(6000); // [captura] modal de confirmación "Cancelar cita" en mobile — reducir a 1500ms

      await perfilPage.clickConfirmarCancelar();
      await perfilPage.sleep(6000); // [captura] reserva cancelada, lista actualizada en mobile — reducir a 1500ms

      const totalDespues = await perfilPage.getActiveAppointmentCount();
      expect(totalDespues).toBe(totalAntes - 1);
    });
  });
}

suiteFor('android', 'Android / Pixel 7');
suiteFor('ios', 'iOS / iPhone 14 Pro');
