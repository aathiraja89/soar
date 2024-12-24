import { test as baseTest, Page } from '@playwright/test';
import { BasketPage } from '../pages/basketPage';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { HomeActions } from '../actions/HomeActions';
import { CommonActions } from '../actions/commonActions';
import { LoginActions } from '../actions/loginActions';
import { BasketActions } from '../actions/basketActions';

type CustomFixtures = {
  basketPage: BasketPage;
  homePage: HomePage;
  loginPage: LoginPage;
  homeActions: HomeActions;
  commonActions: CommonActions<Page>;
  loginActions: LoginActions;
  basketActions: BasketActions;
};

export const test = baseTest.extend<CustomFixtures>({
  basketPage: async ({ page }, use) => {
    const basketPage = new BasketPage(page);
    await use(basketPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homeActions: async ({ homePage }, use) => {
    const homeActions = new HomeActions(homePage);
    await use(homeActions);
  },
  commonActions: async ({ homePage }, use) => {
    const commonActions = new CommonActions<Page>(homePage.page);
    await use(commonActions);
  },
  loginActions: async ({ loginPage }, use) => {
    const loginActions = new LoginActions(loginPage);
    await use(loginActions);
  },
  basketActions: async ({ basketPage }, use) => {
    const basketActions = new BasketActions(basketPage);
    await use(basketActions);
  },
});

export { Page, expect } from '@playwright/test';
