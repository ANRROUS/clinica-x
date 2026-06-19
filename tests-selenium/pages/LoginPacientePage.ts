import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class LoginPacientePage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.loginPaciente);
    await this.waitForElement(By.css('input[name="dni"]'));
  }

  async fillDni(dni: string): Promise<void> {
    await this.clearAndType(By.css('input[name="dni"]'), dni);
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndType(By.css('input[name="email"]'), email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.clearAndType(By.css('input[name="password"]'), password);
  }

  async submit(): Promise<void> {
    const btn = await this.waitForClickable(By.css('button[type="submit"]'));
    await btn.click();
  }

  async login(dni: string, email: string, password: string): Promise<void> {
    await this.fillDni(dni);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async waitForRedirect(expectedPath: string): Promise<void> {
    await this.waitForUrl(expectedPath);
  }

  async getFieldErrors(): Promise<string[]> {
    const els = await this.driver.findElements(
      By.xpath("//p[contains(@class,'text-red-700')]"),
    );
    const texts = await Promise.all(els.map((e) => e.getText()));
    return texts.filter((t) => t.length > 0);
  }

  // Devuelve false si el campo email no pasa la validación nativa del navegador
  // (type="email" intercepta antes de que react-hook-form pueda mostrar su propio error).
  async isEmailBrowserValid(): Promise<boolean> {
    const input = await this.driver.findElement(By.css('input[name="email"]'));
    return this.driver.executeScript('return arguments[0].checkValidity();', input) as Promise<boolean>;
  }

  async waitForToastError(timeoutMs = 20000): Promise<string> {
    await this.waitForElement(By.css('[data-sonner-toast]'), timeoutMs);
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    return toasts[toasts.length - 1].getText();
  }

  // Instala un MutationObserver en el DOM antes de disparar el submit.
  // Captura el texto del primer toast que aparezca (aunque se elimine antes de consultarlo).
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
