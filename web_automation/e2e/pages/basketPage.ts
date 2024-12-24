import { Page, expect } from '@playwright/test';
import { HomeLocators } from '../locators/homeLocators';
import { extractAllNumbers } from '../utils/misc';

export class BasketPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickAccountButton() {
    await this.page.getByLabel('Show/hide account menu').click();
  }

  async clickBasketMenu() {
    await this.page.getByLabel('Show the shopping cart').click();
  }

  async getItemsCountInBasket() : Promise<number> {
    return Number(await this.page.getByLabel('Show the shopping cart').locator('.fa-layers-counter').textContent());
  }

  async getItemsRows_Basket() : Promise<number> {
    return Number(await this.page.getByLabel('Show the shopping cart').locator('.fa-layers-counter').textContent());
  }
}
