import { LoginPage } from '../pages/loginPage';
import { test, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CommonActions } from '../actions/commonActions';

export class LoginActions {
  readonly loginPage: LoginPage;


  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  async login(email: string) {
    await test.step('Login to e-commerce web application', async () => {
      // Login to the e-commerce web application
      // await this.loginPage.page.getByRole('link', { name: 'Already a customer?' }).click();
      test.info().annotations.push({ type: 'User', description: email + ' - Test@123' });
      await this.loginPage.clickAccountButton();
      await this.loginPage.clickLoginButton();
      await this.loginPage.page.getByLabel('Text field for the login email').fill(email);
      await this.loginPage.page.getByLabel('Text field for the login password').fill('Test@123');
      await this.loginPage.page.getByLabel('Login', { exact: true }).click();
    });
  }

  async verifyLogin(email: string) {
    await test.step('Verify Login to the e-commerce web application', async () => {
      await this.loginPage.page.getByLabel('Show/hide account menu').click();
      await new CommonActions<Page>(this.loginPage.page).waitForNetworkIdle();
      await new CommonActions<Page>(this.loginPage.page).waitForTimeout(2);
      const userProfile = this.loginPage.page.getByRole('menuitem', { name: 'Go to user profile' });
      const userEmail = await userProfile.locator('span').textContent();
      expect(userEmail?.trim()).toEqual(email);
    });
  }

  async navigateToSignup() {
    await test.step('Navigate to Sign-up', async () => {
      // Navigate to the e-commerce web application
      await this.loginPage.clickAccountButton();
      await this.loginPage.clickLoginButton();
      await this.loginPage.clickSignUpLink();
    });
  }

  async signup(): Promise<string> {
    return await test.step('Sign-up and create a new user', async () => {
      const email = faker.internet.email().toString();
      await this.loginPage.page.getByLabel('Email address field').fill(email);
      await this.loginPage.page.getByLabel('Field for the password').fill('Test@123');
      await this.loginPage.page.getByLabel('Field to confirm the password').fill('Test@123');
      await this.loginPage.page.getByLabel('Selection list for the').locator('span').click();
      await this.loginPage.page.getByText('Your eldest siblings middle').click();
      await this.loginPage.page.getByPlaceholder('Answer to your security').fill('test');
      await this.loginPage.page.getByLabel('Button to complete the').click();
      await this.loginPage.page.getByText('Registration completed').click();
      return email;
    });
  }

  async interactFieldsWithNoValues() {
    await test.step('Interact fields without entering values', async () => {
      await this.loginPage.page.getByLabel('Email address field').click();
      await this.loginPage.page.getByLabel('Field for the password').click();
      await this.loginPage.page.locator('div').filter({ hasText: /^Repeat Password \*$/ }).nth(1).click();
      await this.loginPage.page.locator('.mat-slide-toggle-thumb').click();

      await this.loginPage.page.getByLabel('Selection list for the').locator('div').nth(2).click();
      await this.loginPage.page.keyboard.press('Escape');
      await this.loginPage.page.getByPlaceholder('Answer to your security').click();
      await this.loginPage.page.locator('app-register div').filter({ hasText: 'User RegistrationEmail *' }).click();
    });
  }

  async verifyValidationErrors() {
    await test.step('Verify validation errors on fields with no values', async () => {
      await expect(this.loginPage.page.getByText('Please provide an email')).toBeVisible();
      await expect(this.loginPage.page.getByText('Please provide a password.')).toBeVisible();
      await expect(this.loginPage.page.getByText('Please repeat your password.')).toBeVisible();
      await expect(this.loginPage.page.getByText('Please select a security')).toBeVisible();
      await expect(this.loginPage.page.getByText('Please provide an answer to')).toBeVisible();
    });
  }

  async verifyPasswordValidationErrors() {
    await test.step('Verify password validation errors', async () => {
      await expect(this.loginPage.page.getByText('contains at least one lower')).toBeVisible();
      await expect(this.loginPage.page.getByText('contains at least one upper')).toBeVisible();
      await expect(this.loginPage.page.getByText('contains at least one digit')).toBeVisible();
      await expect(this.loginPage.page.getByText('contains at least one special')).toBeVisible();
      await expect(this.loginPage.page.getByText('contains at least 8 characters')).toBeVisible();
    });
  }
}
