import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

// Devuelve la fecha en formato YYYY-MM-DD sumando `offsetDays` días al día actual.
function dateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

describe('1.7 — Reprogramar reserva activa', () => {
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

  test('Tab Reservas → reprogramar primera reserva activa a un slot disponible', async () => {
    await homePage.navigateTo('/perfil');
    await perfilPage.waitForLoad();
    await perfilPage.sleep(5000); // [captura] /perfil cargado — reducir a 1500ms

    await perfilPage.goToTabReservas();
    await perfilPage.waitForReservasLoaded();
    await perfilPage.sleep(6000); // [captura] tab Reservas en modo "Activas" — reducir a 1500ms

    const hayActivas = await perfilPage.hasActiveAppointments();
    if (!hayActivas) {
      throw new Error(
        'FALLO P-07: No se encontraron reservas activas para reprogramar. ' +
        'Verificar que P-03 (reserva manual) se ejecutó con un slot disponible del médico.',
      );
    }

    await perfilPage.sleep(5000); // [captura] lista de reservas activas antes de reprogramar — reducir a 1500ms

    await perfilPage.clickReprogramarPrimeraCita();
    await perfilPage.waitForRescheduleModal();
    await perfilPage.sleep(6000); // [captura] modal "Reprogramar cita" abierto — reducir a 1500ms

    // Buscar la primera fecha con slots disponibles en los próximos 14 días.
    // El médico tiene días y horas específicos; no todos los días tienen slots.
    let slotEncontrado = false;
    for (let i = 1; i <= 14; i++) {
      const fecha = dateOffset(i);
      await perfilPage.selectRescheduleDate(fecha);
      const haySlots = await perfilPage.hasRescheduleSlots();
      if (haySlots) {
        slotEncontrado = true;
        await perfilPage.sleep(5000); // [captura] slots disponibles para la fecha seleccionada — reducir a 1500ms
        break;
      }
    }

    if (!slotEncontrado) {
      throw new Error(
        'FALLO P-07: No se encontraron slots disponibles en los próximos 14 días. ' +
        'Verificar que el médico tiene horario habilitado con al menos una fecha futura.',
      );
    }

    await perfilPage.selectFirstRescheduleSlot();
    await perfilPage.sleep(5000); // [captura] slot seleccionado (resaltado) antes de confirmar — reducir a 1000ms

    await perfilPage.clickConfirmarReprogramar();
    await perfilPage.sleep(6000); // [captura] reserva reprogramada, lista actualizada con nueva fecha — reducir a 1500ms

    // La reserva sigue activa (no se canceló), solo cambió la fecha/hora.
    const hayActivasDespues = await perfilPage.hasActiveAppointments();
    expect(hayActivasDespues).toBe(true);
  });
});
