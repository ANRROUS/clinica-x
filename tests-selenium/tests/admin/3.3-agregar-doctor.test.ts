import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
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
    await loginPage.sleep(2000); // dashboard cargado tras login
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Crear doctor desde "Nuevo Doctor" → redirect a /admin/dashboard', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(1500); // dashboard visible

    await dashboardPage.clickAgregarDoctor();
    await formPage.waitForUrl('/admin/doctors/new', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(1500); // formulario vacío visible

    // El formulario separa Nombre y Apellido; el plan original pedía un
    // "nombre completo" único, así que se reparte entre ambos campos.
    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Selenium');
    await formPage.fillDni('99887766'); // DNI asumido como no existente en BD
    await formPage.fillEmail('doctor.selenium@test.com');
    await formPage.fillTelefono('987654321');
    await formPage.fillUsuario('drSelenium');
    await formPage.selectEspecialidad();
    await formPage.selectTurnoManana();
    await formPage.fillPassword('Doctor123!');
    await formPage.sleep(1500); // formulario relleno

    // Lunes (día 0) 08:00-08:30 (primera fila del turno Mañana)
    await formPage.clickHorarioCell(0, 0);
    await formPage.sleep(1000); // celda de horario marcada

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

    await formPage.sleep(1500); // dashboard cargado con el doctor creado
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
