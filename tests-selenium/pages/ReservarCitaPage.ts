import { By, WebElement } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { URLS } from '../utils/credentials';

export class ReservarCitaPage extends BasePage {
  async navigate(): Promise<void> {
    await this.navigateTo(URLS.reservarCita);
  }

  async waitForSpecialties(): Promise<void> {
    // Esperar el sidebar con botones de especialidad
    await this.waitForElement(By.css('aside button'), 12000);
  }

  async selectFirstSpecialty(): Promise<void> {
    const btn = await this.waitForElement(By.css('aside button'), 12000);
    await btn.click();
  }

  async waitForDoctors(): Promise<void> {
    // Esperar el grid de cards de médico (button.text-left es exclusivo de DoctorSelector)
    await this.waitForElement(By.css('div.grid button.text-left'), 12000);
  }

  async countDoctors(): Promise<number> {
    const cards = await this.driver.findElements(By.css('div.grid button.text-left'));
    return cards.length;
  }

  async selectFirstDoctor(): Promise<void> {
    await this.selectNthDoctor(0);
  }

  async selectLastDoctor(): Promise<void> {
    const cards = await this.driver.findElements(By.css('div.grid button.text-left'));
    if (cards.length === 0) throw new Error('No se encontraron médicos disponibles');
    await this.selectNthDoctor(cards.length - 1);
  }

  async selectDoctorByName(partialName: string): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath(
        `//div[contains(@class,'grid')]//button[contains(@class,'text-left') and contains(.,'${partialName}')]`,
      ),
      12000,
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async selectNthDoctor(index: number): Promise<void> {
    // Doctor cards tienen text-left; el botón "Automático" no lo tiene.
    const cards = await this.driver.findElements(By.css('div.grid button.text-left'));
    if (cards.length === 0) throw new Error('No se encontraron médicos disponibles');
    const target = cards[Math.min(index, cards.length - 1)];
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', target);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', target);
  }

  async waitForDays(): Promise<void> {
    await this.waitForElement(By.xpath("//h3[contains(text(), 'Elige el D')]"), 12000);
  }

  async selectFirstAvailableDay(): Promise<void> {
    await this.selectNthAvailableDay(0);
  }

  async selectNthAvailableDay(index: number): Promise<void> {
    const days = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige el D')]/following-sibling::div//button[not(@disabled)]"),
    );
    if (days.length === 0) throw new Error('No hay días disponibles');
    const target = days[Math.min(index, days.length - 1)];
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', target);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', target);
  }

  async waitForSlots(): Promise<void> {
    await this.waitForElement(By.xpath("//h3[contains(text(), 'Elige la Hora')]"), 12000);
  }

  async selectFirstAvailableSlot(): Promise<void> {
    await this.selectNthAvailableSlot(0);
  }

  async selectNthAvailableSlot(index: number): Promise<void> {
    const slots = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige la Hora')]/following-sibling::div//button[not(@disabled)]"),
    );
    if (slots.length === 0) throw new Error('No hay slots disponibles');
    const target = slots[Math.min(index, slots.length - 1)];
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', target);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', target);
  }

  async clickConfirmarReserva(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Confirmar Reserva')]"),
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async waitForModal(): Promise<void> {
    await this.waitForElement(
      By.xpath("//h2[contains(text(), 'Confirmar Reserva')]"),
      10000,
    );
  }

  async acceptModal(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Aceptar')]"),
    );
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await this.sleep(300);
    await this.driver.executeScript('arguments[0].click();', btn);
  }

  async clickAutomatico(): Promise<void> {
    const btn = await this.waitForClickable(
      By.xpath("//button[contains(text(), 'Autom')]"),
    );
    await btn.click();
  }

  async hasAvailableDays(): Promise<boolean> {
    const days = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige el D')]/following-sibling::div//button[not(@disabled)]"),
    );
    return days.length > 0;
  }

  async hasAvailableSlots(): Promise<boolean> {
    const slots = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige la Hora')]/following-sibling::div//button[not(@disabled)]"),
    );
    return slots.length > 0;
  }

  async countAvailableDays(): Promise<number> {
    const days = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige el D')]/following-sibling::div//button[not(@disabled)]"),
    );
    return days.length;
  }

  async countAvailableSlots(): Promise<number> {
    const slots = await this.driver.findElements(
      By.xpath("//h3[contains(text(), 'Elige la Hora')]/following-sibling::div//button[not(@disabled)]"),
    );
    return slots.length;
  }

  async getToastMessage(): Promise<string | null> {
    const toasts = await this.driver.findElements(By.css('[data-sonner-toast]'));
    if (toasts.length === 0) return null;
    return toasts[toasts.length - 1].getText();
  }

  async closeModalIfOpen(): Promise<void> {
    const closeButtons = await this.driver.findElements(
      By.xpath("//h2[contains(text(), 'Confirmar Reserva')]/following::button[contains(text(), 'Cancelar')]"),
    );
    if (closeButtons.length === 0) return;
    await this.driver.executeScript('arguments[0].click();', closeButtons[0]);
    await this.sleep(500);
  }
}
