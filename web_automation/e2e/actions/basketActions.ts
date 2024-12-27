import { BasketPage } from '../pages/basketPage';
import { test, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CommonActions } from './commonActions';

export class BasketActions {
  readonly basketPage: BasketPage;


  constructor(basketPage: BasketPage) {
    this.basketPage = basketPage;
  }

  async productCheckout() {
    await test.step('Product Checkout', async () => {
      this.basketPage.clickCheckoutButton();
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Addresss']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
    });
  }

  async completeAddressSection() {
    await test.step('Add Address and proceed to Payment', async () => {
      // Add address with faker data
      if (await this.basketPage.getRows().count() === 0)
        await this.basketPage.addAddress();

      await this.basketPage.selectRadioButton();
      await this.basketPage.clickProceedToPayment();
    });
  }

  // Payment Section
  async completePaymentSection() {
    await test.step('Add Payment details and proceed to Delivery', async () => {
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Deliverys']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      await this.basketPage.selectRadioButton();
      await this.basketPage.clickProceedToDelivery();
    });
  }

  async completeDeliverySection() {
    await test.step('Add Delivery details, verify the purchase list and proceed to Review', async () => {
      // Delivery Section
      if (await this.basketPage.getRows().count() === 0)
        await this.basketPage.addCreditCard();

      await this.basketPage.selectCreditCard();
      await this.basketPage.clickProceedToReview();

      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/api/Deliverys/**', '**/api/Addresss/**', '**/api/Cards/**', '**/rest/basket/**']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
    });
  }

  async completeReviewSection(products: string[]): Promise<string | null> {
    return await test.step('Verify product / payment / delivery details and complete purchase', async () => {
      // Verify all products listed in review section
      let rows = this.basketPage.getRows();
      for (const product of products)
        expect(await rows.filter({ hasText: product }).count()).toBeGreaterThan(0);


      // Verify the prices in review screen
      const itemPrice = await this.basketPage.getPricesInReviewSection('Items');
      const deliveryPrice = await this.basketPage.getPricesInReviewSection('Delivery');
      const totalPrice = await this.basketPage.getPricesInReviewSection('Total Price');
      expect(Number(itemPrice?.trim().slice(0, -1)) + Number(deliveryPrice?.trim().slice(0, -1))).toEqual(Number(totalPrice?.trim().slice(0, -1)))
      await this.basketPage.clickCompletePurchase();

      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/*/checkout', '**/rest/track-order/**', '**/rest/basket/**']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      return totalPrice;
    });
  }

  async verifyPurchaseCompletion(totalPrice: string) {
    await test.step('Verify Purchase Completion', async () => {
      // Verify purchase complete screen
      await expect(this.basketPage.getPurchaseCompletedMessage()).toBeVisible();

      // Verify purchase price
      const totalPrice_Checkout = await this.basketPage.getPurchasePrice();
      expect(Number(totalPrice_Checkout?.trim().slice(0, -1))).toEqual(Number(totalPrice?.trim().slice(0, -1)));
    });
  }

  async verifyCheckoutProcess(products: string[]) {
    await test.step('Add Address', async () => {
      this.productCheckout();
      this.completeAddressSection();
      this.completePaymentSection();
      this.completeDeliverySection();
      const totalPrice = await this.completeReviewSection(products);
      this.verifyPurchaseCompletion(totalPrice === null ? '' : totalPrice);
    });
  }

  async navigateToBasket() {
    let totalPrice = 0;
    await test.step('Navigate to your basket', async () => {
      const itemsCount = await this.basketPage.getItemsCountInBasket();
      console.log('Items in basket: ' + itemsCount);
      await this.basketPage.clickBasketMenu();
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**']);

      await this.basketPage.page.getByRole('button', { name: 'Checkout', disabled: false }).isVisible();
      let rows = this.basketPage.getRows();;
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
      await productToUpdate.locator('mat-cell.mat-column-remove > button').click({ force: true });
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**', '**/api/BasketItems/**']);
      // await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();

      rows = this.basketPage.getRows();;
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
