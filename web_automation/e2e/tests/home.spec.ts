import { test, expect } from '../fixtures/homeFixtures';


test('Navigate to e-commerce site and display all items', async ({ homePage, homeActions }) => {
    // Navigate to the e-commerce web application
    await homePage.navigateTo('/');
    await homePage.closeWelcomeBanner();
    await homePage.dismissCookieMessage();

    // Load maximum items
    const maxItems = await homeActions.loadMaximumItems();
    await homeActions.verifyMaximumItemsDisplayed(maxItems);
});
