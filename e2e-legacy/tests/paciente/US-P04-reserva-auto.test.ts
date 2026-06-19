import { WebDriver, By } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS, URLS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';

describe('US-P04 — Reserva automática de cita', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let reservarPage: ReservarCitaPage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    reservarPage = new ReservarCitaPage(driver);

    await homePage.navigate();
    await homePage.goToLogin();
    await loginPage.login(
      CREDENTIALS.paciente.dni,
      CREDENTIALS.paciente.email,
      CREDENTIALS.paciente.password,
    );
    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(1500);
  });

  afterAll(async () => {
    // Cleanup
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

  test('Reserva automática → redirect a /perfil', async () => {
    reservarPage.setCaseId('US-P04', 'Reserva automática de cita');

    await homePage.navigate();
    await homePage.sleep(2000);

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(2000);
    await reservarPage.validateUsabilityMetrics('Reserva Automática - Especialidad');

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(2000);
    await reservarPage.validateUsabilityMetrics('Reserva Automática - Médicos');

    await reservarPage.clickAutomatico();
    await reservarPage.sleep(3000);

    try {
      await reservarPage.waitForUrl('/perfil', 20000);
    } catch {
      const currentUrl = await driver.getCurrentUrl();
      const toastMsg = await reservarPage.getToastMessage();
      throw new Error(
        `Reserva automática falló (URL: ${currentUrl}). Mensaje: "${toastMsg ?? 'sin toast'}"`,
      );
    }

    await reservarPage.sleep(3000);
    await reservarPage.validateUsabilityMetrics('Perfil post-reserva automática');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');

    reservarPage.finalizeReport('PASSED');
  });
});
