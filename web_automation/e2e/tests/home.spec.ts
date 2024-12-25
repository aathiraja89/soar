import { CommonActions } from '../actions/commonActions';
import { test, Page, expect } from '../fixtures/homeFixtures';

test('Navigate to e-commerce site and display all items', async ({ homePage, homeActions }) => {
    // Navigate to the e-commerce web application
    await homePage.navigateTo('/');
    await homePage.closeWelcomeBanner();
    await homePage.dismissCookieMessage();

    // Load maximum items
    const maxItems = await homeActions.loadMaximumItems();
    await homeActions.verifyMaximumItemsDisplayed(maxItems);
});

test('Verify the product review dialog', async ({ homeActions, commonActions }) => {
    await homeActions.navigateToHome();
    await homeActions.selectProduct('Apple Juice');
    // Expand review section if there are any review
    if (await homeActions.getProductReviewCount() > 0) {
        await homeActions.expandProductReview();
        await homeActions.closeProductReview();
    }
    else {
        await test.step('No product review hence the section not expanded', async () => {
            test.fail('Product review failed', async () => { });
        });
    }
});

test.skip('Verify the user registration and login', async ({ loginActions, homeActions }) => {
    await homeActions.navigateToHome();
    await loginActions.navigateToSignup();
    await loginActions.interactFieldsWithNoValues();
    await loginActions.verifyValidationErrors();
    await loginActions.verifyPasswordValidationErrors();

    // Signup
    const email = await loginActions.signup();

    // Login
    await loginActions.login(email);
    await loginActions.verifyLogin(email);
});

test.describe('Product Basket', () => {
    test.describe.configure({ mode: 'serial' });
    test('Verify product basket and payments', async ({ homeActions, loginActions, basketActions, homePage }) => {
        await homeActions.navigateToHome();
        await loginActions.login('aathi@yopmail.com');

        const allProducts = (await homeActions.getInStockProducts());
        const productNames = (allProducts.filter(item => !item.includes('Sold'))).slice(0, 5);
        console.log(productNames)
        for (const productName of productNames)
            await homeActions.addProductsToBasket(productName);
    });

    test('Modify product basket and payments', async ({ homeActions, loginActions, basketActions, homePage }) => {
        await homeActions.navigateToHome();
        await loginActions.login('aathi@yopmail.com');
        await new CommonActions<Page>(homePage.page).waitForNetworkIdle();
        await basketActions.navigateToBasket();
    });

    test('Verify checkout', async ({ homeActions, loginActions, basketActions, homePage, basketPage }) => {
        await homeActions.navigateToHome();
        await loginActions.login('aathi@yopmail.com');
        await new CommonActions<Page>(homePage.page).waitForNetworkIdle();
        await basketPage.clickBasketMenu();
        await new CommonActions<Page>(basketPage.page).waitForNetworkIdle();
        // const response = await basketPage.page.waitForResponse('**/rest/basket/**');
        await new CommonActions<Page>(basketPage.page).waitForMultipleServices(['**/rest/basket/**']);
        await basketActions.addAddress(['Banana Juice', 'Apple Juice', 'Apple Pomace']);
    });
});
