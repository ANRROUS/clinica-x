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

  async getFieldErrors(): Promise<string[]> {
    const els = await this.driver.findElements(
      By.xpath("//p[contains(@class,'text-red-700')]"),
    );
    const texts = await Promise.all(els.map((e) => e.getText()));
    return texts.filter((t) => t.length > 0);
  }

  async isEmailBrowserValid(): Promise<boolean> {
    const input = await this.driver.findElement(By.css('input[name="email"]'));
    return this.driver.executeScript('return arguments[0].checkValidity();', input) as Promise<boolean>;
  }

  async setupToastInterceptor(): Promise<void> {
    await this.driver.executeScript(`
      window.__capturedToast = null;
      if (window.__toastObserver) window.__toastObserver.disconnect();
      window.__toastObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var added = mutations[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node.nodeType !== 1) continue;
            var toast = node.matches && node.matches('[data-sonner-toast]')
              ? node
              : node.querySelector && node.querySelector('[data-sonner-toast]');
            if (toast && window.__capturedToast === null) {
              window.__capturedToast = toast.textContent || '';
              window.__toastObserver.disconnect();
            }
          }
        }
      });
      window.__toastObserver.observe(document.documentElement, { childList: true, subtree: true });
    `);
  }

  async getCapturedToast(waitMs = 15000): Promise<string | null> {
    const interval = 500;
    const steps = Math.ceil(waitMs / interval);
    for (let i = 0; i < steps; i++) {
      const text = await this.driver.executeScript('return window.__capturedToast;') as string | null;
      if (text !== null) return text;
      await this.sleep(interval);
    }
    return null;
  }

}
