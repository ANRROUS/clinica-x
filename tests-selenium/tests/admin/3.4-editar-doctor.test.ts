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
    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Editar doctor existente → modal → guardar con datos nuevos', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(4000); // [captura] dashboard visible — reducir a 1500ms

    await dashboardPage.clickEditarPrimerDoctor();

    // El modal carga el formulario con los datos precargados del doctor.
    await formPage.waitForLoad();
    await formPage.sleep(4000); // [captura] modal con formulario pre-cargado — reducir a 2000ms

    // Leer el DNI precargado para usarlo como identificador en el nombre editado.
    const dni = await formPage.getFieldValue('dni');

    const ts = Date.now();
    const telRandom = '9' + ts.toString().slice(-8);

    await formPage.fillNombre(`Dr`);
    await formPage.fillApellido(dni);
    await formPage.fillTelefono(telRandom);
    await formPage.ensureValidEmail();

    await formPage.sleep(4000); // [captura] datos actualizados en el formulario — reducir a 1500ms

    // Marcar celdas en fila 1 (no fila 0, que ya fue seleccionada en 3.3 y se desmarcaría).
    // El doctor queda con lunes-fila0 (de 3.3) + lunes-fila1, martes-fila1, miércoles-fila1,
    // lo que da múltiples slots para que P-07 (reprogramar cita) tenga opciones disponibles.
    await formPage.clickHorarioCell(0, 1);
    await formPage.clickHorarioCell(1, 1);
    await formPage.clickHorarioCell(2, 1);
    await formPage.sleep(4000); // [captura] celdas de horario marcadas — reducir a 1000ms

    await formPage.clickGuardarCambios();

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
