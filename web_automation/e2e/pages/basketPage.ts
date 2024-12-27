import { Locator, Page, expect } from '@playwright/test';
import { HomeLocators } from '../locators/homeLocators';
import { generateUserData, extractAllNumbers } from '../utils/misc';

export class BasketPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getRows(): Locator {
    return this.page.locator('mat-row');
  }

  async getPricesInReviewSection(priceType: string): Promise<string | null> {
    return await this.page.locator('tr.mat-row', { hasText: priceType }).locator('td.price').textContent();
  }

  async clickCheckoutButton() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }

  async addAddress(): Promise<void> {
    await this.page.getByLabel('Add a new address').click();
    await this.page.getByPlaceholder('Please provide a country.').fill(generateUserData().country);
    await this.page.getByPlaceholder('Please provide a name.').fill(generateUserData().name);
    await this.page.getByPlaceholder('Please provide a mobile').pressSequentially(generateUserData().phone);
    await this.page.getByPlaceholder('Please provide a ZIP code.').fill(generateUserData().zipcode);
    await this.page.getByPlaceholder('Please provide an address.').fill(generateUserData().address);
    await this.page.getByPlaceholder('Please provide a city.').fill(generateUserData().city);
    await this.page.getByPlaceholder('Please provide a state.').fill(generateUserData().state);
    await this.page.getByRole('button', { name: 'send Submit' }).click();
  }

  async addCreditCard() {
    await this.page.getByRole('button', { name: 'Add new card Add a credit or' }).click();
    await this.page.getByLabel('Name *').fill('aathiraja');
    await this.page.getByLabel('Card Number *').fill('4111111111111111');
    await this.page.getByLabel('Expiry Month *').selectOption('12');
    await this.page.getByLabel('Expiry Year *').selectOption('2082');
    await this.page.getByRole('button', { name: 'send Submit' }).click();
  }

  async selectCreditCard() {
    await this.page.getByText('Your card ending with 1111').click();
    await this.page.locator('.mat-radio-outer-circle').first().click();
  }

  async selectRadioButton() {
    await this.page.locator('.mat-radio-outer-circle').first().click();
  }

  async clickProceedToPayment() {
    await this.page.getByLabel('Proceed to payment selection').click();
  }

  async clickProceedToDelivery() {
    await this.page.getByLabel('Proceed to delivery method').click();
  }

  async clickProceedToReview() {
    await this.page.getByLabel('Proceed to review').click();
  }

  async clickCompletePurchase() {
    await this.page.getByLabel('Complete your purchase').click();
  }

  getPurchaseCompletedMessage(): Locator {
    return this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
  }

  async getPurchasePrice(): Promise<string|null> {
    return await this.page.locator('mat-footer-cell.mat-column-total-price tr').last().textContent();
  }

  async clickAccountButton() {
    await this.page.getByLabel('Show/hide account menu').click();
  }

  async clickBasketMenu() {
    await this.page.getByLabel('Show the shopping cart').click();
  }

  async getItemsCountInBasket(): Promise<number> {
    return Number(await this.page.getByLabel('Show the shopping cart').locator('.fa-layers-counter').textContent());
  }

  async getItemsRows_Basket(): Promise<number> {
    return Number(await this.page.getByLabel('Show the shopping cart').locator('.fa-layers-counter').textContent());
  }
}
