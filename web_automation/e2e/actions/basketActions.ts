import { BasketPage } from '../pages/basketPage';
import { test, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CommonActions } from './commonActions';
import { generateUserData } from '../utils/misc';

export class BasketActions {
  readonly basketPage: BasketPage;


  constructor(basketPage: BasketPage) {
    this.basketPage = basketPage;
  }

  async addAddress(products: string[]) {
    await test.step('Add Address', async () => {
      await this.basketPage.page.getByRole('button', { name: 'Checkout' }).click();
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Addresss']);
      // await this.basketPage.page.waitForResponse('**/api/Addresss');
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      if (await this.basketPage.page.locator('mat-row').count() === 0) {
        await this.basketPage.page.getByLabel('Add a new address').click();
        await this.basketPage.page.getByPlaceholder('Please provide a country.').fill(generateUserData().country);
        await this.basketPage.page.getByPlaceholder('Please provide a name.').fill(generateUserData().name);
        await this.basketPage.page.getByPlaceholder('Please provide a mobile').pressSequentially(generateUserData().phone);
        await this.basketPage.page.getByPlaceholder('Please provide a ZIP code.').fill(generateUserData().zipcode);
        await this.basketPage.page.getByPlaceholder('Please provide an address.').fill(generateUserData().address);
        await this.basketPage.page.getByPlaceholder('Please provide a city.').fill(generateUserData().city);
        await this.basketPage.page.getByPlaceholder('Please provide a state.').fill(generateUserData().state);
        await this.basketPage.page.getByRole('button', { name: 'send Submit' }).click();
      }

      await this.basketPage.page.locator('.mat-radio-outer-circle').first().click();
      await this.basketPage.page.getByLabel('Proceed to payment selection').click();

      // Payment Section
      // await this.basketPage.page.waitForResponse('**/api/Deliverys');
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Deliverys']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      await this.basketPage.page.locator('.mat-radio-outer-circle').first().click();
      await this.basketPage.page.getByLabel('Proceed to delivery method').click();

      if (await this.basketPage.page.locator('mat-row').count() === 0) {
        await this.basketPage.page.getByRole('button', { name: 'Add new card Add a credit or' }).click();
        await this.basketPage.page.getByLabel('Name *').fill('aathiraja');
        await this.basketPage.page.getByLabel('Card Number *').fill('4111111111111111');
        await this.basketPage.page.getByLabel('Expiry Month *').selectOption('12');
        await this.basketPage.page.getByLabel('Expiry Year *').selectOption('2082');
        await this.basketPage.page.getByRole('button', { name: 'send Submit' }).click();
        await this.basketPage.page.getByText('Your card ending with 1111').click();
        await this.basketPage.page.locator('.mat-radio-outer-circle').first().click();
        await this.basketPage.page.getByLabel('Proceed to review').click();
      }

        await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Deliverys/**', '**/api/Addresss/**', '**/api/Cards/**', '**/rest/basket/**']);
        // await this.basketPage.page.waitForResponse('**/api/Deliverys/**', { timeout: 5000 });
        // await this.basketPage.page.waitForResponse('**/api/Addresss/**', { timeout: 5000 });
        // await this.basketPage.page.waitForResponse('**/api/Cards/**', { timeout: 5000 });
        // await this.basketPage.page.waitForResponse('**/rest/basket/**', { timeout: 5000 });

      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      let rows = this.basketPage.page.locator('mat-row');
      for (const product of products)
        expect(await rows.filter({ hasText: product }).count()).toBeGreaterThan(0);


      const itemPrice = await this.basketPage.page.locator('tr.mat-row', { hasText: 'Items' }).locator('td.price').textContent();
      const deliveryPrice = await this.basketPage.page.locator('tr.mat-row', { hasText: 'Delivery' }).locator('td.price').textContent();
      const totalPrice = await this.basketPage.page.locator('tr.mat-row', { hasText: 'Total Price' }).locator('td.price').textContent();

      expect(Number(itemPrice?.trim().slice(0, -1)) + Number(deliveryPrice?.trim().slice(0, -1))).toEqual(Number(totalPrice?.trim().slice(0, -1)))
      await this.basketPage.page.getByLabel('Complete your purchase').click();

        // await this.basketPage.page.waitForResponse('**/rest/basket/*/checkout', { timeout: 5000 });
        // await this.basketPage.page.waitForResponse('**/rest/track-order/**', { timeout: 5000 });
        // await this.basketPage.page.waitForResponse('**/rest/basket/**', { timeout: 5000 });
        await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/*/checkout', '**/rest/track-order/**', '**/rest/basket/**']);
        await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      await expect(this.basketPage.page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
      const totalPrice_Checkout = await this.basketPage.page.locator('mat-footer-cell.mat-column-total-price tr').last().textContent();
      expect(Number(totalPrice_Checkout?.trim().slice(0, -1))).toEqual(Number(totalPrice?.trim().slice(0, -1)))
    });
  }

  async navigateToBasket() {
    let totalPrice = 0;
    await test.step('Navigate to your basket', async () => {
      const itemsCount = await this.basketPage.getItemsCountInBasket();
      console.log('Items in basket: ' + itemsCount);
      await this.basketPage.clickBasketMenu();
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      // const response = await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**']);
      // const response = await responsePromise;
      // console.log(JSON.stringify(await response.json(), null, 2));
      await this.basketPage.page.getByRole('button', { name: 'Checkout', disabled: false }).isVisible();
      let rows = this.basketPage.page.locator('mat-row');
      console.log('Rows in basket: ' + await rows.count());
      const productNameToUpdate = (await rows.first().locator('mat-cell.mat-column-product').textContent())?.trim();
      let productToUpdate = rows.filter({ hasText: productNameToUpdate });

      const quantityItem1 = Number(await productToUpdate.locator('mat-cell.mat-column-quantity > span').textContent());
      // const price = Number((await rows.first().locator('.mat-column-price').textContent())?.slice(0, -1));
      await productToUpdate.locator('mat-cell.mat-column-quantity button:has(svg.fa-plus-square)').click();
      // await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**', '**/api/BasketItems/**']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      expect(Number(await productToUpdate.locator('mat-cell.mat-column-quantity > span').textContent())).toEqual(quantityItem1 + 1);
      for (const row of await rows.all()) {
        const quantity = Number(await row.locator('mat-cell.mat-column-quantity > span').textContent());
        const price = Number((await row.locator('.mat-column-price').textContent())?.slice(0, -1));
        totalPrice += quantity * price;
      }

      let totalPriceUI = await this.basketPage.page.locator('div#price').textContent();
      let matched = totalPriceUI?.match(/[0-9\.]+/);
      let totalPriceActual = matched ? Number(matched[0]) : 0;
      expect(totalPriceActual).toEqual(totalPrice);

      // Delete
      await productToUpdate.locator('mat-cell.mat-column-remove > button').click({force: true});
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**', '**/api/BasketItems/**']);
      // await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      rows = this.basketPage.page.locator('mat-row');
      productToUpdate = rows.filter({ hasText: productNameToUpdate });
      await new CommonActions<Page>(this.basketPage.page).waitForTimeout(2);
      expect(await productToUpdate.count()).toEqual(0);

      totalPriceUI = await this.basketPage.page.locator('div#price').textContent();
      matched = totalPriceUI?.match(/[0-9\.]+/);
      let totalPriceActual_Del = matched ? Number(matched[0]) : 0;
      expect(totalPriceActual_Del).toBeLessThan(totalPriceActual);

      totalPrice = 0;
      for (const row of await rows.all()) {
        const quantity = Number(await row.locator('mat-cell.mat-column-quantity > span').textContent());
        const price = Number((await row.locator('.mat-column-price').textContent())?.slice(0, -1));
        totalPrice += quantity * price;
      }
      expect(totalPriceActual_Del).toEqual(totalPrice);
    });
  }
}
