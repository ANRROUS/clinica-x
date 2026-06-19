import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('1.6 — Cancelar reserva activa', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    perfilPage = new PerfilPacientePage(driver);

    await homePage.navigate();
    await homePage.sleep(5000); // [captura] home visible — reducir a 1500ms

    await homePage.goToLogin();
    await loginPage.sleep(5000); // [captura] formulario de login vacío — reducir a 1500ms

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
    await perfilPage.sleep(5000); // [captura] /perfil cargado — reducir a 1500ms

    await perfilPage.goToTabReservas();
    await perfilPage.waitForReservasLoaded();
    await perfilPage.sleep(6000); // [captura] tab Reservas en modo "Activas" — reducir a 1500ms

    const hayActivas = await perfilPage.hasActiveAppointments();
    if (!hayActivas) {
      throw new Error(
        'FALLO P-06: No se encontraron reservas activas para cancelar. ' +
        'Verificar que P-03 (reserva manual) se ejecutó con un slot disponible del médico.',
      );
    }

    const totalAntes = await perfilPage.getActiveAppointmentCount();
    await perfilPage.sleep(5000); // [captura] lista de reservas activas antes de cancelar — reducir a 1500ms

    await perfilPage.clickCancelarPrimeraCita();
    await perfilPage.waitForCancelModal();
    await perfilPage.sleep(6000); // [captura] modal de confirmación "Cancelar cita" visible — reducir a 1500ms

    await perfilPage.clickConfirmarCancelar();
    await perfilPage.sleep(6000); // [captura] reserva cancelada, lista actualizada — reducir a 1500ms

    const totalDespues = await perfilPage.getActiveAppointmentCount();
    expect(totalDespues).toBe(totalAntes - 1);
  });
});
