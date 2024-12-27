import { BasketPage } from '../pages/basketPage';
import { test, Page, expect, Locator } from '@playwright/test';
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
      await this.productCheckout();
      await this.completeAddressSection();
      await this.completePaymentSection();
      await this.completeDeliverySection();
      const totalPrice = await this.completeReviewSection(products);
      await this.verifyPurchaseCompletion(totalPrice === null ? '' : totalPrice);
    });
  }

  async updateBasketProductNVerifyPrices() {
    await this.navigateToBasket();
    let [rows, productToUpdate, productNameToUpdate, productNames] = await this.getProductToUpdate();
    let quantityItem1 = await this.addCountOfProduct(productToUpdate);
    // await this.calcTotalPriceFromProducts(rows);
    await this.verifyProductCountAdded(productToUpdate, quantityItem1);
    let totalPriceActual = await this.verifyProductsTotalPrice(rows);
    await this.deleteProduct(productToUpdate, productNames);
    rows = await this.verifyDeletedProduct(productNameToUpdate);
    let totalPriceActual_Del = await this.verifyTotalPrice(totalPriceActual);
    await this.verifyTotalPriceDelivery(rows, totalPriceActual_Del);
  }

  async navigateToBasket() {
    let totalPrice = 0;
    await test.step('Navigate to your basket', async () => {
      const itemsCount = await this.basketPage.getItemsCountInBasket();
      console.log('Items in basket: ' + itemsCount);
      await this.basketPage.clickBasketMenu();
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**']);
    });
  }

  async getProductToUpdate(): Promise<[Locator, Locator, string, string[]]> {
    return await test.step('Navigate to your basket', async () => {
      // Verify Checkout button is enabled
      await this.basketPage.page.getByRole('button', { name: 'Checkout', disabled: false }).isVisible();

      // Get all products from the basket
      let rows = this.basketPage.getRows();

      let productNames = await rows.locator('mat-cell.mat-column-product').allTextContents();
      const productNameToUpdate = productNames[0].trim();
      let productToUpdate = rows.filter({ hasText: productNameToUpdate });
      return [rows, productToUpdate, productNameToUpdate, productNames];
    });
  }

  async addCountOfProduct(productToUpdate: Locator): Promise<number> {
    return await test.step('Navigate to your basket', async () => {
      const quantityItem1 = Number(await productToUpdate.locator('mat-cell.mat-column-quantity > span').textContent());
      // const price = Number((await rows.first().locator('.mat-column-price').textContent())?.slice(0, -1));
      await productToUpdate.locator('mat-cell.mat-column-quantity button:has(svg.fa-plus-square)').click();
      // await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**', '**/api/BasketItems/**']);
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      return quantityItem1;
    });
  }

  async calcTotalPriceFromProducts(rows: Locator): Promise<number> {
    let totalPrice = 0;
    for (const row of await rows.all()) {
      const quantity = Number(await row.locator('mat-cell.mat-column-quantity > span').textContent());
      const price = Number((await row.locator('.mat-column-price').textContent())?.slice(0, -1));
      totalPrice += quantity * price;
    }
    return totalPrice;
  }

  async verifyProductCountAdded(productToUpdate: Locator, quantityItem1: number) {
    await test.step('Verify product count added', async () => {
      expect(Number(await productToUpdate.locator('mat-cell.mat-column-quantity > span').textContent())).toEqual(quantityItem1 + 1);
    });
  }

  async verifyProductsTotalPrice(rows: Locator): Promise<number> {
     return await test.step('Calculate and verify Products total price', async () => {
      let totalPrice = this.calcTotalPriceFromProducts(rows);
      let totalPriceUI = await this.basketPage.page.locator('div#price').textContent();
      let matched = totalPriceUI?.match(/[0-9\.]+/);
      let totalPriceActual = matched ? Number(matched[0]) : 0;

      expect(totalPriceActual).toEqual(totalPrice);
      return totalPriceActual;
    });
  }

  async deleteProduct(productToUpdate: Locator, productNames: string[]): Promise<string|null> {
    return await test.step('Navigate to your basket', async () => {
      // Delete
      let productToDelete = await productToUpdate.locator('mat-cell.mat-column-product').textContent();
      await productToUpdate.locator('mat-cell.mat-column-remove > button').click({ force: true });
      await new CommonActions<Page>(this.basketPage.page).waitForMultipleServices(['**/rest/basket/**', '**/api/BasketItems/**']);
      // await this.basketPage.page.waitForResponse('**/rest/basket/**');
      await new CommonActions<Page>(this.basketPage.page).waitForNetworkIdle();
      productNames = productNames.filter(item => item != productToDelete);
      return productToDelete;
    });
  }

  async verifyDeletedProduct(productNameToUpdate: string): Promise<Locator> {
    return await test.step('Verify deleted product', async () => {
      // Verify deleted product
      let rows = this.basketPage.getRows();
      let productToUpdate = rows.filter({ hasText: productNameToUpdate });
      await new CommonActions<Page>(this.basketPage.page).waitForTimeout(2);
      expect(await productToUpdate.count()).toEqual(0);
      return rows;
    });
  }

  async verifyTotalPrice(totalPriceActual: number): Promise<number> {
    return await test.step('Verify total price', async () => {
      let totalPriceUI = await this.basketPage.page.locator('div#price').textContent();
      let matched = totalPriceUI?.match(/[0-9\.]+/);
      let totalPriceActual_Del = matched ? Number(matched[0]) : 0;
      expect(totalPriceActual_Del).toBeLessThan(totalPriceActual);
      return totalPriceActual_Del;
    });
  }
  async verifyTotalPriceDelivery(rows: Locator, totalPriceActual_Del: number) {
    await test.step('Verify total price on delivery section', async () => {
      let totalPrice = 0;
      totalPrice = await this.calcTotalPriceFromProducts(rows);
      expect(totalPriceActual_Del).toEqual(totalPrice);
    });
  }
}
