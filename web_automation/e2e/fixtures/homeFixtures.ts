import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { HomeActions } from '../actions/HomeActions';

type CustomFixtures = {
  homePage: HomePage;
  homeActions: HomeActions;
};

export const test = baseTest.extend<CustomFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  homeActions: async ({ homePage }, use) => {
    const homeActions = new HomeActions(homePage);
    await use(homeActions);
  },
});

export { expect } from '@playwright/test';
