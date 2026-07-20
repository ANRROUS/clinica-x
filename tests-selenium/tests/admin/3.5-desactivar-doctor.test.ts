import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';

describe('3.5 — Desactivar un médico', () => {
  let driver: WebDriver;
  let loginPage: AdminLoginPage;
  let dashboardPage: AdminDashboardPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new AdminLoginPage(driver);
    dashboardPage = new AdminDashboardPage(driver);

    await loginPage.navigate();
    await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
    await loginPage.waitForRedirect();
    await loginPage.sleep(4000); // [captura] dashboard cargado — reducir a 2000ms
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Toggle de estado → confirmar → médico queda Inactivo', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(4000); // [captura] tabla de médicos visible — reducir a 1500ms

    // Busca el primer médico activo (button title="Desactivar") y hace clic en su toggle.
    await dashboardPage.clickTogglePrimerDoctorActivo();
    await dashboardPage.sleep(4000); // [captura] modal de confirmación visible — reducir a 1000ms

    await dashboardPage.waitForConfirmStatusModal();
    await dashboardPage.sleep(4000); // [captura] texto del modal legible — reducir a 1000ms

    await dashboardPage.clickConfirmarCambioEstado();
    await dashboardPage.sleep(4000); // [captura] toast de éxito + tabla actualizada — reducir a 2000ms

    // El estado del primer médico de la tabla ahora debe ser Inactivo.
    // (La actualización es optimista: ocurre antes de que el servidor confirme.)
    const estado = await dashboardPage.getPrimerDoctorEstadoText();
    expect(estado).toBe('Inactivo');
  });
});
