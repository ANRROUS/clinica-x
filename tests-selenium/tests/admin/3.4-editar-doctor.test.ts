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

  test('Editar doctor existente → formulario modal → guardar cambios', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(4000); // [captura] dashboard visible — reducir a 1500ms

    // Tras el pull, el botón editar ya no navega a /edit sino que abre un modal.
    // Se intenta editar "Doctor Test Selenium" (si 3.3 lo creó); si no existe,
    // se edita el primer médico de la tabla.
    try {
      await dashboardPage.clickEditarDoctorByName('Doctor Test Selenium');
    } catch {
      await dashboardPage.clickEditarPrimerDoctor();
    }

    // El modal carga el formulario (puede mostrar skeleton mientras hace fetch del doctor).
    await formPage.waitForLoad();
    await formPage.sleep(4000); // [captura] modal con formulario pre-cargado — reducir a 2000ms

    await formPage.fillNombre('Doctor Test');
    await formPage.fillApellido('Actualizado');
    await formPage.fillTelefono('912345678');
    // Por si acaso el precargado de DNI/email falla (el pull lo arreglará, pero se mantiene como red de seguridad).
    await formPage.ensureValidDni();
    await formPage.ensureValidEmail();
    await formPage.sleep(4000); // [captura] datos actualizados en el formulario — reducir a 1500ms

    // Marcar celda adicional: martes (dayIndex=1), primera fila del turno del doctor.
    await formPage.clickHorarioCell(1, 0);
    await formPage.sleep(4000); // [captura] celda de horario marcada — reducir a 1000ms

    await formPage.clickGuardarCambios();

    // El éxito se detecta por el cierre del modal (input[name="nombre"] desaparece del DOM).
    // Si tras 15s sigue visible, la edición falló — se captura el toast y se falla el test.
    try {
      await formPage.waitForFormHidden();
    } catch {
      const toastMsg = await formPage.getToastMessage();
      throw new Error(
        `No se completó la edición del doctor (modal no se cerró). ` +
        `Mensaje real del sistema: "${toastMsg ?? '(sin toast detectado)'}". ` +
        'Puede reflejar una falla real de los microservicios de administración, no un error del test.',
      );
    }

    await formPage.sleep(4000); // [captura] dashboard con cambios guardados — reducir a 1500ms
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/admin/dashboard');
  });
});
