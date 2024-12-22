import { Page } from '@playwright/test';

/**
 * Gets all the options from a mat-select dropdown.
 * @param page - Playwright Page object.
 * @param matSelectLocator - Selector for the mat-select dropdown.
 * @returns An array of option values.
 */
export async function getMatOptions(page: Page, matSelectLocator: string, matoption: string): Promise<string[]> {
  // Open the dropdown
  await page.locator(matSelectLocator).click();

  // Wait for options to appear
  await page.waitForSelector(matoption);

  // Get all option text values
  const options = await page.locator(matoption).allTextContents();
  return options;
}

/**
 * Clicks on the mat-option containing the specified value.
 * @param page - Playwright Page object.
 * @param optionValue - The value to click.
 */
export async function clickMatOption(page: Page, optionValue: number): Promise<void> {
  // Click the option containing the maximum value
  await page.getByRole('option', {name: `${optionValue}` }).click();
  // await page.locator(`mat-option:text("${optionValue}")`).click();
}
