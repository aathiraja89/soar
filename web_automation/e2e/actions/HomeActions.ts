import { scrollToBottom } from '../utils/scroll';
import { HomePage } from '../pages/homePage';
import { getMatOptions, clickMatOption } from '../utils/components';
import { findMaxOption } from '../utils/misc';
import { CommonLocators } from '../locators/commonLocators';
import { expect } from '@playwright/test';


export class HomeActions {
  readonly homePage: HomePage;


  constructor(homePage: HomePage) {
    this.homePage = homePage;
  }


  async loadMaximumItems(): Promise<number> {
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
  }

  async verifyMaximumItemsDisplayed(maxItems: number) {
    // Assert that the maximum option is selected
    const selectedValue = await this.homePage.page.locator(CommonLocators.matSelectDropdown).textContent();
    console.log('Selected Value:', selectedValue?.trim());
    expect(Number(selectedValue?.trim())).toBe(maxItems);

    // Assert that all items are displayed
    const itemCount = await this.homePage.getItemsCount();
    console.log(`Number of items displayed: ${itemCount}`);
    expect(itemCount).toEqual(await this.homePage.getTotalItems());
  }
}
