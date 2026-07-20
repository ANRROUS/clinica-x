import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { getLastDoctor } from '../../utils/lastDoctor';
import { DoctorLoginPage } from '../../pages/DoctorLoginPage';

describe('2.1 — Login de médico', () => {
  let driver: WebDriver;
  let loginPage: DoctorLoginPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new DoctorLoginPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login con credenciales del último médico creado → redirect a /doctor/calendario', async () => {
    const { email, password } = getLastDoctor();

    await loginPage.navigate();
    await loginPage.sleep(4000); // [captura] formulario login médico vacío — reducir a 1500ms

    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.sleep(4000); // [captura] formulario relleno antes de submit — reducir a 1000ms

    await loginPage.submit();

    try {
      await loginPage.waitForRedirect();
    } catch {
      const toastMsg = await loginPage.getToastMessage();
      throw new Error(
        `Login de médico falló. Mensaje del sistema: "${toastMsg ?? '(sin toast)'}". ` +
        `Email usado: ${email}. Verificar que A-03 se ejecutó y el médico existe en la BD.`,
      );
    }

    await loginPage.sleep(4000); // [captura] portal médico cargado (/doctor/calendario) — reducir a 1500ms
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/doctor/calendario');
  });
});
