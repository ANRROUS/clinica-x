import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class RegisterPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.register);
    await this.waitForElement(By.css('input[name="nombre"]'));
  }

  async fillForm(opts: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    password: string;
    telefono?: string;
  }): Promise<void> {
    await this.clearAndType(By.css('input[name="nombre"]'), opts.nombre);
    await this.clearAndType(By.css('input[name="apellido"]'), opts.apellido);
    await this.clearAndType(By.css('input[name="dni"]'), opts.dni);
    if (opts.telefono) {
      await this.clearAndType(By.css('input[name="telefono"]'), opts.telefono);
    }
    await this.clearAndType(By.css('input[name="email"]'), opts.email);
    await this.clearAndType(By.css('input[name="password"]'), opts.password);
    await this.clearAndType(By.css('input[name="confirmPassword"]'), opts.password);
  }

  async submit(): Promise<void> {
    const btn = await this.waitForClickable(By.css('button[type="submit"]'));
    await btn.click();
  }
}
