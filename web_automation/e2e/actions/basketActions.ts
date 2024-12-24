import { BasketPage } from '../pages/basketPage';
import { test, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CommonActions } from './commonActions';

export class BasketActions {
  readonly basketPage: BasketPage;


  constructor(basketPage: BasketPage) {
    this.basketPage = basketPage;
  }

  async login(email: string) {
    await test.step('Login to e-commerce web application', async () => {
      // Login to the e-commerce web application
      // await this.loginPage.page.getByRole('link', { name: 'Already a customer?' }).click();
      test.info().annotations.push({ type: 'User', description: email + ' - Test@123' });
      await this.basketPage.page.getByLabel('Text field for the login email').fill(email);
      await this.basketPage.page.getByLabel('Text field for the login password').fill('Test@123');
      await this.basketPage .page.getByLabel('Login', { exact: true }).click();
    });
  }

  async navigateToBasket() {
    let totalPrice = 0;
    await test.step('Navigate to your basket', async () => {
      const itemsCount = await this.basketPage.getItemsCountInBasket();
      console.log('Items in basket: ' + itemsCount);
      await this.basketPage.clickBasketMenu();
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      const response = await this.basketPage.page.waitForResponse('**/rest/basket/**');
      // const response = await responsePromise;
      console.log(JSON.stringify(await response.json(), null, 2));
      await this.basketPage.page.getByRole('button', { name: 'Checkout', disabled: false }).isVisible();
      const rows = this.basketPage.page.locator('mat-row');
      console.log('Rows in basket: ' + await rows.count());

      const quantityItem1 = Number(await rows.first().locator('mat-cell.mat-column-quantity > span').textContent());
      // const price = Number((await rows.first().locator('.mat-column-price').textContent())?.slice(0, -1));
      await rows.first().locator('mat-cell.mat-column-quantity button:has(svg.fa-plus-square)').click();
      await this.basketPage.page.waitForResponse('**/rest/basket/**');

      expect(Number(await rows.first().locator('mat-cell.mat-column-quantity > span').textContent())).toEqual(quantityItem1 + 1);
      for(const row of await rows.all()){
        const quantity = Number(await row.locator('mat-cell.mat-column-quantity > span').textContent());
        const price = Number((await row.locator('.mat-column-price').textContent())?.slice(0, -1));
        totalPrice += quantity * price;
      }

      const totalPriceUI = await this.basketPage.page.locator('div#price').textContent();
      const matched = totalPriceUI?.match(/[0-9\.]+/);
      const totalPriceActual = matched ? Number(matched[0]) : 0;
      expect(totalPriceActual).toEqual(totalPrice);
    });
  }
}
