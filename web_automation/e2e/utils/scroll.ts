import { Page } from '@playwright/test';

export async function scrollToBottom(page: Page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(2000); // Allow time for lazy-loaded elements
}
