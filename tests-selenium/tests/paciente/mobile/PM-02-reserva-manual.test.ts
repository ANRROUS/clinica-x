import { WebDriver } from 'selenium-webdriver';
import { buildDriver, Browser } from '../../../utils/driver';
import { CREDENTIALS } from '../../../utils/credentials';
import { HomePage } from '../../../pages/HomePage';
import { LoginPacientePage } from '../../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../../pages/ReservarCitaPage';
import { PerfilPacientePage } from '../../../pages/PerfilPacientePage';

function suiteFor(device: Browser, label: string) {
  describe(`[${label}] PM-02 — Reserva manual de cita`, () => {
    let driver: WebDriver;
    let homePage: HomePage;
    let loginPage: LoginPacientePage;
    let reservarPage: ReservarCitaPage;
    let perfilPage: PerfilPacientePage;

    beforeAll(async () => {
      driver = await buildDriver(device);
      homePage = new HomePage(driver);
      loginPage = new LoginPacientePage(driver);
      reservarPage = new ReservarCitaPage(driver);
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

    test('Seleccionar especialidad → médico → día → slot → confirmar → redirect a /perfil', async () => {
      await homePage.navigate();
      await homePage.sleep(5000); // [captura] home en mobile con sesión activa — reducir a 1500ms

      await homePage.goToReservarCitaMobile();
      await reservarPage.waitForSpecialties();
      await reservarPage.sleep(5000); // [captura] especialidades cargadas en viewport mobile — reducir a 1500ms

      await reservarPage.selectFirstSpecialty();
      await reservarPage.waitForDoctors();
      await reservarPage.sleep(5000); // [captura] lista de médicos en mobile — reducir a 1500ms

      await reservarPage.selectLastDoctor();
      await reservarPage.waitForDays();
      await reservarPage.sleep(5000); // [captura] calendario de días disponibles en mobile — reducir a 1500ms

      const hasDays = await reservarPage.hasAvailableDays();
      if (!hasDays) {
        throw new Error(
          `FALLO PM-02 [${label}]: El médico no tiene días habilitados. ` +
          'Verificar que A-03 y A-04 se ejecutaron correctamente.',
        );
      }

      const totalDias = await reservarPage.countAvailableDays();
      let reservada = false;
      let ultimoError = '';

      for (let dia = 0; dia < totalDias && !reservada; dia++) {
        await reservarPage.selectNthAvailableDay(dia);
        await reservarPage.waitForSlots();
        await reservarPage.sleep(5000); // [captura] slots disponibles en mobile — reducir a 1500ms

        const hasSlots = await reservarPage.hasAvailableSlots();
        if (!hasSlots) continue;

        const totalSlots = await reservarPage.countAvailableSlots();
        for (let slot = 0; slot < totalSlots && !reservada; slot++) {
          await reservarPage.selectNthAvailableSlot(slot);
          await reservarPage.sleep(4000); // [captura] slot seleccionado en mobile — reducir a 1000ms

          await reservarPage.clickConfirmarReserva();
          await reservarPage.waitForModal();
          await reservarPage.sleep(5000); // [captura] modal de confirmación en mobile — reducir a 1500ms

          await reservarPage.acceptModal();

          try {
            await reservarPage.waitForUrl('/perfil', 10000);
            reservada = true;
          } catch {
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('/reservar-cita')) {
              const toastMsg = await reservarPage.getToastMessage();
              ultimoError = `día[${dia}] slot[${slot}]: "${toastMsg ?? '(sin toast)'}"`;
              await reservarPage.closeModalIfOpen();
              await reservarPage.sleep(1000);
            } else {
              throw new Error(`URL inesperada tras aceptar modal: ${currentUrl}`);
            }
          }
        }
      }

      if (!reservada) {
        throw new Error(
          `FALLO PM-02 [${label}]: No se pudo reservar en ningún slot. Último error: ${ultimoError}`,
        );
      }

      await perfilPage.waitForLoad();
      await perfilPage.sleep(5000); // [captura] /perfil con reserva confirmada en mobile — reducir a 2000ms

      const url = await driver.getCurrentUrl();
      expect(url).toContain('/perfil');
    });
  });
}

suiteFor('android', 'Android / Pixel 7');
suiteFor('ios', 'iOS / iPhone 14 Pro');
