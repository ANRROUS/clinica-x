import { WebDriver, By } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS, URLS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';

describe('1.3 — Reserva manual de cita', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let reservarPage: ReservarCitaPage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    reservarPage = new ReservarCitaPage(driver);

    // Login desde home con paciente2 (Laura)
    await homePage.navigate();
    await homePage.sleep(1500); // home visible

    await homePage.goToLogin();
    await loginPage.sleep(1500); // formulario vacío visible

    await loginPage.login(
      CREDENTIALS.paciente2.dni,
      CREDENTIALS.paciente2.email,
      CREDENTIALS.paciente2.password,
    );
    await loginPage.sleep(1500); // formulario relleno antes de submit

    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(1500); // /perfil cargado tras login
  });

  afterAll(async () => {
    // Cleanup: cancelar TODAS las citas activas de Laura para dejar la BD limpia
    try {
      await driver.get(`${URLS.base}/perfil`);
      await reservarPage.sleep(3000); // esperar hidratación del auth

      // Ir al tab Reservas
      const reservasTab = await reservarPage.waitForClickable(
        By.xpath("//button[contains(text(), 'Reservas')]"), 8000
      );
      await driver.executeScript('arguments[0].click();', reservasTab);
      await reservarPage.sleep(4000); // esperar que carguen las citas desde la API

      // Cancelar todas las citas activas una a una
      let cancelado = 0;
      for (let i = 0; i < 5; i++) {
        const buttons = await driver.findElements(
          By.xpath("//button[not(@disabled) and contains(text(), 'Cancelar')]")
        );
        if (buttons.length === 0) break;

        await driver.executeScript('arguments[0].click();', buttons[0]);
        await reservarPage.sleep(1000);

        const confirmBtn = await reservarPage.waitForClickable(
          By.xpath("//button[contains(text(), 'Sí, cancelar')]"), 5000
        );
        await driver.executeScript('arguments[0].click();', confirmBtn);
        await reservarPage.sleep(2000); // esperar que la lista se actualice
        cancelado++;
      }
      if (cancelado > 0) console.log(`✓ Cleanup: ${cancelado} cita(s) cancelada(s).`);
    } catch {
      console.warn('⚠ Cleanup: no se pudo cancelar citas (normal si el test no completó la reserva).');
    }

    await driver.quit();
  });

  test('Seleccionar especialidad → médico → día → slot → confirmar → redirect a /perfil', async () => {
    await homePage.navigate();
    await homePage.sleep(1500); // home visible (logueado)

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(1500); // página reservar-cita cargada

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(1500); // especialidad seleccionada + lista de médicos visible

    await reservarPage.selectFirstDoctor();
    await reservarPage.waitForDays();
    await reservarPage.sleep(1500); // médico seleccionado + calendario visible

    const hasDays = await reservarPage.hasAvailableDays();
    if (!hasDays) {
      console.warn('⚠ SKIP: No hay días disponibles. Verificar seed.');
      return;
    }

    // Otras citas (de seed o pruebas manuales) pueden ocupar el slot que la UI
    // todavía muestra como disponible. En vez de depender de un índice fijo,
    // se intenta con varias combinaciones de día/slot hasta lograr la reserva.
    const totalDias = await reservarPage.countAvailableDays();
    let reservada = false;
    let ultimoError = '';

    for (let dia = 0; dia < totalDias && !reservada; dia++) {
      await reservarPage.selectNthAvailableDay(dia);
      await reservarPage.waitForSlots();
      await reservarPage.sleep(2000); // día seleccionado + slots visibles

      const hasSlots = await reservarPage.hasAvailableSlots();
      if (!hasSlots) continue;

      const totalSlots = await reservarPage.countAvailableSlots();
      for (let slot = 0; slot < totalSlots && !reservada; slot++) {
        await reservarPage.selectNthAvailableSlot(slot);
        await reservarPage.sleep(1500); // slot seleccionado

        await reservarPage.clickConfirmarReserva();
        await reservarPage.waitForModal();
        await reservarPage.sleep(1500); // modal de confirmación visible

        await reservarPage.acceptModal();

        try {
          await reservarPage.waitForUrl('/perfil', 8000);
          reservada = true;
        } catch {
          const currentUrl = await driver.getCurrentUrl();
          if (currentUrl.includes('/reservar-cita')) {
            const toastMsg = await reservarPage.getToastMessage();
            ultimoError = `día[${dia}] slot[${slot}] rechazado por la API. Mensaje real: "${toastMsg ?? '(sin toast detectado)'}"`;
            console.warn(`⚠ Intento día[${dia}] slot[${slot}] rechazado: "${toastMsg}"`);
            // El modal no se cierra solo cuando la reserva falla (bug del frontend),
            // hay que cerrarlo manualmente antes de reintentar con otro slot/día.
            await reservarPage.closeModalIfOpen();
            await reservarPage.sleep(1000);
          } else {
            throw new Error(`URL inesperada tras acceptModal: ${currentUrl}`);
          }
        }
      }
    }

    if (!reservada) {
      throw new Error(
        `No se pudo reservar tras probar todas las combinaciones de día/slot disponibles. Último error: ${ultimoError}. ` +
        'Probablemente todos los slots visibles ya están ocupados por citas de otros pacientes (seed o pruebas manuales).',
      );
    }

    await reservarPage.sleep(3000); // reserva confirmada, /perfil cargado
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
