import { Page, expect } from '@playwright/test';
import { HomeLocators } from '../locators/homeLocators';
import { extractAllNumbers } from '../utils/misc';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickAccountButton() {
    await this.page.getByLabel('Show/hide account menu').click();
  }

  async clickLoginButton() {
    await this.page.getByRole('menuitem', { name: 'Go to login page' }).click();
  }

  async clickSignUpLink() {
    await this.page.getByRole('link', { name: 'Not yet a customer?' }).click();
  }

  async enterField() {
    await this.page.getByLabel('Email address field').click();
    await this.page.getByLabel('Field for the password').click();
    await this.page.locator('div').filter({ hasText: /^Repeat Password \*$/ }).nth(1).click();
    await this.page.getByLabel('Selection list for the').locator('div').nth(3).click();
    await this.page.locator('.cdk-overlay-backdrop').click();
    await this.page.locator('.mat-slide-toggle-thumb').click();
    await this.page.getByText('contains at least one lower').click();
    await this.page.getByText('contains at least one upper').click();
    await this.page.getByText('contains at least one digit').click();
    await this.page.getByText('contains at least one special').click();
    await this.page.getByText('contains at least 8 characters').click();
  }
}
