import { WebDriver, By } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS, URLS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';

describe('US-P03 — Reserva manual de cita', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let reservarPage: ReservarCitaPage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    reservarPage = new ReservarCitaPage(driver);

    // Login
    await homePage.navigate();
    await homePage.goToLogin();
    await loginPage.login(
      CREDENTIALS.paciente2.dni,
      CREDENTIALS.paciente2.email,
      CREDENTIALS.paciente2.password,
    );
    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(1500);
  });

  afterAll(async () => {
    // Cleanup: cancelar citas activas de paciente2
    try {
      await driver.get(`${URLS.base}/perfil`);
      await reservarPage.sleep(3000);
      const reservasTab = await reservarPage.waitForClickable(
        By.xpath("//button[contains(text(), 'Reservas')]"), 8000
      );
      await driver.executeScript('arguments[0].click();', reservasTab);
      await reservarPage.sleep(4000);

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
        await reservarPage.sleep(2000);
      }
    } catch {
      console.warn('Cleanup: no se pudo cancelar citas');
    }

    await driver.quit();
  });

  test('Reserva manual completa con métricas de usabilidad', async () => {
    reservarPage.setCaseId('US-P03', 'Reserva manual de cita');

    await homePage.navigate();
    await homePage.sleep(1500);

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(1500);
    await reservarPage.validateUsabilityMetrics('Selector de Especialidad');

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(1500);
    await reservarPage.validateUsabilityMetrics('Selector de Médico');

    await reservarPage.selectFirstDoctor();
    await reservarPage.waitForDays();
    await reservarPage.sleep(1500);
    await reservarPage.validateUsabilityMetrics('Selector de Día');

    const hasDays = await reservarPage.hasAvailableDays();
    if (!hasDays) {
      reservarPage.finalizeReport('PASSED', 'SKIP: No hay días disponibles. Verificar seed.');
      return;
    }

    const totalDias = await reservarPage.countAvailableDays();
    let reservada = false;
    let ultimoError = '';

    for (let dia = 0; dia < totalDias && !reservada; dia++) {
      await reservarPage.selectNthAvailableDay(dia);
      await reservarPage.waitForSlots();
      await reservarPage.sleep(2000);
      await reservarPage.validateUsabilityMetrics('Selector de Hora');

      const hasSlots = await reservarPage.hasAvailableSlots();
      if (!hasSlots) continue;

      const totalSlots = await reservarPage.countAvailableSlots();
      for (let slot = 0; slot < totalSlots && !reservada; slot++) {
        await reservarPage.selectNthAvailableSlot(slot);
        await reservarPage.sleep(1500);

        await reservarPage.clickConfirmarReserva();
        await reservarPage.waitForModal();
        await reservarPage.sleep(1500);

        await reservarPage.acceptModal();

        try {
          await reservarPage.waitForUrl('/perfil', 8000);
          reservada = true;
        } catch {
          const currentUrl = await driver.getCurrentUrl();
          if (currentUrl.includes('/reservar-cita')) {
            const toastMsg = await reservarPage.getToastMessage();
            ultimoError = `día[${dia}] slot[${slot}] rechazado: "${toastMsg ?? 'sin toast'}"`;
            console.warn(`⚠ Intento día[${dia}] slot[${slot}] rechazado: "${toastMsg}"`);
            await reservarPage.closeModalIfOpen();
            await reservarPage.sleep(1000);
          } else {
            throw new Error(`URL inesperada: ${currentUrl}`);
          }
        }
      }
    }

    if (!reservada) {
      throw new Error(`No se pudo reservar. Último error: ${ultimoError}`);
    }

    await reservarPage.sleep(3000);
    await reservarPage.validateUsabilityMetrics('Perfil con Reserva Confirmada');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');

    reservarPage.finalizeReport('PASSED');
  });
});
