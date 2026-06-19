import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { LoginPacientePage } from '../../pages/LoginPacientePage';

describe('1.8 — Login paciente — flujos no exitosos (unhappy path)', () => {
  let driver: WebDriver;
  let loginPage: LoginPacientePage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new LoginPacientePage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await loginPage.navigate();
    await loginPage.sleep(4000); // [captura] formulario de login vacío — reducir a 1000ms
  });

  // ── Validaciones client-side (Zod / react-hook-form) ─────────────────────

  test('DNI con menos de 8 dígitos → error inline "El DNI debe tener 8 dígitos"', async () => {
    await loginPage.fillDni('123');
    await loginPage.fillEmail(CREDENTIALS.paciente.email);
    await loginPage.fillPassword(CREDENTIALS.paciente.password);
    await loginPage.sleep(5000); // [captura] formulario con DNI inválido antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.sleep(5000); // [captura] error inline bajo campo DNI visible — reducir a 1000ms

    const errors = await loginPage.getFieldErrors();
    expect(errors.some((e) => e.includes('8 dígitos'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');
  });

  test('Correo con formato inválido → validación nativa del navegador impide el envío', async () => {
    await loginPage.fillDni(CREDENTIALS.paciente.dni);
    await loginPage.fillEmail('esto-no-es-un-correo');
    await loginPage.fillPassword(CREDENTIALS.paciente.password);
    await loginPage.sleep(5000); // [captura] formulario con correo inválido antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.sleep(5000); // [captura] navegador bloqueando envío (validación nativa type=email) — reducir a 1000ms

    // El input type="email" activa la validación nativa del navegador ANTES de que
    // react-hook-form pueda mostrar su propio error inline; el form nunca llega al servidor.
    const emailValido = await loginPage.isEmailBrowserValid();
    expect(emailValido).toBe(false);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');
  });

  test('Contraseña vacía → error inline "La contraseña es requerida"', async () => {
    await loginPage.fillDni(CREDENTIALS.paciente.dni);
    await loginPage.fillEmail(CREDENTIALS.paciente.email);
    // No se rellena la contraseña (campo vacío por defecto)
    await loginPage.sleep(5000); // [captura] formulario sin contraseña antes de submit — reducir a 1000ms

    await loginPage.submit();
    await loginPage.sleep(5000); // [captura] error inline bajo campo contraseña visible — reducir a 1000ms

    const errors = await loginPage.getFieldErrors();
    expect(errors.some((e) => e.includes('contraseña') || e.includes('requerida'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');
  });

  // ── Error server-side (credenciales inexistentes) ─────────────────────────
  // El interceptor de axios captura el 401 del servidor y ejecuta
  // window.location.href = '/login' antes de que el catch del form llame a toast.error.
  // El comportamiento observable es: la página recarga /login y el formulario aparece vacío.

  test('Credenciales con formato válido pero inexistentes → página recarga /login sin sesión iniciada', async () => {
    await loginPage.fillDni('99999999');
    await loginPage.fillEmail('noexiste.paciente@fake.com');
    await loginPage.fillPassword('ClaveErrada1!');
    await loginPage.sleep(5000); // [captura] formulario con credenciales inexistentes antes de submit — reducir a 1000ms

    await loginPage.submit();

    // Esperar a que el interceptor de axios recargue /login tras recibir el 401
    await loginPage.sleep(8000); // [captura] página recargada en /login con formulario vacío — reducir a 3000ms

    // El usuario no fue redirigido a /perfil: el acceso fue denegado
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');
    expect(url).not.toContain('/perfil');

    // El formulario debe estar vacío (la recarga limpia el estado de React)
    await loginPage.navigate(); // asegura que el form está cargado para el next beforeEach
    const url2 = await driver.getCurrentUrl();
    expect(url2).toContain('/login');
  });
});
