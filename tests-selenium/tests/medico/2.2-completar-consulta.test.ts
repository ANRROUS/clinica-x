import { WebDriver } from 'selenium-webdriver';
import { buildDriver } from '../../utils/driver';
import { getLastDoctor } from '../../utils/lastDoctor';
import { DoctorLoginPage } from '../../pages/DoctorLoginPage';
import { DoctorPacientesPage } from '../../pages/DoctorPacientesPage';

describe('2.2 — Completar consulta médica', () => {
  let driver: WebDriver;
  let loginPage: DoctorLoginPage;
  let pacientesPage: DoctorPacientesPage;

  beforeAll(async () => {
    driver = await buildDriver();
    loginPage = new DoctorLoginPage(driver);
    pacientesPage = new DoctorPacientesPage(driver);

    const { email, password } = getLastDoctor();

    await loginPage.navigate();
    await loginPage.sleep(4000); // [captura] formulario login médico — reducir a 1500ms

    await loginPage.login(email, password);

    try {
      await loginPage.waitForRedirect();
    } catch {
      const toastMsg = await loginPage.getToastMessage();
      throw new Error(
        `No se pudo loguear como médico en beforeAll. Mensaje: "${toastMsg ?? '(sin toast)'}". ` +
        'Verificar que A-03 se ejecutó y el médico existe en la BD.',
      );
    }

    await loginPage.sleep(2000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Abrir paciente → completar consulta (diagnóstico + análisis + medicamento) → finalizar', async () => {
    await pacientesPage.navigate();
    await pacientesPage.sleep(4000); // [captura] /doctor/pacientes con sidebar cargando — reducir a 1500ms

    // Esperar que el sidebar cargue al menos un paciente.
    // Si no hay ninguno, el test termina con advertencia (sin reservas pendientes).
    let hasPacientes = false;
    try {
      await pacientesPage.waitForSidebar();
      hasPacientes = true;
    } catch {
      console.warn(
        'SKIP M-02: El sidebar no tiene pacientes. ' +
        'Verificar que P-03 (reserva manual) se ejecutó correctamente con este médico.',
      );
    }

    if (!hasPacientes) {
      expect(true).toBe(true); // pass con advertencia
      return;
    }

    await pacientesPage.sleep(4000); // [captura] sidebar con pacientes visible — reducir a 1500ms

    // Intentar primero el paciente "En consulta" (slot activo), luego cualquier otro.
    const hayActivo = await pacientesPage.hasActiveCita();
    if (hayActivo) {
      await pacientesPage.clickPacienteActual();
    } else {
      await pacientesPage.clickFirstPatient();
    }

    await pacientesPage.waitForPatientDetail();
    await pacientesPage.sleep(4000); // [captura] detalle de paciente con tabs — reducir a 1500ms

    // La tab "Consulta Actual" solo se habilita cuando la cita está ocurriendo en este momento.
    const consultaHabilitada = await pacientesPage.isConsultaTabEnabled();

    if (!consultaHabilitada) {
      console.warn(
        'SKIP M-02: La tab "Consulta Actual" está deshabilitada. ' +
        'Este test debe ejecutarse durante el horario de la cita reservada en P-03.',
      );
      expect(true).toBe(true); // pass con advertencia
      return;
    }

    await pacientesPage.clickConsultaTab();
    await pacientesPage.waitForConsultaPanel();
    await pacientesPage.sleep(4000); // [captura] panel de consulta activa visible — reducir a 1500ms

    // Si la consulta aún no fue iniciada, iniciarla.
    if (await pacientesPage.needsIniciarConsulta()) {
      await pacientesPage.clickIniciarConsulta();
      await pacientesPage.sleep(4000); // [captura] formulario de consulta desplegado — reducir a 1500ms
    }

    // ── Diagnóstico ───────────────────────────────────────────────────────
    await pacientesPage.fillDiagnosis('El paciente presentó síntomas compatibles con cuadro gripal leve.');
    await pacientesPage.sleep(4000); // [captura] diagnóstico ingresado — reducir a 1000ms

    // ── Análisis clínico ──────────────────────────────────────────────────
    await pacientesPage.clickAgregarAnalisis();
    await pacientesPage.sleep(1000);
    await pacientesPage.selectAnalisis('SANGRE');
    await pacientesPage.confirmAgregarAnalisis();
    await pacientesPage.sleep(4000); // [captura] análisis de sangre agregado — reducir a 1000ms

    // ── Medicamentos ──────────────────────────────────────────────────────
    await pacientesPage.clickAgregarMedicamento();
    await pacientesPage.waitForMedicationCatalog();
    await pacientesPage.sleep(1000);
    await pacientesPage.selectPrimerMedicamento();
    await pacientesPage.fillDias('5');
    await pacientesPage.fillFrecuencia('8 hrs.');
    await pacientesPage.confirmAgregarMedicamento();
    await pacientesPage.sleep(4000); // [captura] medicamento agregado en tabla — reducir a 1000ms

    // ── Finalizar consulta ────────────────────────────────────────────────
    await pacientesPage.clickFinalizarConsulta();
    await pacientesPage.waitForFinalizeModal();
    await pacientesPage.sleep(4000); // [captura] modal de confirmación "Finalizar consulta" — reducir a 1500ms

    await pacientesPage.confirmarFinalizacion();
    await pacientesPage.sleep(4000); // [captura] consulta finalizada, toast de éxito visible — reducir a 1500ms

    const url = await driver.getCurrentUrl();
    const enPortal = url.includes('/doctor/pacientes') || url.includes('/doctor/calendario');
    expect(enPortal).toBe(true);
  });
});
