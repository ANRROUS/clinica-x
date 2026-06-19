import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminDoctorFormPage } from '../../pages/AdminDoctorFormPage';

describe('3.6 — Agregar médico con DNI duplicado (unhappy path)', () => {
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
    await loginPage.sleep(4000); // [captura] dashboard cargado — reducir a 2000ms
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('DNI ya existente → sistema muestra error, no redirige', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(4000); // [captura] dashboard visible — reducir a 1500ms

    await dashboardPage.clickAgregarDoctor();
    await formPage.waitForUrl('/admin/doctors/new', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(4000); // [captura] formulario vacío visible — reducir a 1500ms

    // Se usa el DNI del admin (00000000), que siempre existe en la BD.
    // Esto garantiza que el error de duplicado sea determinista.
    await formPage.fillNombre('Doctor');
    await formPage.fillApellido('Duplicado');
    await formPage.fillDni(CREDENTIALS.admin.dni);
    await formPage.fillEmail('doctor.duplicado@test.com');
    await formPage.fillTelefono('999000111');
    await formPage.fillUsuario('drDuplicado');
    await formPage.selectEspecialidad();
    await formPage.selectTurnoManana();
    await formPage.fillPassword('12345678');
    await formPage.sleep(4000); // [captura] formulario relleno con DNI duplicado — reducir a 1500ms

    await formPage.clickHorarioCell(0, 0);
    await formPage.sleep(2000); // celda marcada

    await formPage.clickGuardarCambios();
    await formPage.sleep(4000); // [captura] respuesta del sistema (toast de error) — reducir a 2000ms

    // El sistema no debe redirigir: el formulario sigue en /admin/doctors/new.
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/doctors/new');

    // Debe aparecer un toast con el motivo real del error.
    const toastMsg = await formPage.getToastMessage();
    expect(toastMsg).not.toBeNull();
    console.log(`✓ Error capturado correctamente: "${toastMsg}"`);
  });
});
