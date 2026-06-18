import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminDoctorFormPage } from '../../pages/AdminDoctorFormPage';

describe('3.4 — Editar doctor: nombre, teléfono y horario', () => {
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

  test('Editar doctor existente → redirect a /admin/dashboard', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(1500); // dashboard visible

    // Si "Doctor Test Selenium" (creado en 3.3) existe, se edita ese.
    // Si no (porque 3.3 falló por la inestabilidad de microservicios),
    // se cae al primer médico de la tabla, como contempla el plan original.
    try {
      await dashboardPage.clickEditarDoctorByName('Doctor Test Selenium');
    } catch {
      await dashboardPage.clickEditarPrimerDoctor();
    }

    await formPage.waitForUrl('/edit', 8000);
    await formPage.waitForLoad();
    await formPage.sleep(2000); // formulario con datos pre-cargados visible

    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Actualizado');
    await formPage.fillTelefono('912345678');
    // El formulario de edición no siempre precarga DNI/email válidos desde la
    // BD (bug conocido del admin). Se rellenan solo si vienen vacíos/inválidos,
    // para llegar al submit real y no quedar bloqueados por validación del navegador.
    await formPage.ensureValidDni();
    await formPage.ensureValidEmail();
    await formPage.sleep(1500); // datos actualizados

    // Segunda columna del grid (día siguiente), primera fila de horario del turno actual del doctor.
    await formPage.clickHorarioCell(1, 0);
    await formPage.sleep(1000); // celda adicional marcada

    await formPage.clickGuardarCambios();

    try {
      await formPage.waitForUrl('/admin/dashboard', 15000);
    } catch {
      const toastMsg = await formPage.getToastMessage();
      throw new Error(
        `No se completó la edición del doctor. Mensaje real del sistema: "${toastMsg ?? '(sin toast detectado)'}". ` +
        'Puede reflejar una falla real de los microservicios de administración, no un error del test.',
      );
    }

    await formPage.sleep(1500); // dashboard cargado con los cambios
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
