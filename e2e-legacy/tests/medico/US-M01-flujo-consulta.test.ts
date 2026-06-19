import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { CREDENTIALS } from '../../utils/credentials';
import { DoctorLoginPage } from '../../pages/DoctorLoginPage';
import { DoctorCalendarioPage } from '../../pages/DoctorCalendarioPage';
import { DoctorPacientesPage } from '../../pages/DoctorPacientesPage';

describe('US-M01 — Flujo médico: calendario, consulta, diagnóstico y finalización', () => {
  let driver: WebDriver;
  let loginPage: DoctorLoginPage;
  let calendarioPage: DoctorCalendarioPage;
  let pacientesPage: DoctorPacientesPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new DoctorLoginPage(driver);
    calendarioPage = new DoctorCalendarioPage(driver);
    pacientesPage = new DoctorPacientesPage(driver);
  });

  afterAll(async () => {
    try {
      await driver.executeScript('localStorage.clear(); sessionStorage.clear();');
    } catch {
      // ignorar si la página no cargó
    }
    await driver.quit();
  });

  test('2.1 Login de médico → calendario', async () => {
    loginPage.setCaseId('US-M01-LOGIN', 'Login médico y calendario');

    await loginPage.navigate();
    await loginPage.sleep(1500);
    await loginPage.validateUsabilityMetrics('Login Médico');

    await loginPage.login(CREDENTIALS.medico.email, CREDENTIALS.medico.password);
    await loginPage.waitForRedirect();
    await loginPage.sleep(2000);
    await loginPage.validateUsabilityMetrics('Portal del Médico - Calendario');

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/doctor/calendario');

    loginPage.finalizeReport('PASSED');
  });

  test('2.2 Calendario: cambio de vistas (mensual/semanal/diario)', async () => {
    calendarioPage.setCaseId('US-M01-CALENDARIO', 'Navegación de calendario');

    await calendarioPage.navigate();
    await calendarioPage.waitForLoad();
    await calendarioPage.sleep(2000);
    await calendarioPage.validateUsabilityMetrics('Calendario Mensual');

    await calendarioPage.switchToWeeklyView();
    await calendarioPage.sleep(1500);
    await calendarioPage.validateUsabilityMetrics('Calendario Semanal');

    await calendarioPage.switchToDailyView();
    await calendarioPage.sleep(1500);
    await calendarioPage.validateUsabilityMetrics('Calendario Diario');

    calendarioPage.finalizeReport('PASSED');
  });

  test('2.3 Abrir consulta activa y agregar análisis', async () => {
    pacientesPage.setCaseId('US-M01-CONSULTA', 'Consulta activa - análisis y medicación');

    await pacientesPage.navigate();
    await pacientesPage.sleep(2000);
    await pacientesPage.validateUsabilityMetrics('Lista de Pacientes');

    await pacientesPage.waitForPacienteActual();
    await pacientesPage.clickPacienteActual();
    await pacientesPage.waitForConsultaActualTab();
    await pacientesPage.sleep(2000);
    await pacientesPage.validateUsabilityMetrics('Consulta Actual');

    await pacientesPage.clickAgregarAnalisis();
    await pacientesPage.fillAnalisis('Hemograma completo');
    await pacientesPage.confirmAnalisis();
    await pacientesPage.sleep(2000);
    await pacientesPage.waitForText('Hemograma completo', 8000);

    await pacientesPage.clickAgregarMedicamento();
    await pacientesPage.fillMedicamento('Paracetamol', '5', '8 hrs.');
    await pacientesPage.sleep(2000);
    await pacientesPage.waitForText('Paracetamol', 8000);

    pacientesPage.finalizeReport('PASSED');
  });

  test('2.4 Finalizar consulta → redirección', async () => {
    pacientesPage.setCaseId('US-M01-FINALIZAR', 'Finalizar consulta');

    await pacientesPage.navigate();
    await pacientesPage.sleep(2000);
    await pacientesPage.waitForPacienteActual();
    await pacientesPage.clickPacienteActual();
    await pacientesPage.waitForConsultaActualTab();
    await pacientesPage.sleep(1500);

    await pacientesPage.clickFinalizarConsulta();
    await pacientesPage.confirmarFinalizacion();
    await pacientesPage.sleep(3000);
    await pacientesPage.validateUsabilityMetrics('Post-finalización de consulta');

    const url = await driver.getCurrentUrl();
    const isCalendario = url.includes('/doctor/calendario');
    const isPacientes = url.includes('/doctor/pacientes');
    expect(isCalendario || isPacientes).toBe(true);

    pacientesPage.finalizeReport('PASSED');
  });
});
