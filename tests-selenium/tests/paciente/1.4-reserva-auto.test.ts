import { WebDriver, By } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS, URLS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';

describe('1.4 — Reserva automática de cita', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let loginPage: LoginPacientePage;
  let reservarPage: ReservarCitaPage;

  beforeAll(async () => {
    driver = await buildDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPacientePage(driver);
    reservarPage = new ReservarCitaPage(driver);

    // Login desde home
    await homePage.navigate();
    await homePage.sleep(3000); // home visible

    await homePage.goToLogin();
    await loginPage.sleep(3000); // formulario vacío visible

    await loginPage.login(
      CREDENTIALS.paciente.dni,
      CREDENTIALS.paciente.email,
      CREDENTIALS.paciente.password,
    );
    await loginPage.sleep(3000); // formulario relleno antes de submit

    await loginPage.waitForRedirect('/perfil');
    await loginPage.sleep(3000); // /perfil cargado tras login
  });

  afterAll(async () => {
    // Cleanup: cancelar TODAS las citas activas de este paciente para dejar el
    // único slot semanal del médico activo (pparker) libre para el siguiente run.
    try {
      await driver.get(`${URLS.base}/perfil`);
      await reservarPage.sleep(3000);

      const reservasTab = await reservarPage.waitForClickable(
        By.xpath("//button[contains(text(), 'Reservas')]"), 8000
      );
      await driver.executeScript('arguments[0].click();', reservasTab);
      await reservarPage.sleep(4000);

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
        await reservarPage.sleep(2000);
        cancelado++;
      }
      if (cancelado > 0) console.log(`✓ Cleanup: ${cancelado} cita(s) cancelada(s).`);
    } catch {
      console.warn('⚠ Cleanup: no se pudo cancelar citas (normal si el test no completó la reserva).');
    }

    await driver.quit();
  });

  test('Seleccionar especialidad → Automático → redirect directo a /perfil', async () => {
    await homePage.navigate();
    await homePage.sleep(3000); // home visible (logueado)

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(3000); // página reservar-cita cargada

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(3000); // especialidad seleccionada + lista de médicos visible

    await reservarPage.clickAutomatico();
    await reservarPage.sleep(3000); // botón pulsado, procesando

    // El booking automático redirige directo sin modal de confirmación.
    // Si no hay turnos libres o el microservicio de citas falla, la URL no
    // cambia y aparece un toast con el motivo real — lo capturamos y fallamos
    // el test explícitamente en vez de marcarlo como SKIP silencioso.
    try {
      await reservarPage.waitForUrl('/perfil', 20000);
    } catch {
      const currentUrl = await driver.getCurrentUrl();
      const toastMsg = await reservarPage.getToastMessage();
      throw new Error(
        `La reserva automática no se completó (URL actual: ${currentUrl}). ` +
        `Mensaje real del sistema: "${toastMsg ?? '(sin toast detectado)'}". ` +
        'Esto refleja una falla real del microservicio de citas o falta de turnos disponibles, no un error del test.',
      );
    }

    await reservarPage.sleep(3000); // /perfil cargado con reserva confirmada
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
