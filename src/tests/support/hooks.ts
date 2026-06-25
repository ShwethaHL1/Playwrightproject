import { Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { CustomWorld } from './world';
import { PageManager } from '../locators/POManager';

Before(async function (this: CustomWorld) {
  const headless = process.env.CI === 'true';
  this.browser = await chromium.launch({ headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.pageLocator = new PageManager(this.page);
  //this.page.goto('https://eventhub.rahulshettyacademy.com/')
  //this.pageLocator.testPage.userEmailInput.fill('manish123@gmail.com');
  //this.pageLocator.testPage.passwordInput.fill('Manish9@@');
  //this.pageLocator.testPage.signInButton.click();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});