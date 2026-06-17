import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';

describe('3.2 — Verificar dashboard con KPIs', () => {
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
    await loginPage.sleep(2000); // dashboard cargado tras login
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Existen 4 KPIs y al menos una fila de médicos en la tabla', async () => {
    await dashboardPage.waitForLoad();
    await dashboardPage.sleep(2000); // tabla y KPIs visibles

    const kpiCards = await dashboardPage.getKpiCards();
    expect(kpiCards.length).toBe(4);

    const doctorRows = await dashboardPage.getDoctorRows();
    expect(doctorRows.length).toBeGreaterThanOrEqual(1);
  });
});
