import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { RegisterPage } from '../../pages/RegisterPage';

// Datos base válidos en formato; se sobreescribe el campo que se quiere probar en cada test.
const BASE_VALID = {
  nombre: 'Carlos',
  apellido: 'Prueba',
  dni: '87654321',
  email: 'carlos.prueba.selenium@test.com',
  password: 'Test1234!',
};

describe('1.9 — Registro de paciente — flujos no exitosos (unhappy path)', () => {
  let driver: WebDriver;
  let registerPage: RegisterPage;

  beforeAll(async () => {
    driver = await buildDriver();
    registerPage = new RegisterPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await registerPage.navigate();
    await registerPage.sleep(4000); // [captura] formulario de registro vacío — reducir a 1000ms
  });

  // ── Validaciones client-side (Zod / react-hook-form) ─────────────────────

  test('Nombre vacío → error inline "El nombre es requerido"', async () => {
    await registerPage.fillForm({
      nombre: '',
      apellido: BASE_VALID.apellido,
      dni: BASE_VALID.dni,
      email: BASE_VALID.email,
      password: BASE_VALID.password,
    });
    await registerPage.sleep(5000); // [captura] formulario con nombre vacío antes de submit — reducir a 1000ms

    await registerPage.submit();
    await registerPage.sleep(5000); // [captura] error inline bajo campo Nombre — reducir a 1000ms

    const errors = await registerPage.getFieldErrors();
    expect(errors.some((e) => e.includes('nombre') || e.includes('requerido'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  test('DNI con menos de 8 dígitos → error inline "El DNI debe tener 8 dígitos"', async () => {
    await registerPage.fillForm({
      nombre: BASE_VALID.nombre,
      apellido: BASE_VALID.apellido,
      dni: '1234',
      email: BASE_VALID.email,
      password: BASE_VALID.password,
    });
    await registerPage.sleep(5000); // [captura] formulario con DNI inválido antes de submit — reducir a 1000ms

    await registerPage.submit();
    await registerPage.sleep(5000); // [captura] error inline bajo campo DNI — reducir a 1000ms

    const errors = await registerPage.getFieldErrors();
    expect(errors.some((e) => e.includes('8 dígitos') || e.includes('DNI'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  test('Contraseña con menos de 8 caracteres → error inline "Mínimo 8 caracteres"', async () => {
    await registerPage.fillForm({
      nombre: BASE_VALID.nombre,
      apellido: BASE_VALID.apellido,
      dni: BASE_VALID.dni,
      email: BASE_VALID.email,
      password: 'corta',
    });
    await registerPage.sleep(5000); // [captura] formulario con contraseña corta antes de submit — reducir a 1000ms

    await registerPage.submit();
    await registerPage.sleep(5000); // [captura] error inline bajo campo Contraseña — reducir a 1000ms

    const errors = await registerPage.getFieldErrors();
    expect(errors.some((e) => e.includes('8 caracteres') || e.includes('Mínimo'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  test('Contraseñas que no coinciden → error inline "Las contraseñas no coinciden"', async () => {
    // fillForm pone la misma contraseña en ambos campos; sobrescribimos confirmPassword manualmente.
    await registerPage.fillForm({
      nombre: BASE_VALID.nombre,
      apellido: BASE_VALID.apellido,
      dni: BASE_VALID.dni,
      email: BASE_VALID.email,
      password: BASE_VALID.password,
    });
    // Sobreescribir confirmPassword con un valor diferente
    const { By } = await import('selenium-webdriver');
    const confirmInput = await registerPage['driver'].findElement(
      By.css('input[name="confirmPassword"]'),
    );
    await confirmInput.clear();
    await confirmInput.sendKeys('OtraClaveDistinta!');
    await registerPage.sleep(5000); // [captura] formulario con contraseñas distintas antes de submit — reducir a 1000ms

    await registerPage.submit();
    await registerPage.sleep(5000); // [captura] error inline bajo campo Confirmar — reducir a 1000ms

    const errors = await registerPage.getFieldErrors();
    expect(errors.some((e) => e.includes('no coinciden') || e.includes('contraseña'))).toBe(true);

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  // ── Error server-side (DNI ya registrado) ────────────────────────────────
  // El servidor retorna 4xx (no 401), el interceptor de axios NO hace reload.
  // El onSubmit → else/catch llama toast.error con el mensaje del servidor.

  test('DNI ya registrado → toast de error del servidor, sin redirigir', async () => {
    await registerPage.setupToastInterceptor();

    await registerPage.fillForm({
      nombre: BASE_VALID.nombre,
      apellido: BASE_VALID.apellido,
      dni: CREDENTIALS.paciente.dni, // DNI ya existente en la BD
      email: `nuevo.${Date.now()}@test.com`, // email fresco para no duplicar email
      password: BASE_VALID.password,
    });
    await registerPage.sleep(5000); // [captura] formulario con DNI duplicado antes de submit — reducir a 1000ms

    await registerPage.submit();

    const toastText = await registerPage.getCapturedToast(15000);
    await registerPage.sleep(5000); // [captura] toast de error del servidor visible — reducir a 1500ms

    expect(toastText).not.toBeNull();

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
    expect(url).not.toContain('/perfil');
  });
});
