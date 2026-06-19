import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { HomePage } from '../../pages/HomePage';
import { LoginPacientePage } from '../../pages/LoginPacientePage';
import { ReservarCitaPage } from '../../pages/ReservarCitaPage';
import { PerfilPacientePage } from '../../pages/PerfilPacientePage';

describe('1.4 — Reserva automática de cita', () => {
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

    await loginPage.fillDni(CREDENTIALS.paciente.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente.email);
    await loginPage.fillPassword(CREDENTIALS.paciente.password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.waitForRedirect('/perfil');
    await perfilPage.waitForLoad();
    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    // La reserva automática usa paciente (Luis), independiente de los tests M-02 y P-05
    // que usan paciente2 (Laura). No es necesario limpiarla para la suite.
    await driver.quit();
  });

  test('Seleccionar especialidad → Automático → redirect a /perfil', async () => {
    await homePage.navigate();
    await homePage.sleep(4000); // [captura] home visible (sesión activa) — reducir a 1500ms

    await homePage.goToReservarCita();
    await reservarPage.waitForSpecialties();
    await reservarPage.sleep(4000); // [captura] página reservar-cita con especialidades cargadas — reducir a 1500ms

    await reservarPage.selectFirstSpecialty();
    await reservarPage.waitForDoctors();
    await reservarPage.sleep(4000); // [captura] especialidad seleccionada + médicos visibles — reducir a 1500ms

    await reservarPage.clickAutomatico();
    await reservarPage.sleep(4000); // [captura] botón Automático pulsado, procesando — reducir a 1000ms

    // El booking automático selecciona médico y slot en el backend sin mostrar modal.
    // Si no hay turnos libres o el microservicio falla, la URL no cambia y aparece un toast.
    try {
      await reservarPage.waitForUrl('/perfil', 20000);
    } catch {
      const currentUrl = await driver.getCurrentUrl();
      const toastMsg = await reservarPage.getToastMessage();
      throw new Error(
        `La reserva automática no se completó (URL actual: ${currentUrl}). ` +
        `Mensaje real del sistema: "${toastMsg ?? '(sin toast detectado)'}". ` +
        'Verificar que al menos un médico activo tenga horarios futuros disponibles.',
      );
    }

    await perfilPage.waitForLoad();
    await perfilPage.sleep(4000); // [captura] /perfil cargado con reserva confirmada — reducir a 2000ms

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/perfil');
  });
});
