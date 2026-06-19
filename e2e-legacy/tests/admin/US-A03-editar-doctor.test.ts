import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminDoctorFormPage } from '../../pages/AdminDoctorFormPage';

describe('US-A03 — Editar información de médico', () => {
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
    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Editar doctor existente', async () => {
    formPage.setCaseId('US-A03-EDITAR', 'Editar médico existente');

    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(1500);

    try {
      await dashboardPage.clickEditarDoctorByName('Doctor Test Usabilidad');
    } catch {
      await dashboardPage.clickEditarPrimerDoctor();
    }

    await formPage.waitForUrl('/edit', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(2000);
    await formPage.validateUsabilityMetrics('Formulario Editar Doctor');

    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Actualizado');
    await formPage.fillTelefono('912345678');
    await formPage.ensureValidDni();
    await formPage.ensureValidEmail();
    await formPage.sleep(1500);

    await formPage.clickHorarioCell(1, 0);
    await formPage.sleep(1000);

    await formPage.clickGuardarCambios();

    try {
      await formPage.waitForUrl('/admin/dashboard', 15000);
    } catch {
      const toastMsg = await formPage.getToastMessage();
      throw new Error(`No se completó la edición del doctor. Mensaje: "${toastMsg ?? 'sin toast'}"`);
    }

    await formPage.sleep(1500);
    await formPage.validateUsabilityMetrics('Dashboard post-actualización');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');

    formPage.finalizeReport('PASSED');
  });
});
