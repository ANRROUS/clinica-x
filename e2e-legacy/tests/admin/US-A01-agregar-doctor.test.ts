import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminDoctorFormPage } from '../../pages/AdminDoctorFormPage';

describe('US-A01 — Agregar nuevo médico y configurar horario', () => {
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

  test('Dashboard con KPIs y agregar doctor', async () => {
    dashboardPage.setCaseId('US-A01-DASHBOARD', 'Dashboard admin y agregar doctor');

    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(2000);
    await dashboardPage.validateUsabilityMetrics('Panel de Administrador');

    const kpiCards = await dashboardPage.getKpiCards();
    expect(kpiCards.length).toBe(4);

    const doctorRows = await dashboardPage.getDoctorRows();
    expect(doctorRows.length).toBeGreaterThanOrEqual(1);

    dashboardPage.finalizeReport('PASSED');
  });

  test('Crear doctor con horario de atención', async () => {
    formPage.setCaseId('US-A01-AGREGAR', 'Agregar nuevo médico');

    await dashboardPage.clickAgregarDoctor();
    await formPage.waitForUrl('/admin/doctors/new', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(1500);
    await formPage.validateUsabilityMetrics('Formulario Nuevo Doctor');

    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Usabilidad');
    await formPage.fillDni('99887766');
    await formPage.fillEmail('doctor.usabilidad@test.com');
    await formPage.fillTelefono('987654321');
    await formPage.fillUsuario('drUsabilidad');
    await formPage.selectEspecialidad();
    await formPage.selectTurnoManana();
    await formPage.fillPassword('Doctor123!');
    await formPage.sleep(1500);

    await formPage.clickHorarioCell(0, 0);
    await formPage.sleep(1000);

    await formPage.clickGuardarCambios();

    try {
      await formPage.waitForUrl('/admin/dashboard', 15000);
    } catch {
      const toastMsg = await formPage.getToastMessage();
      throw new Error(`No se completó el alta del doctor. Mensaje: "${toastMsg ?? 'sin toast'}"`);
    }

    await formPage.sleep(1500);
    await formPage.validateUsabilityMetrics('Dashboard post-creación de doctor');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');

    formPage.finalizeReport('PASSED');
  });
});
