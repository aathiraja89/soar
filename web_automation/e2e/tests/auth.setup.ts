import { test as setup, expect } from '@playwright/test';
import { LoginActions } from '../actions/loginActions';
import { HomeActions } from '../actions/HomeActions';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginActions = new LoginActions(new LoginPage(page));
  const homePage = new HomePage(page);
  // await homePage.navigateToHome();
  await homePage.navigateTo('/');
  await homePage.closeWelcomeBanner();
  await homePage.dismissCookieMessage();
  await loginActions.login("aathi@yopmail.com");
  await loginActions.verifyLogin("aathi@yopmail.com");

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
