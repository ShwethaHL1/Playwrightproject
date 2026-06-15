import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';



Given('I open the login page', async function (this: CustomWorld) {
  await this.page.goto('https://example.com/login');
});

Then('the page title should contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
  await this.page.waitForTimeout(5000);
  });

Given('user login into the app', async function (this: CustomWorld) {
  await this.pageLocator.testPage.userEmailInput.fill('manish123@gmail.com');
  await this.pageLocator.testPage.passwordInput.fill('Manish9@@');
  await this.pageLocator.testPage.signInButton.click();
});