import { Page, expect } from '@playwright/test';
import { HomeLocators } from '../locators/homeLocators';
import { extractAllNumbers } from '../utils/misc';
import { CommonActions } from '../actions/commonActions';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

  async selectProductByName(name: string) {
    await this.page.locator(HomeLocators.item).filter({ hasText: name }).click();
  }

  async addProductToBasket(name: string) {
    const product = this.page.locator(HomeLocators.item).filter({ hasText: name });
    await new CommonActions<Page>(this.page).waitForNetworkIdle();
    const addToBasket = product.getByLabel('Add to Basket');
    // await expect(product).toBeVisible();
    // await addToBasket.waitFor({ state:  'visible', timeout: 5000 });
    const count = await addToBasket.count();
    console.log(`Count : ${count}`);
    await addToBasket.first().scrollIntoViewIfNeeded();
    await addToBasket.waitFor({ state: 'visible', timeout: 5000});
    await addToBasket.click({force : true });
    this.page.on("pageerror", (err) => {
      console.log(err.message)
    })
    await expect(this.page.getByText(/Placed|Added another/)).toBeVisible();
    await this.page.locator('simple-snack-bar button').click({force: true});
  }

  async getReviewText(): Promise<string> {
    return await this.page.getByRole('button', { name: /Reviews/ }).textContent() || '';
  }

  async expandReview() {
    await this.page.getByRole('button', { name: /Reviews/ }).click();
  }

  async closeDialog() {
    await this.page.getByLabel('Close Dialog').click();
  }

  async getItemsCount(): Promise<number> {
    const items = this.page.locator(HomeLocators.item);
    return await items.count();
  }

  async getTotalItems(): Promise<number> {
    const pagination = await this.page.locator(HomeLocators.totalItems).textContent() || '';
    return extractAllNumbers(pagination)[1] || 0;
  }

  // verifications
  async verifyProductDetailsDialog() {
    await expect(this.page.locator(HomeLocators.dialog.container)).toBeVisible();
  }

  async verifyReview() {
    await expect(this.page.getByLabel(HomeLocators.dialog.reviewRating)).toBeVisible();
  }
}
