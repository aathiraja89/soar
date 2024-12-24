import { scrollToBottom } from '../utils/scroll';
import { HomePage } from '../pages/homePage';
import { getMatOptions, clickMatOption } from '../utils/components';
import { findMaxOption, extractNumberFromText } from '../utils/misc';
import { CommonActions } from '../actions/commonActions';
import { CommonLocators } from '../locators/commonLocators';
import { test, Page, expect } from '@playwright/test';


export class HomeActions {
  readonly homePage: HomePage;


  constructor(homePage: HomePage) {
    this.homePage = homePage;
  }

  async navigateToHome() {
    await test.step('Navigate to Home, close banner & cookie message ', async () => {
      // Navigate to the e-commerce web application
      await this.homePage.navigateTo('/');
      await this.homePage.closeWelcomeBanner();
      await this.homePage.dismissCookieMessage();
    });
  }

  async loadMaximumItems(): Promise<number> {
    return await test.step('Select max items to display in a page', async () => {

      // Scroll to the bottom
      await scrollToBottom(this.homePage.page);

      // Select the maximum number of items per page
      // Get all options from the dropdown
      const options = await getMatOptions(this.homePage.page, CommonLocators.matSelectDropdown, CommonLocators.matOptions);
      console.log('Dropdown Options:', options);

      // Find the maximum option
      const maxOption = findMaxOption(options);
      console.log('Max Option:', maxOption);

      // Click on the maximum option
      await clickMatOption(this.homePage.page, maxOption);
      return maxOption;
    });
  }

  async verifyMaximumItemsDisplayed(maxItems: number) {
    await test.step('Verify max items display on the page', async () => {
      // Assert that the maximum option is selected
      const selectedValue = await this.homePage.page.locator(CommonLocators.matSelectDropdown).textContent();
      console.log('Selected Value:', selectedValue?.trim());
      expect(Number(selectedValue?.trim())).toBe(maxItems);

      // Assert that all items are displayed
      const itemCount = await this.homePage.getItemsCount();
      console.log(`Number of items displayed: ${itemCount}`);
      expect(itemCount).toEqual(await this.homePage.getTotalItems());
    });
  }

  async selectProduct(productName: string) {
    await test.step(`Select the product - '${productName}'`, async () => {
      await this.homePage.selectProductByName(productName);
      await this.homePage.verifyProductDetailsDialog();
    });
  }

  async getInStockProducts() : Promise<string[]> {
    return await test.step('Get in-stock products', async () => {
      await new CommonActions<Page>(this.homePage.page).waitForNetworkIdle();
      const allProducts = this.homePage.page.locator('mat-grid-tile mat-card > div.product');
      const inStockProducts = allProducts.filter({ hasNot: allProducts.locator('div.ribbon-sold'), });
      const productNames = await inStockProducts.allTextContents();
      return productNames.map(name => {
        const match = name.match(/^[a-zA-Z ]+/);
        return match ? match[0].trim() : "";
      })
    });
  }

  async addProductToBasket(productName: string) {
    await test.step(`Add product - '${productName}' to basket`, async () => {
      await this.homePage.addProductToBasket(productName);
      // await this.homePage.verifyProductAddNoty(productName);
    });
  }

  async addProductsToBasket(productName: string) {
    const snackbar = this.homePage.page.locator('simple-snack-bar button');
    if (await snackbar.isVisible()){
      await snackbar.click();
      await new CommonActions<Page>(this.homePage.page).waitForNetworkIdle();
      // await new CommonActions<Page>(this.homePage.page).waitForTimeout(3);
    }
    // test.step(`Add products to basket`, async () => {
      // for(const productName of productNames){
        await test.step(`Add product - '${productName}' to basket .......`, async () => {
          await this.homePage.addProductToBasket(productName);
          // await this.homePage.verifyProductAddNoty(productName);
        });
        // this.addProductToBasket(productName);
      // }
    // });
  }

  async getProductReviewCount(): Promise<number> {
    return await test.step('Get total product review count', async () => {
      await test.step('Wait for xhr\'s to complete', async () => {
        await new CommonActions<Page>(this.homePage.page).waitForNetworkIdle();
      });
      return extractNumberFromText(await this.homePage.getReviewText());
    });
  }

  async expandProductReview() {
    await test.step('Expand product review section', async () => {
      await this.homePage.expandReview();
    });
    await test.step('Verify product review', async () => {
      await this.homePage.verifyReview();
    });
  }

  async closeProductReview() {
    await test.step('Wait for 2 seconds', async () => {
      await new CommonActions<Page>(this.homePage.page).waitForTimeout(2);
    });
    await test.step('Close product review dialog', async () => {
      await this.homePage.closeDialog();
    });
  }
}
