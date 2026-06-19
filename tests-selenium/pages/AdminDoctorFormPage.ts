import { By, until } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class AdminDoctorFormPage extends BasePage {
  async waitForLoad(): Promise<void> {
    await this.waitForElement(By.css('input[name="nombre"]'), 12000);
  }

  // Espera a que el formulario desaparezca del DOM (cierre de modal tras guardar).
  async waitForFormHidden(): Promise<void> {
    const el = await this.driver.findElement(By.css('input[name="nombre"]'));
    await this.driver.wait(until.stalenessOf(el), 15000);
  }

  async fillNombre(nombre: string): Promise<void> {
    await this.clearAndType(By.css('input[name="nombre"]'), nombre);
  }

  async fillApellido(apellido: string): Promise<void> {
    await this.clearAndType(By.css('input[name="apellido"]'), apellido);
  }

  async fillDni(dni: string): Promise<void> {
    await this.clearAndType(By.css('input[name="dni"]'), dni);
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndType(By.css('input[name="email"]'), email);
  }

  async getFieldValue(name: string): Promise<string> {
    const el = await this.waitForElement(By.css(`input[name="${name}"]`));
    return (await el.getAttribute('value')) ?? '';
  }

  // Seguridad: si el formulario no precargó DNI válido, rellena uno.
  async ensureValidDni(): Promise<void> {
    const value = await this.getFieldValue('dni');
    if (!/^\d{8}$/.test(value)) {
      const suffix = Date.now().toString().slice(-8);
      await this.fillDni(suffix);
    }
  }

  // Seguridad: si el formulario no precargó email válido, rellena uno.
  async ensureValidEmail(): Promise<void> {
    const value = await this.getFieldValue('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      const suffix = Date.now().toString().slice(-6);
      await this.fillEmail(`doctor.test.${suffix}@test.com`);
    }
  }

  async fillTelefono(tel: string): Promise<void> {
    await this.clearAndType(By.css('input[name="telefono"]'), tel);
  }

  async fillUsuario(username: string): Promise<void> {
    const inputs = await this.driver.findElements(By.css('input[name="username"]'));
    if (inputs.length === 0) return;
    const inputType = await inputs[0].getAttribute('type');
    if (inputType === 'hidden') {
      // El schema Zod exige username min(4). El input es hidden (react-hook-form), así que
      // se usa el setter nativo de HTMLInputElement + eventos para que RHF registre el valor.
      await this.driver.executeScript(
        'var s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;' +
        's.call(arguments[0], arguments[1]);' +
        'arguments[0].dispatchEvent(new Event("input", {bubbles:true}));' +
        'arguments[0].dispatchEvent(new Event("change", {bubbles:true}));',
        inputs[0],
        username,
      );
    } else {
      await inputs[0].clear();
      await inputs[0].sendKeys(username);
    }
  }

  async fillPassword(password: string): Promise<void> {
    const inputs = await this.driver.findElements(By.css('input[name="password"]'));
    if (inputs.length > 0) {
      await inputs[0].clear();
      await inputs[0].sendKeys(password);
    }
  }

  async selectEspecialidad(): Promise<void> {
    // Las especialidades llegan de una query asíncrona; esperar a que aparezca al menos una opción real.
    await this.waitForElement(
      By.css('select[name="specialtyId"] option:not([value=""])'), 10000,
    );
    const select = await this.waitForElement(By.css('select[name="specialtyId"]'));
    const options = await select.findElements(By.css('option:not([value=""])'));
    if (options.length > 0) {
      await options[0].click();
    }
  }

  // Localiza el toggle de turno usando JS para evitar problemas de encoding con 'ñ' en XPath.
  // El botón tiene aria-label='Mañana' cuando el turno activo es MANANA y 'Tarde' cuando es TARDE.
  private async findShiftToggle(): Promise<any> {
    return this.driver.executeScript(
      `return Array.from(document.querySelectorAll('button[type="button"]'))` +
      `.find(function(b){ var l = b.getAttribute('aria-label'); return l === 'Tarde' || l === 'Mañana'; });`,
    );
  }

  // Asegura turno MANANA: si el toggle muestra 'Tarde' (estado actual = TARDE), lo pulsa para cambiar.
  async selectTurnoManana(): Promise<void> {
    await this.sleep(500);
    const btn = await this.findShiftToggle();
    if (!btn) throw new Error('No se encontró el toggle de turno en el formulario');
    const label: string = await (btn as any).getAttribute('aria-label');
    if (label === 'Tarde') {
      await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
      await this.sleep(200);
      await this.driver.executeScript('arguments[0].click();', btn);
      await this.sleep(300);
    }
  }

  // Asegura turno TARDE: si el toggle muestra 'Mañana' (estado actual = MANANA), lo pulsa para cambiar.
  async selectTurnoTarde(): Promise<void> {
    await this.sleep(500);
    const btn = await this.findShiftToggle();
    if (!btn) throw new Error('No se encontró el toggle de turno en el formulario');
    const label: string = await (btn as any).getAttribute('aria-label');
    if (label !== 'Tarde') {
      await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
      await this.sleep(200);
      await this.driver.executeScript('arguments[0].click();', btn);
      await this.sleep(300);
    }
  }

  async clickHorarioCell(dayIndex: number, slotRowIndex: number): Promise<void> {
    // Tabla row-major: 5 columnas de días (Lun-Vie).
    // idx = slotRowIndex * 5 + dayIndex
    // Se usa "form table ..." para no confundir con los botones de la tabla del dashboard
    // que siguen en el DOM detrás del modal de edición.
    await this.waitForElement(By.css('form table tbody tr td button'), 8000);
    const cells = await this.driver.findElements(By.css('form table tbody tr td button'));
    const idx = slotRowIndex * 5 + dayIndex;
    if (!cells[idx]) {
      throw new Error(
        `Celda no encontrada: día[${dayIndex}] slot[${slotRowIndex}] (idx ${idx} de ${cells.length} botones)`,
      );
    }
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', cells[idx]);
    await this.sleep(200);
    await this.driver.executeScript('arguments[0].click();', cells[idx]);
  }

  async clickGuardarCambios(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Guardar cambios')]"),
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(200);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }
}
