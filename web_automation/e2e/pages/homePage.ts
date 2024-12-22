import { Page } from '@playwright/test';
import { HomeLocators } from '../locators/homeLocators';
import { extractAllNumbers } from '../utils/misc';

export class HomePage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad() {
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async closeWelcomeBanner() {
    await this.page.getByLabel(HomeLocators.closeWelcomBannerLabel).click()
  }

  async dismissCookieMessage() {
    await this.page.getByLabel(HomeLocators.dismissCookieMessage).click()
  }

  async getItemsCount(): Promise<number> {
    const items = this.page.locator(HomeLocators.item);
    return await items.count();
  }

  async getTotalItems(): Promise<number> {
    const pagination = await this.page.locator(HomeLocators.totalItems).textContent() || '';
    return extractAllNumbers(pagination).at(1) || 0;
  }
}
