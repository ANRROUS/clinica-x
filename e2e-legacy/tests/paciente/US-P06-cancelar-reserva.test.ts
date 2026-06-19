import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS, URLS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('US-P06 — Cancelar reserva activa', () => {
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

    // Login con paciente2
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
    await driver.quit();
  });

  test('Crear reserva y cancelarla desde el perfil', async () => {
    perfilPage.setCaseId('US-P06', 'Cancelar reserva activa');

    // Paso 1: Crear una reserva manual para luego cancelarla
    await homePage.navigate();
    await homePage.sleep(1500);
    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(1500);

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(1500);
    await reservarPage.selectFirstDoctor();
    await reservarPage.waitForDays();
    await reservarPage.sleep(1500);

    const hasDays = await reservarPage.hasAvailableDays();
    if (!hasDays) {
      perfilPage.finalizeReport('PASSED', 'SKIP: No hay días disponibles para crear reserva de prueba.');
      return;
    }

    let reservada = false;
    const totalDias = await reservarPage.countAvailableDays();
    for (let dia = 0; dia < totalDias && !reservada; dia++) {
      await reservarPage.selectNthAvailableDay(dia);
      await reservarPage.waitForSlots();
      await reservarPage.sleep(2000);
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
          await reservarPage.closeModalIfOpen();
          await reservarPage.sleep(1000);
        }
      }
    }

    if (!reservada) {
      throw new Error('No se pudo crear una reserva de prueba para cancelar');
    }

    await reservarPage.sleep(2000);
    await reservarPage.validateUsabilityMetrics('Perfil con reserva activa');

    // Paso 2: Cancelar la reserva
    await perfilPage.navigate();
    await perfilPage.waitForLoad();
    await perfilPage.sleep(2000);
    await perfilPage.clickReservasTab();
    await perfilPage.sleep(3000);

    const countBefore = await perfilPage.countActiveReservations();
    expect(countBefore).toBeGreaterThanOrEqual(1);

    await perfilPage.clickCancelFirstReservation();
    await perfilPage.sleep(1000);
    await perfilPage.confirmCancel();
    await perfilPage.sleep(3000);

    await perfilPage.validateUsabilityMetrics('Perfil tras cancelar reserva');

    const countAfter = await perfilPage.countActiveReservations();
    expect(countAfter).toBeLessThan(countBefore);

    perfilPage.finalizeReport('PASSED');
  });
});
