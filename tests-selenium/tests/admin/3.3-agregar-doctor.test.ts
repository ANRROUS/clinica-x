import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { saveLastDoctor } from '../../utils/lastDoctor';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminDoctorFormPage } from '../../pages/AdminDoctorFormPage';

describe('3.3 — Agregar nuevo doctor', () => {
  let driver: WebDriver;
  let loginPage: AdminLoginPage;
  let dashboardPage: AdminDashboardPage;
  let formPage: AdminDoctorFormPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new AdminLoginPage(driver);
    dashboardPage = new AdminDashboardPage(driver);
    formPage = new AdminDoctorFormPage(driver);

    await loginPage.navigate();
    await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
    await loginPage.waitForRedirect();
    await loginPage.sleep(4000); // [captura] dashboard cargado tras login — reducir a 2000ms
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Crear doctor desde "Nuevo Doctor" → redirect a /admin/dashboard', async () => {
    const ts = Date.now();
    const dniRandom = ts.toString().slice(-8);
    const telRandom = '9' + ts.toString().slice(-8);

    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(4000); // [captura] dashboard visible — reducir a 1500ms

    await dashboardPage.clickAgregarDoctor();
    await formPage.waitForUrl('/admin/doctors/new', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(4000); // [captura] formulario vacío visible — reducir a 1500ms

    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Selenium');
    await formPage.fillDni(dniRandom);
    await formPage.fillEmail(`doctor.selenium.${dniRandom}@test.com`);
    await formPage.fillTelefono(telRandom);
    await formPage.selectEspecialidad();
    await formPage.selectTurnoManana();
    await formPage.fillPassword('12345678');
    await formPage.sleep(4000); // [captura] formulario relleno — reducir a 1500ms

    // Lunes (día 0), primera fila de slots (00:00-00:30 en turno Mañana — válido por frontend)
    await formPage.clickHorarioCell(0, 0);
    await formPage.sleep(4000); // [captura] celda de horario marcada — reducir a 1000ms

    await formPage.clickGuardarCambios();

    try {
      await formPage.waitForUrl('/admin/dashboard', 15000);
    } catch {
      const toastMsg = await formPage.getToastMessage();
      throw new Error(
        `No se completó el alta del doctor. Mensaje real del sistema: "${toastMsg ?? '(sin toast detectado)'}". ` +
        'Puede reflejar una falla real de los microservicios de administración, no un error del test.',
      );
    }

    // Guardar credenciales del médico recién creado para los tests M-01 y M-02.
    saveLastDoctor({ email: `doctor.selenium.${dniRandom}@test.com`, password: '12345678' });

    await formPage.sleep(4000); // [captura] dashboard cargado con doctor creado — reducir a 1500ms
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
