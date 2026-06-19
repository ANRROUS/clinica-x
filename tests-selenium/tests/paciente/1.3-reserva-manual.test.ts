import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('1.3 — Reserva manual de cita', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let reservarPage: ReservarCitaPage;
  let perfilPage: PerfilPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    reservarPage = new ReservarCitaPage(driver);
    perfilPage = new PerfilPacientePage(driver);

    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible — reducir a 1500ms

    await homePage.goToLogin();
    await loginPage.sleep(4000); // [captura] formulario de login vacío — reducir a 1500ms

    await loginPage.fillDni(CREDENTIALS.paciente2.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente2.email);
    await loginPage.fillPassword(CREDENTIALS.paciente2.password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.waitForRedirect('/perfil');
    await perfilPage.waitForLoad();
    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    // La reserva creada en este test se conserva intencionalmente:
    // M-02 la usa para completar la consulta y P-05 para verificarla.
    await driver.quit();
  });

  test('Seleccionar especialidad → médico → día → slot → confirmar → redirect a /perfil', async () => {
    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible (sesión activa) — reducir a 1500ms

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(4000); // [captura] página reservar-cita con especialidades cargadas — reducir a 1500ms

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(4000); // [captura] especialidad seleccionada + lista de médicos visible — reducir a 1500ms

    // El último médico del grid es el más recientemente creado (A-03).
    await reservarPage.selectLastDoctor();
    await reservarPage.waitForDays();
    await reservarPage.sleep(4000); // [captura] Doctor Test Selenium seleccionado + calendario visible — reducir a 1500ms

    const hasDays = await reservarPage.hasAvailableDays();
    if (!hasDays) {
      throw new Error(
        'El primer médico disponible no tiene días habilitados. ' +
        'Verificar que A-03 y A-04 se ejecutaron correctamente y el médico tiene horarios activos.',
      );
    }

    // Iterar días → slots hasta conseguir una reserva exitosa.
    const totalDias = await reservarPage.countAvailableDays();
    let reservada = false;
    let ultimoError = '';

    for (let dia = 0; dia < totalDias && !reservada; dia++) {
      await reservarPage.selectNthAvailableDay(dia);
      await reservarPage.waitForSlots();
      await reservarPage.sleep(4000); // [captura] día seleccionado + slots disponibles — reducir a 1500ms

      const hasSlots = await reservarPage.hasAvailableSlots();
      if (!hasSlots) continue;

      const totalSlots = await reservarPage.countAvailableSlots();
      for (let slot = 0; slot < totalSlots && !reservada; slot++) {
        await reservarPage.selectNthAvailableSlot(slot);
        await reservarPage.sleep(4000); // [captura] slot seleccionado — reducir a 1000ms

        await reservarPage.clickConfirmarReserva();
        await reservarPage.waitForModal();
        await reservarPage.sleep(4000); // [captura] modal de confirmación visible — reducir a 1500ms

        await reservarPage.acceptModal();

        try {
          await reservarPage.waitForUrl('/perfil', 10000);
          reservada = true;
        } catch {
          const currentUrl = await driver.getCurrentUrl();
          if (currentUrl.includes('/reservar-cita')) {
            const toastMsg = await reservarPage.getToastMessage();
            ultimoError = `día[${dia}] slot[${slot}]: "${toastMsg ?? '(sin toast)'}"`;
            console.warn(`⚠ Intento rechazado: ${ultimoError}`);
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
        `No se pudo reservar en ningún día/slot disponible. Último error: ${ultimoError}. ` +
        'Verificar que al menos un médico activo tiene horarios futuros disponibles.',
      );
    }

    await perfilPage.waitForLoad();
    await perfilPage.sleep(4000); // [captura] /perfil cargado con reserva confirmada — reducir a 2000ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
