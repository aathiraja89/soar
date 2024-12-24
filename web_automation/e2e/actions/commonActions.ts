import { HomePage } from '../pages/homePage';
import { Locator, Page, test } from '@playwright/test';

export class CommonActions<T extends Page> {
  readonly page: T;


  constructor(page: T) {
    this.page = page;
  }

  async waitForNetworkIdle(): Promise<void> {
    // /rest/products/1/reviews
    /*    const endpointPattern = /\/rest\/products\/\d+\/reviews/;

       // Create a promise to wait for the specific response
        const apiResponsePromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Response not received in time')), 10000); // 60s timeout


          this.page.on('response', async (response) => {
            if (endpointPattern.test(response.url()) && response.status() === 304) {
              clearTimeout(timeout);
              resolve(response);
            }
          });
        });
        // Wait for the API response
        const apiResponse = await apiResponsePromise as import('playwright').APIResponse;
    */

    /*
        // Ensure the page has fully rendered
        await this.page.evaluate(() => {
          return new Promise<void>((resolve) => {
            if (document.readyState === 'complete') {
              this.page.waitForTimeout(2000);
              resolve();
            } else {
              window.addEventListener('load', () => resolve(), { once: true });
            }
          });
        });
        // await this.page.waitForLoadState('domcontentloaded');
        */
    await test.step('Wait for LoadStates', async () => {
      await Promise.all([this.page.waitForLoadState("networkidle"), this.page.waitForLoadState("domcontentloaded")]);
    });
    }

  async waitForTimeout(seconds: number) {
    await test.step(`Wait for ${seconds} seconds`, async () => {
      await this.page.waitForTimeout(seconds * 1000);
    });
  }

  async scrollUntilElementIsVisible(page: Page, locator: Locator) {
    while (!(await locator.isVisible())) {
      await page.mouse.wheel(0, 600);
    }
  }

  getPage(): T {
    return this.page;
  }
}
